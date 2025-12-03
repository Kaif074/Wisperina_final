import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const APILAYER_KEY = Deno.env.get("APILAYER_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
};

interface EmotionItem {
  emotion: string;
  score: number;
}

interface EmotionRequestBody {
  text: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text }: EmotionRequestBody = await req.json();
    const t = (text || "").trim();
    if (!t) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!APILAYER_KEY) {
      throw new Error("API key not configured");
    }

    const res = await fetch("https://api.apilayer.com/text_to_emotion", {
      method: "POST",
      headers: {
        apikey: APILAYER_KEY,
        "Content-Type": "text/plain",
      },
      body: t,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Emotion API error: ${res.status} ${text}`);
    }

    let payload: Record<string, number> = {} as any;
    try {
      payload = await res.json();
    } catch {
      const txt = await res.text();
      try { payload = JSON.parse(txt); } catch { payload = {} as any; }
    }

    const items: EmotionItem[] = [];
    for (const k of Object.keys(payload || {})) {
      const v = Number(payload[k as keyof typeof payload]);
      if (!Number.isNaN(v)) {
        items.push({ emotion: k.toLowerCase(), score: v });
      }
    }

    if (items.length === 0) {
      throw new Error("No emotions returned");
    }

    return new Response(JSON.stringify({ success: true, items }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});