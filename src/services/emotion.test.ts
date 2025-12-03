import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { detectEmotion } from "./emotion";

const originalEnv = { ...import.meta.env } as Record<string, any>;

describe("detectEmotion", () => {
  beforeEach(() => {
    (import.meta.env as any).VITE_APILAYER_KEY = "test-key";
    delete (import.meta.env as any).VITE_SUPABASE_URL;
    delete (import.meta.env as any).VITE_SUPABASE_ANON_KEY;
  });
  afterEach(() => {
    for (const k of Object.keys(import.meta.env)) delete (import.meta.env as any)[k];
    Object.assign(import.meta.env, originalEnv);
    vi.restoreAllMocks();
  });

  it("maps Apilayer response into emotion items", async () => {
    const mock = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ Happy: 0.25, Fear: 0.5, Surprise: 0.25, Angry: 0, Sad: 0 }),
    } as any);
    const items = await detectEmotion("hello world");
    expect(mock).toHaveBeenCalled();
    expect(items.length).toBeGreaterThan(0);
    const top = [...items].sort((a, b) => b.score - a.score)[0];
    expect(top.emotion).toBe("fear");
    expect(top.score).toBeCloseTo(0.5);
  });

  it("returns mock when providers missing", async () => {
    delete (import.meta.env as any).VITE_APILAYER_KEY;
    delete (import.meta.env as any).VITE_SUPABASE_URL;
    delete (import.meta.env as any).VITE_SUPABASE_ANON_KEY;
    const mock = vi.spyOn(global, "fetch");
    const items = await detectEmotion("x");
    expect(items.length).toBeGreaterThan(0);
    expect(mock).not.toHaveBeenCalled();
  });
});