import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ASSEMBLYAI_API_KEY = Deno.env.get("ASSEMBLYAI_API_KEY");
const ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

interface StartRequest {
  audioUrl?: string;
  audioData?: string;
}

interface UploadResp { upload_url: string }

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioUrl, audioData }: StartRequest = await req.json();

    if (!ASSEMBLYAI_API_KEY) {
      return new Response(JSON.stringify({ error: "AssemblyAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let uploadUrl = audioUrl;

    if (audioData) {
      const base64 = audioData.split(",")[1] || "";
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const up = await fetch(`${ASSEMBLYAI_BASE_URL}/upload`, {
        method: "POST",
        headers: { authorization: ASSEMBLYAI_API_KEY, "content-type": "application/octet-stream" },
        body: bytes,
      });
      if (!up.ok) {
        const txt = await up.text();
        throw new Error(`Upload failed: ${txt}`);
      }
      const json: UploadResp = await up.json();
      uploadUrl = json.upload_url;
    }

    if (!uploadUrl) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const res = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript`, {
      method: "POST",
      headers: { authorization: ASSEMBLYAI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ audio_url: uploadUrl }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Transcription request failed: ${txt}`);
    }
    const payload = await res.json();
    const id = String(payload?.id || "");

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
