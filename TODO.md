# Task: Enhanced Video Transcription with Speaker Identification

## Plan
- [x] 1. Update Edge Function to enable speaker diarization
  - [x] 1.1 Add speaker_labels parameter to AssemblyAI request
  - [x] 1.2 Return utterances data with speaker info and timestamps
  - [x] 1.3 Test Edge Function deployment

- [x] 2. Update TypeScript types for new data structure
  - [x] 2.1 Add TranscriptionUtterance interface
  - [x] 2.2 Add TranscriptionResult interface with utterances

- [x] 3. Create Video Player Component
  - [x] 3.1 Build VideoPlayer component with controls
  - [x] 3.2 Add support for file and URL sources
  - [x] 3.3 Add timestamp jump functionality
  - [x] 3.4 Add current time tracking

- [x] 4. Create Interactive Transcript Component
  - [x] 4.1 Build TranscriptViewer component
  - [x] 4.2 Display utterances with speaker labels
  - [x] 4.3 Add click handlers for timestamp navigation
  - [x] 4.4 Highlight active utterance based on video time
  - [x] 4.5 Add speaker-specific color coding

- [x] 5. Create Speaker Timeline Visualization
  - [x] 5.1 Build SpeakerTimeline component
  - [x] 5.2 Show visual segments for each speaker
  - [x] 5.3 Make timeline interactive (click to jump)

- [x] 6. Update Main TranscriptionPage
  - [x] 6.1 Add video/audio detection logic
  - [x] 6.2 Conditionally show video player for video files
  - [x] 6.3 Update layout to show video + transcript side by side
  - [x] 6.4 Add speaker summary section
  - [x] 6.5 Handle both simple text and utterances display

- [x] 7. Update UI/UX
  - [x] 7.1 Add toggle for speaker diarization feature
  - [x] 7.2 Update tips section with speaker identification info
  - [x] 7.3 Add loading states for video processing
  - [x] 7.4 Improve responsive layout for video + transcript

- [x] 8. Testing & Validation
  - [x] 8.1 Run lint checks
  - [ ] 8.2 Test with video files
  - [ ] 8.3 Test speaker identification accuracy
  - [ ] 8.4 Test timestamp navigation

## Notes
- AssemblyAI supports speaker diarization with `speaker_labels: true`
- Utterances include: speaker, text, start, end, confidence
- Need to handle both video and audio-only files
- Video player should support common formats: MP4, WebM, etc.
- Transcript should auto-scroll to follow video playback

## Implementation Complete
All core features have been implemented:
- ✅ Edge Function updated with speaker diarization support
- ✅ TypeScript types created for transcription data
- ✅ Video Player component with full controls
- ✅ Interactive Transcript Viewer with speaker labels
- ✅ Speaker Timeline visualization
- ✅ Main page updated with two-column layout
- ✅ Speaker identification toggle added
- ✅ All lint checks passing
