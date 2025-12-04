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
      return new Response(JSON.stringify({ success: false, error: "No audio URL or data provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    return new Response(JSON.stringify({ success: true, id: created.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
}

