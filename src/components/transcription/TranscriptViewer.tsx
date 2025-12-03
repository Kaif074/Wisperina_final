import { useEffect, useRef, useMemo } from "react";
import { TranscriptionUtterance } from "@/types/transcription";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

interface TranscriptViewerProps {
  utterances: TranscriptionUtterance[];
  currentTime: number;
  onSeek: (time: number) => void;
  speakerCount?: number;
}

const SPEAKER_COLORS = [
  "glass-surface border-primary/40 text-primary",
  "glass-surface border-secondary/40 text-secondary",
  "glass-surface border-accent/40 text-accent",
  "glass-surface border-chart-4/40 text-chart-4",
  "glass-surface border-chart-5/40 text-chart-5",
  "glass-surface border-chart-2/40 text-chart-2",
];

const SPEAKER_GLOW = [
  "glow-primary",
  "glow-secondary",
  "glow-accent",
  "",
  "",
  "",
];

export function TranscriptViewer({
  utterances,
  currentTime,
  onSeek,
  speakerCount,
}: TranscriptViewerProps) {
  const activeRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);

  const uniqueSpeakers = useMemo(() => {
    return Array.from(new Set(utterances.map((u) => u.speaker)));
  }, [utterances]);

  const getSpeakerIndex = (speaker: string) => {
    const idx = uniqueSpeakers.indexOf(speaker);
    return idx >= 0 ? idx : 0;
  };

  const getSpeakerColor = (speaker: string) => {
    const i = getSpeakerIndex(speaker);
    return SPEAKER_COLORS[i % SPEAKER_COLORS.length];
  };

  const getSpeakerGlow = (speaker: string) => {
    const i = getSpeakerIndex(speaker);
    return SPEAKER_GLOW[i % SPEAKER_GLOW.length];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 1000 / 60);
    const secs = Math.floor((seconds / 1000) % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isActive = (utterance: TranscriptionUtterance) => {
    const currentMs = currentTime * 1000;
    return currentMs >= utterance.start && currentMs <= utterance.end;
  };

  // Memoize active index to prevent unnecessary recalculations
  const activeIndex = useMemo(() => {
    const currentMs = currentTime * 1000;
    return utterances.findIndex(
      (u) => currentMs >= u.start && currentMs <= u.end
    );
  }, [utterances, currentTime]);

  useEffect(() => {
    if (activeRef.current) {
      const now = Date.now();
      // Throttle scroll updates to every 500ms
      if (now - lastScrollTime.current >= 500) {
        activeRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        lastScrollTime.current = now;
      }
    }
  }, [activeIndex]);

  return (
    <Card className="h-full flex flex-col glass-card">
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Transcript
          </h3>
          {speakerCount && (
            <span className="text-sm glass-surface px-3 py-1 rounded-full font-medium">
              {speakerCount} {speakerCount === 1 ? "speaker" : "speakers"} detected
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {utterances.map((utterance, index) => {
            const active = isActive(utterance);
            return (
              <div
                key={index}
                ref={active ? activeRef : null}
                onClick={() => onSeek(utterance.start / 1000)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  getSpeakerColor(utterance.speaker)
                } ${
                  active
                    ? `ring-2 ring-primary scale-[1.02] shadow-md ${getSpeakerGlow(utterance.speaker)}`
                    : "hover:scale-[1.01] hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm">
                    {utterance.speaker}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(utterance.start)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{utterance.text}</p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
