# Wisperina Setup Guide

## Overview

Wisperina is a React + Vite application that transcribes audio/video and optionally performs speaker identification and text‑emotion analysis using Supabase Edge Functions and external APIs.

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- AssemblyAI account (for transcription)
- Optional: Apilayer key (for direct text‑emotion API)

## Install & Run

1. Install dependencies:
   
   ```bash
   npm install
   ```

2. Create `.env` in the project root with:
   
   ```env
   VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   # Optional: use direct Apilayer without Edge Function
   VITE_APILAYER_KEY=<your-apilayer-key>
   ```

3. Start the dev server:
   
   ```bash
   npm run dev
   ```
   
   Dev opens at `http://127.0.0.1:5173/`.

4. Build for production:
   
   ```bash
   npm run build
   ```

5. Quality checks:
   
   ```bash
   npm run lint
   npm run test
   npm run test:e2e
   ```

## Supabase Configuration

1. In your Supabase project, add Edge Function secrets:
   
   - `ASSEMBLYAI_API_KEY` for `transcribe-audio`
   - `APILAYER_KEY` for `text-emotion`
   - Optional: `EDENAI_API_KEY` for `emotion-detection`

   Use the Supabase Dashboard (Project Settings → Secrets) or CLI.

2. Deploy Edge Functions (if not already):
   
   - `transcribe-audio` at `supabase/functions/transcribe-audio/index.ts`
   - `text-emotion` at `supabase/functions/text-emotion/index.ts`
   - Optional `emotion-detection` at `supabase/functions/emotion-detection/index.ts`

3. The frontend uses the Supabase client configured with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to invoke functions.

## How It Works (Graph)

```text
User (Browser)
  │
  │ 1. Select file / paste URL
  ▼
React UI: TranscriptionPage
  (src/pages/TranscriptionPage.tsx)
  │   ├─ Validates media and size
  │   ├─ Toggles speaker labels
  │   └─ Invokes Supabase Edge Function
  │        supabase.functions.invoke("transcribe-audio")
  │        (src/db/supabase.ts)
  ▼
Supabase Edge Function: transcribe-audio
  (supabase/functions/transcribe-audio/index.ts)
  │   ├─ Gets `ASSEMBLYAI_API_KEY` secret
  │   ├─ Uploads audio (if file)
  │   ├─ Requests transcript (speaker_labels on/off)
  │   └─ Polls status → returns:
  │        { success, text, utterances?, speakerCount? }
  ▼
React UI renders results
  │   ├─ VideoPlayer (src/components/transcription/VideoPlayer.tsx)
  │   ├─ SpeakerTimeline (src/components/transcription/SpeakerTimeline.tsx)
  │   └─ TranscriptViewer (src/components/transcription/TranscriptViewer.tsx)
  │        • Click transcript/timeline → seek video
  │        • Auto‑highlight active utterance
  ▼
Text Emotion Analysis (optional)
  │   ├─ detectEmotion(text)
  │   │   (src/services/emotion.ts)
  │   ├─ If `VITE_APILAYER_KEY` present → calls Apilayer directly
  │   └─ Else → invokes Supabase `text-emotion` Edge Function
  ▼
UI displays emotion items
```

## Key Files

- Supabase client: `src/db/supabase.ts:4`
- Transcription page: `src/pages/TranscriptionPage.tsx:159`
- Edge function (transcribe): `supabase/functions/transcribe-audio/index.ts:82`
- Components:
  - `src/components/transcription/VideoPlayer.tsx:1`
  - `src/components/transcription/SpeakerTimeline.tsx:1`
  - `src/components/transcription/TranscriptViewer.tsx:32`
- Emotion service: `src/services/emotion.ts:8`

## Tips

- Keep uploads ≤100MB; for larger content use URL input.
- Enable speaker identification for interviews/podcasts; disable for single‑speaker.
- Do not commit secrets; set them via environment and Supabase secrets.

```text
Troubleshooting
- Edge Function error → check secrets and CORS
- No text returned → audio likely empty/unclear
- Emotion API error → verify Apilayer key or use Edge Function
```