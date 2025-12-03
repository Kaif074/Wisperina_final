import { useMemo } from "react";
import { TranscriptionUtterance } from "@/types/transcription";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface SpeakerTimelineProps {
  utterances: TranscriptionUtterance[];
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

const SPEAKER_COLORS_BG = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-2",
];

const SPEAKER_COLORS_GLOW = [
  "glow-primary",
  "glow-secondary",
  "glow-accent",
  "",
  "",
  "",
];

export function SpeakerTimeline({
  utterances,
  duration,
  currentTime,
  onSeek,
}: SpeakerTimelineProps) {
  const uniqueSpeakers = useMemo(() => {
    return Array.from(new Set(utterances.map((u) => u.speaker)));
  }, [utterances]);

  const getSpeakerIndex = (speaker: string) => {
    const idx = uniqueSpeakers.indexOf(speaker);
    return idx >= 0 ? idx : 0;
  };

  const getSpeakerColor = (speaker: string) => {
    const i = getSpeakerIndex(speaker);
    return SPEAKER_COLORS_BG[i % SPEAKER_COLORS_BG.length];
  };

  const getSpeakerGlow = (speaker: string) => {
    const i = getSpeakerIndex(speaker);
    return SPEAKER_COLORS_GLOW[i % SPEAKER_COLORS_GLOW.length];
  };

  const getPosition = (time: number) => {
    return (time / 1000 / duration) * 100;
  };

  const getWidth = (start: number, end: number) => {
    return ((end - start) / 1000 / duration) * 100;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds);
    const secs = Math.floor((seconds % 1) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Memoize unique speakers to prevent recalculation on every render
  const legendSpeakers = useMemo(() => {
    return Array.from(new Set(utterances.map((u) => u.speaker)));
  }, [utterances]);

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Speaker Timeline</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {legendSpeakers.map((speaker) => (
            <div key={speaker} className="flex items-center gap-2 glass-surface px-3 py-1 rounded-full">
              <div
                className={`w-3 h-3 rounded-full ${getSpeakerColor(speaker)} ${getSpeakerGlow(speaker)}`}
              />
              <span className="text-sm font-medium">{speaker}</span>
            </div>
          ))}
        </div>

        <div className="relative h-16 glass-surface rounded-lg overflow-hidden">
          {utterances.map((utterance, index) => (
            <div
              key={index}
              onClick={() => onSeek(utterance.start / 1000)}
              className={`absolute h-full ${getSpeakerColor(
                utterance.speaker
              )} opacity-70 hover:opacity-100 cursor-pointer transition-all hover:scale-105 border-r border-background`}
              style={{
                left: `${getPosition(utterance.start)}%`,
                width: `${getWidth(utterance.start, utterance.end)}%`,
              }}
              title={`${utterance.speaker}: ${utterance.text.substring(0, 50)}...`}
            />
          ))}

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary glow-primary z-10 transition-all"
            style={{
              left: `${(currentTime / duration) * 100}%`,
            }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-primary rounded-full glow-primary animate-pulse-glow" />
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </Card>
  );
}
