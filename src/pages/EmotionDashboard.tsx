import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detectEmotion, type EmotionItem } from "@/services/emotion";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import MultiSelect from "@/components/ui/multi-select";

type EmotionRecord = {
  timestamp: number;
  items: EmotionItem[];
  durationMs: number;
};

const EMOTION_COLORS: Record<string, string> = {
  joy: "#22c55e",
  happy: "#22c55e",
  happiness: "#22c55e",
  sadness: "#3b82f6",
  sad: "#3b82f6",
  anger: "#ef4444",
  angry: "#ef4444",
  fear: "#a855f7",
  disgust: "#ea580c",
  surprise: "#eab308",
  neutral: "#64748b",
};

function faceForEmotion(e: string) {
  const k = e.toLowerCase();
  if (k.includes("joy") || k.includes("happy")) return "😊";
  if (k.includes("sad")) return "😢";
  if (k.includes("anger") || k.includes("angry")) return "😠";
  if (k.includes("fear")) return "😨";
  if (k.includes("disgust")) return "🤢";
  if (k.includes("surprise")) return "😲";
  return "😐";
}

function toCsv(rows: Array<Record<string, any>>) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")].concat(
    rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))
  );
  return lines.join("\n");
}

async function exportSvgAsPng(svgEl: SVGSVGElement, filename: string) {
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load SVG"));
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = svgEl.clientWidth || 1280;
  canvas.height = svgEl.clientHeight || 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context missing");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);
  const pngUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = pngUrl;
  a.download = filename;
  a.click();
}

export default function EmotionDashboard() {
  const [live, setLive] = useState(true);
  const [mock, setMock] = useState(false);
  const [text, setText] = useState("");
  const [records, setRecords] = useState<EmotionRecord[]>([]);
  const [startIso, setStartIso] = useState<string>("");
  const [endIso, setEndIso] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [latestItems, setLatestItems] = useState<EmotionItem[]>([]);
  const [latestEmotion, setLatestEmotion] = useState<string>("neutral");
  const [latestScore, setLatestScore] = useState<number>(0);
  const [totalCalls, setTotalCalls] = useState(0);
  const [successCalls, setSuccessCalls] = useState(0);
  const [avgLatency, setAvgLatency] = useState(0);

  const debouncedText = useDebounce(text, 500);

  // Check for API key availability
  const hasApiKey = useMemo(() => {
    const a = import.meta.env.VITE_APILAYER_KEY || (typeof window !== "undefined" && window.localStorage.getItem("APILAYER_KEY"));
    const b = import.meta.env.VITE_BYTEZ_API_KEY || (typeof window !== "undefined" && window.localStorage.getItem("BYTEZ_KEY"));
    const s = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    return !!(a || b || s);
  }, []);

  // Auto-enable mock if no key
  useEffect(() => {
    if (!hasApiKey) {
      setMock(true);
      toast.info("API Key missing. Switched to Mock Mode.");
    }
  }, [hasApiKey]);

  const timeFiltered = useMemo(() => {
    const start = startIso ? new Date(startIso).getTime() : -Infinity;
    const end = endIso ? new Date(endIso).getTime() : Infinity;
    return records.filter((r) => r.timestamp >= start && r.timestamp <= end);
  }, [records, startIso, endIso]);

  const emotionSet = useMemo(() => {
    const s = new Set<string>();
    records.forEach((r) => r.items.forEach((i) => s.add(i.emotion)));
    return Array.from(s);
  }, [records]);

  const filteredEmotions = selected.length ? selected : emotionSet;

  const lineData = useMemo(() => {
    return timeFiltered.map((r) => {
      const base: Record<string, any> = { time: new Date(r.timestamp).toLocaleTimeString() };
      r.items.forEach((i) => {
        base[i.emotion] = i.score;
      });
      return base;
    });
  }, [timeFiltered]);

  const distData = useMemo(() => {
    const counts: Record<string, number> = {};
    timeFiltered.forEach((r) => {
      const top = [...r.items].sort((a, b) => b.score - a.score)[0];
      if (!top) return;
      counts[top.emotion] = (counts[top.emotion] || 0) + 1;
    });
    return Object.entries(counts).map(([emotion, value]) => ({ name: emotion, value }));
  }, [timeFiltered]);

  const barData = useMemo(() => {
    const avg: Record<string, { sum: number; n: number }> = {};
    timeFiltered.forEach((r) => {
      r.items.forEach((i) => {
        const v = avg[i.emotion] || { sum: 0, n: 0 };
        v.sum += i.score;
        v.n += 1;
        avg[i.emotion] = v;
      });
    });
    return Object.entries(avg).map(([emotion, { sum, n }]) => ({ emotion, avg: n ? sum / n : 0 }));
  }, [timeFiltered]);

  useEffect(() => {
    if (!live) return;
    if (!debouncedText.trim()) return;
    const run = async () => {
      const t0 = performance.now();
      setTotalCalls((c) => c + 1);
      try {
        const items = await detectEmotion(debouncedText.trim(), mock);
        const t1 = performance.now();
        const dur = t1 - t0;
        setSuccessCalls((c) => c + 1);
        setAvgLatency((prev) => (prev * (successCalls || 1) + dur) / ((successCalls || 1) + 1));
        setLatestItems(items);
        const top = [...items].sort((a, b) => b.score - a.score)[0];
        setLatestEmotion(top?.emotion || "neutral");
        setLatestScore(top?.score || 0);
        setRecords((rs) => rs.concat([{ timestamp: Date.now(), items, durationMs: dur }]));
      } catch (e) {
        toast.error((e as Error).message || "Detection failed");
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText, live, mock]);

  const handleDetect = async () => {
    const t = text.trim();
    if (!t) return;
    const t0 = performance.now();
    setTotalCalls((c) => c + 1);
    try {
      const items = await detectEmotion(t, mock);
      const t1 = performance.now();
      const dur = t1 - t0;
      setSuccessCalls((c) => c + 1);
      setAvgLatency((prev) => (prev * (successCalls || 1) + dur) / ((successCalls || 1) + 1));
      setLatestItems(items);
      const top = [...items].sort((a, b) => b.score - a.score)[0];
      setLatestEmotion(top?.emotion || "neutral");
      setLatestScore(top?.score || 0);
      setRecords((rs) => rs.concat([{ timestamp: Date.now(), items, durationMs: dur }]));
    } catch (e) {
      toast.error((e as Error).message || "Detection failed");
    }
  };

  const exportCsv = () => {
    const rows: Array<Record<string, any>> = [];
    timeFiltered.forEach((r) => {
      r.items.forEach((i) => {
        rows.push({ timestamp: new Date(r.timestamp).toISOString(), emotion: i.emotion, score: i.score.toFixed(4) });
      });
    });
    const content = toCsv(rows);
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emotion-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const exportPngFromRef = async (ref: React.RefObject<HTMLDivElement | null>, name: string) => {
    const svg = ref.current?.querySelector("svg") as SVGSVGElement | null;
    if (!svg) {
      toast.error("Chart not ready");
      return;
    }
    try {
      await exportSvgAsPng(svg, name);
      toast.success("Exported PNG");
    } catch (e) {
      toast.error((e as Error).message || "Export failed");
    }
  };

  const printPdf = () => {
    window.print();
  };

  const options = emotionSet.map((e) => ({ value: e, label: e }));

  return (
    <div className="min-h-screen p-4 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Emotion Detection Dashboard</CardTitle>
              {mock && <div className="bg-yellow-500/20 text-yellow-600 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-500/30">Mock Mode Active</div>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid xl:grid-cols-4 gap-4 items-end">
              <div className="xl:col-span-2 space-y-2">
                <Label>Input Text</Label>
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type text to analyze" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={live} onCheckedChange={setLive} id="live" />
                  <Label htmlFor="live">Live Mode</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={mock} onCheckedChange={setMock} id="mock" />
                  <Label htmlFor="mock">Mock Data</Label>
                </div>
              </div>
              <Button onClick={handleDetect} disabled={!text.trim()}>Analyze</Button>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
              <div className="flex items-center justify-center rounded-lg border p-6">
                <div className="text-center">
                  <div className="text-7xl leading-none">{faceForEmotion(latestEmotion)}</div>
                  <div className="mt-2 text-lg font-semibold capitalize">{latestEmotion}</div>
                  <div className="text-sm text-muted-foreground">Confidence: {(latestScore * 100).toFixed(1)}%</div>
                </div>
              </div>

              <div className="xl:col-span-2 rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <Label>Time Range</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="datetime-local" value={startIso} onChange={(e) => setStartIso(e.target.value)} />
                      <Input type="datetime-local" value={endIso} onChange={(e) => setEndIso(e.target.value)} />
                    </div>
                  </div>
                  <div className="w-64">
                    <Label>Focus Emotions</Label>
                    <MultiSelect options={options} value={selected} onChange={setSelected} />
                  </div>
                </div>

                <Tabs defaultValue="trend">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="trend">Trends</TabsTrigger>
                    <TabsTrigger value="distribution">Distribution</TabsTrigger>
                    <TabsTrigger value="average">Average Scores</TabsTrigger>
                  </TabsList>
                  <TabsContent value="trend">
                    <div ref={lineRef} className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis domain={[0, 1]} />
                          <RTooltip />
                          <Legend />
                          {filteredEmotions.map((e) => (
                            <Line key={e} type="monotone" dataKey={e} stroke={EMOTION_COLORS[e] || "#0ea5e9"} dot={false} />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" onClick={() => exportPngFromRef(lineRef, "trend.png")}>Export PNG</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="distribution">
                    <div ref={pieRef} className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={distData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label>
                            {distData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={EMOTION_COLORS[entry.name] || "#0ea5e9"} />
                            ))}
                          </Pie>
                          <Legend />
                          <RTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" onClick={() => exportPngFromRef(pieRef, "distribution.png")}>Export PNG</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="average">
                    <div ref={barRef} className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="emotion" />
                          <YAxis domain={[0, 1]} />
                          <RTooltip />
                          <Legend />
                          <Bar dataKey="avg" fill="#0ea5e9" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" onClick={() => exportPngFromRef(barRef, "average.png")}>Export PNG</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {latestItems.map((i, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="capitalize">{i.emotion}</span>
                        <span className="text-sm text-muted-foreground">{(i.score * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>System accuracy</span><span>{(latestScore * 100).toFixed(1)}%</span></div>
                    <div className="flex justify-between"><span>Processing speed</span><span>{avgLatency.toFixed(0)} ms</span></div>
                    <div className="flex justify-between"><span>Detection success rate</span><span>{totalCalls ? ((successCalls / totalCalls) * 100).toFixed(1) : "0.0"}%</span></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
                    <Button variant="outline" onClick={printPdf}>Export PDF</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}