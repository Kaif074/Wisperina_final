export interface TranscriptionUtterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TranscriptionResult {
  success: boolean;
  text: string;
  utterances?: TranscriptionUtterance[];
  speakerCount?: number;
  error?: string;
}

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
  play: () => void;
  pause: () => void;
}
