import Bytez from "bytez.js";
import { supabase } from "@/db/supabase";

export type EmotionItem = {
  emotion: string;
  score: number;
};

export async function detectEmotion(text: string, mock = false): Promise<EmotionItem[]> {
  const t = (text || "").trim();
  if (!t) throw new Error("Text is required");

  if (mock) return generateMockEmotions(t);

  const apilayerKey = (import.meta.env.VITE_APILAYER_KEY as string | undefined) ||
    (typeof window !== "undefined" ? window.localStorage.getItem("APILAYER_KEY") || undefined : undefined);
  const bytezKey = (import.meta.env.VITE_BYTEZ_API_KEY as string | undefined) ||
    (typeof window !== "undefined" ? window.localStorage.getItem("BYTEZ_KEY") || undefined : undefined);
  const supabaseReady = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  if (apilayerKey) {
    try {
      const res = await fetch("https://api.apilayer.com/text_to_emotion", {
        method: "POST",
        headers: { apikey: apilayerKey, "Content-Type": "text/plain" },
        body: t,
      });
      if (!res.ok) throw new Error(`Emotion API error: ${res.status}`);
      let payload: any;
      try {
        payload = await res.json();
      } catch {
        const txt = await res.text();
        try { payload = JSON.parse(txt); } catch { payload = {}; }
      }
      const items: EmotionItem[] = [];
      if (payload && typeof payload === "object") {
        for (const k of Object.keys(payload)) {
          const v = Number((payload as any)[k]);
          if (!Number.isNaN(v)) items.push({ emotion: k.toLowerCase(), score: v });
        }
      }
      if (items.length) return items;
    } catch {}
  }

  if (bytezKey) {
    try {
      const sdk = new Bytez(bytezKey);
      const model = sdk.model("daspartho/text-emotion");
      const { error, output } = await model.run(t);
      if (error) throw new Error(typeof error === "string" ? error : "Bytez error");
      const items: EmotionItem[] = [];
      if (Array.isArray(output)) {
        for (const o of output as any[]) {
          const label = (o?.label ?? o?.emotion ?? o?.name ?? "").toString().toLowerCase();
          const score = Number(o?.score ?? o?.confidence ?? o?.value ?? 0);
          if (label && !Number.isNaN(score)) items.push({ emotion: label, score });
        }
      } else if (output && typeof output === "object") {
        for (const k of Object.keys(output as any)) {
          const v = Number((output as any)[k]);
          if (!Number.isNaN(v)) items.push({ emotion: k.toLowerCase(), score: v });
        }
      }
      if (items.length) return items;
    } catch {}
  }

  if (supabaseReady) {
    try {
      const { data, error } = await supabase.functions.invoke("text-emotion", { body: { text: t } });
      if (error) throw new Error(error.message || "Emotion function error");
      const items: EmotionItem[] = (data?.items || []).map((i: any) => ({ emotion: String(i.emotion).toLowerCase(), score: Number(i.score) }));
      if (items.length) return items;
    } catch {}
  }

  return generateMockEmotions(t);
}

function generateMockEmotions(text: string): EmotionItem[] {
  const emotions = ["happy", "sad", "angry", "fear", "surprise"];
  const hash = text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  let remaining = 1;
  const items: EmotionItem[] = [];
  emotions.forEach((emotion, idx) => {
    if (idx === emotions.length - 1) {
      items.push({ emotion, score: Number(remaining.toFixed(2)) });
    } else {
      const val = ((hash * (idx + 1)) % 100) / 100;
      const score = Math.min(remaining, val * 0.5);
      remaining -= score;
      items.push({ emotion, score: Number(score.toFixed(2)) });
    }
  });
  return items.sort((a, b) => b.score - a.score);
}