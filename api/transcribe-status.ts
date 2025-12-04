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
      return new Response(JSON.stringify({ success: false, error: "Missing ASSEMBLYAI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { id, enableSpeakerLabels } = (await req.json()) as { id: string; enableSpeakerLabels?: boolean };
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "Transcript id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseUrl = "https://api.assemblyai.com/v2";
    const poll = await fetch(`${baseUrl}/transcript/${id}`, { headers: { authorization: ASSEMBLYAI_API_KEY } });
    if (!poll.ok) {
      const errTxt = await poll.text();
      return new Response(JSON.stringify({ success: false, error: `Status check failed: ${errTxt}` }), {
        status: poll.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await poll.json();
    const status = data.status as string;
    if (status !== "completed") {
      return new Response(JSON.stringify({ success: true, status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!data.text) {
      return new Response(JSON.stringify({ success: false, error: "Transcription completed but no text was generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalize = (s: string) => s.trim().toLowerCase().replace(/^speaker\s*/i, "");
    let utterances: Array<{ speaker: string; text: string; start: number; end: number; confidence: number }> | undefined;
    let speakerCount: number | undefined;
    if (enableSpeakerLabels && Array.isArray(data.utterances)) {
      const filtered = data.utterances.filter((u: any) => (u.confidence ?? 0) >= 0.5);
      const originals = Array.from(new Set(filtered.map((u: any) => normalize(String(u.speaker || "")))));
      const labelMap = new Map<string, string>();
      for (let i = 0; i < originals.length; i++) {
        const letter = String.fromCharCode(65 + (i % 26));
        labelMap.set(originals[i], `Speaker ${letter}`);
      }
      utterances = data.utterances.map((u: any) => {
        const key = normalize(String(u.speaker || ""));
        return { ...u, speaker: labelMap.get(key) ?? u.speaker };
      });
      speakerCount = originals.length || 1;
    }

    return new Response(
      JSON.stringify({ success: true, status: "completed", text: data.text, utterances, speakerCount }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
}

