// Vercel Serverless Function: Transcribe audio/video via AssemblyAI
// Expects JSON body: { audioUrl?: string; audioData?: string; enableSpeakerLabels?: boolean }
// Env: ASSEMBLYAI_API_KEY (set in Vercel Project Settings)

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  } as const;

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY || "";
    if (!ASSEMBLYAI_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing ASSEMBLYAI_API_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { audioUrl, audioData, enableSpeakerLabels } = (await req.json()) as {
      audioUrl?: string;
      audioData?: string;
      enableSpeakerLabels?: boolean;
    };

    const baseUrl = "https://api.assemblyai.com/v2";
    let uploadUrl = audioUrl;

    if (audioData) {
      const base64 = audioData.includes(",") ? audioData.split(",")[1] : audioData;
      const binary = Uint8Array.from(Buffer.from(base64, "base64"));
      const up = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        headers: { authorization: ASSEMBLYAI_API_KEY, "content-type": "application/octet-stream" },
        body: binary,
      });
      if (!up.ok) {
        const txt = await up.text();
        return new Response(JSON.stringify({ success: false, error: `Upload failed: ${txt}` }), {
          status: up.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const payload = (await up.json()) as { upload_url: string };
      uploadUrl = payload.upload_url;
    }

    if (!uploadUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "No audio URL or data provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const create = await fetch(`${baseUrl}/transcript`, {
      method: "POST",
      headers: { authorization: ASSEMBLYAI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ audio_url: uploadUrl, speech_model: "universal", speaker_labels: !!enableSpeakerLabels }),
    });
    if (!create.ok) {
      const err = await create.text();
      return new Response(JSON.stringify({ success: false, error: `Transcription request failed: ${err}` }), {
        status: create.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const created = (await create.json()) as { id: string };

    let status = "queued" as string;
    let out: any = null;
    const maxAttempts = 60;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, 2000));
      const poll = await fetch(`${baseUrl}/transcript/${created.id}`, {
        headers: { authorization: ASSEMBLYAI_API_KEY },
      });
      if (!poll.ok) {
        const errTxt = await poll.text();
        return new Response(JSON.stringify({ success: false, error: `Status check failed: ${errTxt}` }), {
          status: poll.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const data = await poll.json();
      status = data.status;
      if (status === "completed") { out = data; break; }
      if (status === "error") {
        return new Response(JSON.stringify({ success: false, error: data.error || "Transcription failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (!out || status !== "completed") {
      return new Response(JSON.stringify({ success: false, error: "Transcription timeout - please try again" }), {
        status: 504,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!out.text) {
      return new Response(JSON.stringify({ success: false, error: "Transcription completed but no text was generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalize = (s: string) => s.trim().toLowerCase().replace(/^speaker\s*/i, "");
    let utterances: Array<{ speaker: string; text: string; start: number; end: number; confidence: number }> | undefined;
    let speakerCount: number | undefined;
    if (enableSpeakerLabels && Array.isArray(out.utterances)) {
      const filtered = out.utterances.filter((u: any) => (u.confidence ?? 0) >= 0.5);
      const originals = Array.from(new Set(filtered.map((u: any) => normalize(String(u.speaker || "")))));
      const labelMap = new Map<string, string>();
      for (let i = 0; i < originals.length; i++) {
        const letter = String.fromCharCode(65 + (i % 26));
        labelMap.set(originals[i], `Speaker ${letter}`);
      }
      utterances = out.utterances.map((u: any) => {
        const key = normalize(String(u.speaker || ""));
        return { ...u, speaker: labelMap.get(key) ?? u.speaker };
      });
      speakerCount = originals.length || 1;
    }

    return new Response(
      JSON.stringify({ success: true, text: out.text, utterances, speakerCount }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
}

