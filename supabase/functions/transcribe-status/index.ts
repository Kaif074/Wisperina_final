import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ASSEMBLYAI_API_KEY = Deno.env.get("ASSEMBLYAI_API_KEY");
const ASSEMBLYAI_BASE_URL = "https://api.assemblyai.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

interface StatusReq {
  id: string;
  enableSpeakerLabels?: boolean;
}

interface Utterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id, enableSpeakerLabels }: StatusReq = await req.json();
    const tid = (id || "").trim();
    if (!tid) {
      return new Response(JSON.stringify({ error: "id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!ASSEMBLYAI_API_KEY) {
      throw new Error("AssemblyAI API key not configured");
    }

    const res = await fetch(`${ASSEMBLYAI_BASE_URL}/transcript/${tid}`, {
      headers: { authorization: ASSEMBLYAI_API_KEY },
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Status check failed: ${txt}`);
    }
    const payload = await res.json();
    const status = String(payload?.status || "");

    if (status !== "completed") {
      return new Response(JSON.stringify({ success: true, status }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let utterances: Utterance[] | undefined = payload?.utterances;
    let speakerCount: number | undefined = undefined;
    if (enableSpeakerLabels && Array.isArray(utterances)) {
      const normalize = (s: string) => s.trim().toLowerCase().replace(/^speaker\s*/i, "");
      const filtered = utterances.filter((u) => (u.confidence ?? 0) >= 0.5);
      const originals = Array.from(new Set(filtered.map((u) => normalize(u.speaker))));
      const labelMap = new Map<string, string>();
      for (let i = 0; i < originals.length; i++) {
        const letter = String.fromCharCode(65 + (i % 26));
        labelMap.set(originals[i], `Speaker ${letter}`);
      }
      utterances = utterances.map((u) => {
        const key = normalize(u.speaker);
        return { ...u, speaker: labelMap.get(key) ?? u.speaker };
      });
      speakerCount = originals.length || 1;
    }

    return new Response(
      JSON.stringify({
        success: true,
        status,
        text: String(payload?.text || ""),
        utterances,
        speakerCount,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
