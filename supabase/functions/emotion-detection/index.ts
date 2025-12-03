import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const EDENAI_API_KEY = Deno.env.get("EDENAI_API_KEY");
const EDENAI_URL = "https://api.edenai.run/v2/text/emotion_detection";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

interface EmotionRequestBody {
  text?: string;
}

interface EdenAIResponseItem {
  emotion: string;
  score: number;
}

interface EdenAIResponseVernAI {
  items?: EdenAIResponseItem[];
}

interface EdenAIResponse {
  vernai?: EdenAIResponseVernAI;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!EDENAI_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing EDENAI_API_KEY" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = (await req.json()) as EmotionRequestBody;
    const text = (body.text || "").trim();

    if (!text) {
      return new Response(
        JSON.stringify({ success: false, error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resp = await fetch(EDENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${EDENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providers: "vernai", text }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return new Response(
        JSON.stringify({ success: false, error: errText || "EdenAI request failed" }),
        { status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = (await resp.json()) as EdenAIResponse;
    const items = data?.vernai?.items || [];

    return new Response(
      JSON.stringify({ success: true, items }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: (e as Error).message || "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}