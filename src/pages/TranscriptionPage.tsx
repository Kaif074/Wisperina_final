import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Link as LinkIcon, FileAudio, Loader2, Copy, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { supabase, isSupabaseConfigured } from "@/db/supabase";
import { toast } from "sonner";
import { TranscriptionResult, VideoPlayerRef } from "@/types/transcription";
import { detectEmotion, type EmotionItem } from "@/services/emotion";
import { VideoPlayer } from "@/components/transcription/VideoPlayer";
import { TranscriptViewer } from "@/components/transcription/TranscriptViewer";
import { SpeakerTimeline } from "@/components/transcription/SpeakerTimeline";
import ProcessingAnimation from "@/components/transcription/ProcessingAnimation";

export default function TranscriptionPage() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [enableSpeakerLabels, setEnableSpeakerLabels] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [mediaUrl, setMediaUrl] = useState("");
  const [isVideoFile, setIsVideoFile] = useState(false);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const [emotionItems, setEmotionItems] = useState<EmotionItem[]>([]);
  const [isDetectingEmotion, setIsDetectingEmotion] = useState(false);
  const [emotionError, setEmotionError] = useState("");

  const faceForEmotion = (e: string) => {
    const k = e.toLowerCase();
    if (k.includes("joy") || k.includes("happy")) return "😊";
    if (k.includes("sad")) return "😢";
    if (k.includes("anger") || k.includes("angry")) return "😠";
    if (k.includes("fear")) return "😨";
    if (k.includes("disgust")) return "🤢";
    if (k.includes("surprise")) return "😲";
    return "😐";
  };

  // Throttled time update handler to prevent excessive re-renders
  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Memoized seek handler to prevent recreation on every render
  const handleSeek = useCallback((time: number) => {
    videoPlayerRef.current?.seekTo(time);
  }, []);

  // Cleanup media URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [mediaUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaUrl);
      }
      const videoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
      const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
      
      const validTypes = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/wave",
        "audio/x-wav",
        "audio/x-m4a",
        "audio/m4a",
        "audio/mp4",
        "audio/flac",
        "audio/x-flac",
        "audio/ogg",
        "audio/vorbis",
        "audio/webm",
        "audio/aac",
        ...videoTypes,
      ];
      
      const validExtensions = [
        ".mp3", ".wav", ".m4a", ".flac", ".ogg", 
        ".aac", ".webm", ".opus", ".wma",
        ...videoExtensions,
      ];
      
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      const isValidType = validTypes.includes(file.type);
      const isValidExtension = validExtensions.includes(fileExtension);

      if (!isValidType && !isValidExtension) {
        setError(`Invalid file format. Please upload an audio or video file. Detected type: ${file.type || "unknown"}`);
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB");
        return;
      }

      const isVideo = videoTypes.includes(file.type) || videoExtensions.includes(fileExtension);
      setIsVideoFile(isVideo);
      setAudioFile(file);
      setMediaUrl(URL.createObjectURL(file));
      setError("");
      toast.success(`File selected: ${file.name}`);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTranscribe = async (useUrl: boolean) => {
    setError("");
    setTranscriptionResult(null);
    setIsTranscribing(true);

    try {
      let requestBody: { audioUrl?: string; audioData?: string; enableSpeakerLabels: boolean } = {
        enableSpeakerLabels,
      };

      if (useUrl) {
        if (!audioUrl.trim()) {
          throw new Error("Please enter an audio URL");
        }
        requestBody.audioUrl = audioUrl.trim();
        setMediaUrl(audioUrl.trim());
        
        const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];
        const isVideo = videoExtensions.some(ext => audioUrl.toLowerCase().includes(ext));
        setIsVideoFile(isVideo);
      } else {
        if (!audioFile) {
          throw new Error("Please select an audio file");
        }
        const base64Data = await convertFileToBase64(audioFile);
        requestBody.audioData = base64Data;
      }

      let data: any = null;
      let invokeError: any = null;

      if (!isSupabaseConfigured || !supabase) {
        const assemblyKey = (import.meta.env.VITE_ASSEMBLYAI_API_KEY as string | undefined) ||
          (typeof window !== "undefined" ? window.localStorage.getItem("ASSEMBLYAI_KEY") || undefined : undefined);

        if (!assemblyKey) {
          throw new Error("Missing AssemblyAI API key for local run");
        }

        let uploadUrl = requestBody.audioUrl;
        if (requestBody.audioData) {
          const base64 = requestBody.audioData.split(",")[1] || "";
          const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
          const up = await fetch("https://api.assemblyai.com/v2/upload", {
            method: "POST",
            headers: { authorization: assemblyKey, "content-type": "application/octet-stream" },
            body: bytes,
          });
          if (!up.ok) {
            const txt = await up.text();
            throw new Error(txt || "Upload failed");
          }
          const json = await up.json();
          uploadUrl = String(json?.upload_url || "");
        }

        if (!uploadUrl) throw new Error("No audio provided");

        const start = await fetch("https://api.assemblyai.com/v2/transcript", {
          method: "POST",
          headers: { authorization: assemblyKey, "content-type": "application/json" },
          body: JSON.stringify({ audio_url: uploadUrl, speaker_labels: enableSpeakerLabels || false }),
        });
        if (!start.ok) {
          const txt = await start.text();
          throw new Error(txt || "Transcription start failed");
        }
        const started = await start.json();
        const id = String(started?.id || "");
        if (!id) throw new Error("Failed to start transcription");

        let final: any = null;
        for (let attempt = 0; attempt < 120; attempt++) {
          await new Promise((r) => setTimeout(r, 2000));
          const stat = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
            headers: { authorization: assemblyKey },
          });
          if (!stat.ok) continue;
          const payload = await stat.json();
          if (payload?.status === "completed") { final = payload; break; }
          if (payload?.status === "error") { throw new Error(payload?.error || "Transcription failed"); }
        }
        if (!final) throw new Error("Transcription timeout - please try again");
        data = final;
      } else {
        let useDirect = false;
        let id = "";
        try {
          const start = await supabase.functions.invoke("transcribe-start", {
            body: { audioUrl: requestBody.audioUrl, audioData: requestBody.audioData },
          });
          invokeError = start.error;
          id = String(start.data?.id || "");
          if (!id) useDirect = true;
        } catch {
          useDirect = true;
        }

        if (useDirect) {
          const assemblyKey = (import.meta.env.VITE_ASSEMBLYAI_API_KEY as string | undefined) ||
            (typeof window !== "undefined" ? window.localStorage.getItem("ASSEMBLYAI_KEY") || undefined : undefined);
          if (!assemblyKey) throw new Error("Missing AssemblyAI API key for local run");

          let uploadUrl = requestBody.audioUrl;
          if (requestBody.audioData) {
            const base64 = requestBody.audioData.split(",")[1] || "";
            const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
            const up = await fetch("https://api.assemblyai.com/v2/upload", {
              method: "POST",
              headers: { authorization: assemblyKey, "content-type": "application/octet-stream" },
              body: bytes,
            });
            if (!up.ok) {
              const txt = await up.text();
              throw new Error(txt || "Upload failed");
            }
            const json = await up.json();
            uploadUrl = String(json?.upload_url || "");
          }
          if (!uploadUrl) throw new Error("No audio provided");

          const start = await fetch("https://api.assemblyai.com/v2/transcript", {
            method: "POST",
            headers: { authorization: assemblyKey, "content-type": "application/json" },
            body: JSON.stringify({ audio_url: uploadUrl, speaker_labels: enableSpeakerLabels || false }),
          });
          if (!start.ok) {
            const txt = await start.text();
            throw new Error(txt || "Transcription start failed");
          }
          const started = await start.json();
          id = String(started?.id || "");
          if (!id) throw new Error("Failed to start transcription");
        }

        let final: any = null;
        for (let attempt = 0; attempt < 120; attempt++) {
          await new Promise((r) => setTimeout(r, 2000));
          if (!useDirect) {
            const stat = await supabase.functions.invoke("transcribe-status", { body: { id, enableSpeakerLabels } });
            if (stat.error) continue;
            const payload = stat.data;
            if (payload?.status === "completed") { final = payload; break; }
          } else {
            const assemblyKey = (import.meta.env.VITE_ASSEMBLYAI_API_KEY as string | undefined) ||
              (typeof window !== "undefined" ? window.localStorage.getItem("ASSEMBLYAI_KEY") || undefined : undefined);
            const stat = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, { headers: { authorization: assemblyKey || "" } });
            if (!stat.ok) continue;
            const payload = await stat.json();
            if (payload?.status === "completed") { final = payload; break; }
            if (payload?.status === "error") { throw new Error(payload?.error || "Transcription failed"); }
          }
        }
        if (!final) throw new Error("Transcription timeout - please try again");
        data = useDirect ? final : { success: true, text: final.text, utterances: final.utterances, speakerCount: final.speakerCount };
      }

      if (invokeError) {
        console.error("Edge Function invocation error:", invokeError);
        throw new Error(invokeError.message || "Failed to send request to transcription service");
      }

      if (!data) {
        throw new Error("No response received from transcription service");
      }

      if (!data.success) {
        throw new Error(data.error || "Transcription failed");
      }

      if (!data.text) {
        throw new Error("No transcription text received");
      }

      if (data.utterances && data.utterances.length) {
        const originals = Array.from(new Set<string>(data.utterances.map((u: any) => String(u.speaker))));
        const map = new Map<string, string>();
        for (let i = 0; i < originals.length; i++) {
          const letter = String.fromCharCode(65 + (i % 26));
          map.set(originals[i], `Speaker ${letter}`);
        }
        data.utterances = data.utterances.map((u: any) => ({
          ...u,
          speaker: map.get(u.speaker) ?? u.speaker,
        }));
        data.speakerCount = originals.length;
      }
      setTranscriptionResult(data);
      toast.success("Transcription completed successfully!");
    } catch (err) {
      console.error("Transcription error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsTranscribing(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!transcriptionResult?.text) return;
      setEmotionError("");
      setIsDetectingEmotion(true);
      try {
        const items = await detectEmotion(transcriptionResult.text);
        setEmotionItems(items);
      } catch (e) {
        const msg = (e as Error).message || "Emotion detection failed";
        setEmotionError(msg);
        toast.error(msg);
      } finally {
        setIsDetectingEmotion(false);
      }
    };
    run();
  }, [transcriptionResult]);

  const handleCopy = async () => {
    if (!transcriptionResult?.text) return;

    try {
      await navigator.clipboard.writeText(transcriptionResult.text);
      setCopied(true);
      toast.success("Text copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-secondary p-4 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section with Wisperina Branding */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-primary animate-pulse-glow" />
            <h1 className="text-5xl xl:text-6xl font-bold gradient-text text-glow">
              Wisperina
            </h1>
            <Sparkles className="w-10 h-10 text-accent animate-pulse-glow" />
          </div>
          <p className="text-lg text-muted-foreground">
            Transcribe the Future
          </p>
        </div>

        <Card className="glass-card glass-hover shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileAudio className="w-6 h-6 text-primary" />
              Upload Audio or Video
            </CardTitle>
            <CardDescription className="text-base">
              Choose a file from your device or provide a URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 glass-surface rounded-lg mb-6">
              <div className="space-y-0.5">
                <Label htmlFor="speaker-labels" className="text-base font-semibold">
                  Enable Speaker Identification
                </Label>
                <p className="text-sm text-muted-foreground">
                  Identify and label different speakers in the audio
                </p>
              </div>
              <Switch
                id="speaker-labels"
                checked={enableSpeakerLabels}
                onCheckedChange={setEnableSpeakerLabels}
                disabled={isTranscribing}
              />
            </div>

            <Tabs defaultValue="file" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Audio URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audio-file">Select Audio or Video File</Label>
                  <div className="flex flex-col xl:flex-row gap-4">
                    <Input
                      id="audio-file"
                      type="file"
                      accept="audio/*,video/*,.mp3,.wav,.m4a,.flac,.ogg,.aac,.webm,.opus,.wma,.mp4,.mov,.avi,.mkv"
                      onChange={handleFileChange}
                      disabled={isTranscribing}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleTranscribe(false)}
                      disabled={!audioFile || isTranscribing}
                      className="xl:w-auto w-full gradient-primary hover-glow"
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <FileAudio className="w-4 h-4 mr-2" />
                          Transcribe
                        </>
                      )}
                    </Button>
                  </div>
                  {audioFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audio-url">Audio URL</Label>
                  <div className="flex flex-col xl:flex-row gap-4">
                    <Input
                      id="audio-url"
                      type="url"
                      placeholder="https://example.com/audio.mp3"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      disabled={isTranscribing}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleTranscribe(true)}
                      disabled={!audioUrl.trim() || isTranscribing}
                      className="xl:w-auto w-full gradient-primary hover-glow"
                    >
                      {isTranscribing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <FileAudio className="w-4 h-4 mr-2" />
                          Transcribe
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a direct URL to an audio file (must be publicly accessible)
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {isTranscribing && (
          <Card className="glass-card shadow-lg">
            <CardContent className="pt-6">
              <ProcessingAnimation message="Processing your audio..." />
            </CardContent>
          </Card>
        )}

        {transcriptionResult && !isTranscribing && (
          <>
            {transcriptionResult.utterances && transcriptionResult.utterances.length > 0 ? (
              <div className="grid xl:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {mediaUrl && (
                    <VideoPlayer
                      ref={videoPlayerRef}
                      src={mediaUrl}
                      onTimeUpdate={handleTimeUpdate}
                      isVideo={isVideoFile}
                      className="glass-card"
                    />
                  )}

                  <Card className="glass-card shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <CardTitle>Full Transcript</CardTitle>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="gap-2"
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={transcriptionResult.text}
                        readOnly
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <SpeakerTimeline
                    utterances={transcriptionResult.utterances}
                    duration={transcriptionResult.utterances[transcriptionResult.utterances.length - 1]?.end / 1000 || 0}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                  />

                  <TranscriptViewer
                    utterances={transcriptionResult.utterances}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                    speakerCount={transcriptionResult.speakerCount}
                  />

                  <Card className="glass-card shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <CardTitle>Text Emotion</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isDetectingEmotion ? (
                        <div className="text-sm text-muted-foreground">Analyzing emotions...</div>
                      ) : emotionError ? (
                        <div className="text-sm text-destructive">{emotionError}</div>
                      ) : emotionItems.length ? (
                        <div className="space-y-2">
                          {emotionItems
                            .slice()
                            .sort((a, b) => b.score - a.score)
                            .map((i, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="capitalize">{faceForEmotion(i.emotion)} {i.emotion}</span>
                                <span className="text-sm text-muted-foreground">{(i.score * 100).toFixed(1)}%</span>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">No emotion data</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="glass-card shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <CardTitle>Transcription Result</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-2 hover-glow"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <CardDescription>
                    Your audio has been successfully transcribed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={transcriptionResult.text}
                    readOnly
                    className="min-h-[200px] font-mono text-sm glass-surface"
                    placeholder="Transcription will appear here..."
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
