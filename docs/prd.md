# Wisperina - Video Transcription and Analysis System Requirements Document (Enhanced Version)

## 1. Website Overview
\n### 1.1 Website Name
Wisperina\n
### 1.2 Website Description
An advanced multilingual web application that transcribes video and audio content into text with speaker identification, synchronized playback, interactive transcript navigation, and futuristic UI design powered by AI speech recognition technology.

## 2. Core Features
\n### 2.1 Media Upload
- Users can upload video files from local device
- Support for common video formats (MP4, AVI, MOV, WebM, etc.)
- Option to provide video file URL for remote files\n- Support for audio-only files (MP3, WAV, M4A, etc.)
- Custom branded upload animation with progress indicator featuring Wisperina branding
\n### 2.2 Video Transcription
- Integrate AssemblyAI API for speech-to-text conversion
- Use universal speech model for accurate transcription
- Process video audio track for transcription
- Handle transcription errors with appropriate error messages
- Display custom processing animation during transcription with futuristic holographic loading effects

### 2.3 Audio Transcription Service (Whisperina Integration)
- Integrate Whisperina audio transcription API
- Secure API key management system
- Support multiple audio input formats (MP3, WAV, M4A)
- Provide interface for audio file upload or recording
- Display transcription results in editable text area
- Include language selection options for transcription\n- Support task types: transcribe and translate
- Real-time processing feedback with animated indicators featuring pulsating orbital visualization synchronized with audio analysis

### 2.4 Speaker Identification and Analysis
- Automatically detect and distinguish different speakers
- Assign consistent labels to each speaker (e.g., 'Speaker 1', 'Speaker 2')\n- Display total number of unique speakers detected
- Visually indicate active speaker through color coding
- Generate speaker activity timeline with animated transitions\n- Handle overlapping speech with clear notations

### 2.5 Synchronized Display\n- Display video player and interactive transcript on same screen
- Synchronize transcript text with video playback in real-time
- Present transcript in scrollable sidebar or customizable subtitles
- Highlight current speaking segment with smooth animations
- Use speaker-specific visual indicators with color codes

### 2.6 Interactive Transcript
- Make transcript text clickable for navigation
- Allow users to jump to specific video timestamps by clicking transcript lines\n- Enable text selection and copying from transcript
- Provide search functionality within transcript with animated results highlighting
- Smooth scroll animations when navigating transcript

### 2.7 Results Export
- Download transcript in multiple formats (TXT, SRT, VTT)\n- Export speaker-labeled transcript with timestamps
- Save speaker analysis summary
- Animated export process with progress feedback featuring particle effects

### 2.8 Multilingual & Internationalization (i18n) Support
- Framework-agnostic i18n structure using JSON resource files
- Dynamic language switching without page reload
- Support for Right-to-Left (RTL) layouts for Arabic and Hebrew
- Localizable static text, labels, dates, currencies, and numbers
- Language selector with smooth transition animations

### 2.9 Enhanced User Experience
- Custom Wisperina branded animations for all background processes
- Pulsating orbital visualization during audio processing synchronized with analysis progress
- Holographic loading bars with particle effects for transcription progress
- Non-blocking animations with clear progress indicators\n- Micro-interactions for button hovers and focus states with neon glow effects
- Smooth page transitions and animated loading sequences\n- Clean, data-focused dashboard without inline tips or tutorial hints
- Dedicated 'Help' or 'Tutorials' section accessible via menu
- Uncluttered interface focused on core functionality: file upload area, recent transcriptions list, and settings access

## 3. API Integration

### 3.1 AssemblyAI Integration
```python
import assemblyai as aai

aai.settings.api_key = 'cd2a14e61a0f4983898354f7e97066e2'

config = aai.TranscriptionConfig(speech_models=['universal'])\n
transcript = aai.Transcriber(config=config).transcribe(audio_file)

if transcript.status == 'error':
    raise RuntimeError(f'Transcription failed: {transcript.error}')

print(transcript.text)
```

### 3.2 Whisperina API Integration
- Secure API key storage and management
- RESTful API calls for audio transcription
- Error handling and retry mechanisms
- Support for multiple audio formats and languages

## 4. Design Style

### 4.1 Visual Aesthetic
- **Color Scheme**: Futuristic dark theme dominated by deep blues (#0A1929, #1E3A8A), rich purples (#5B21B6, #7C3AED), and cyan (#06B6D4) as primary colors, with neon accents in electric cyan (#22D3EE), vibrant magenta (#EC4899), and metallic silver (#94A3B8) for highlights and interactive elements
- **Typography**: Modern geometric sans-serif fonts (Inter, Poppins, or Orbitron for headings) ensuring clean readability and futuristic feel
- **UI Elements**: Glassmorphism effects with frosted glass appearance, subtle gradients blending blues and purples, clean lines, 12px rounded corners, and minimalist design principles
- **Branding**: Wisperina logo and name prominently displayed on splash screen, window titles, and navigation header

### 4.2 Interactive Animations
- **Processing Animation**: Pulsating orbital visualization with concentric rings that pulse and rotate in sync with audio analysis progress, featuring particle effects and holographic glow
- **Progress Indicators**: Holographic loading bars with animated particle trails and neon glow effects\n- Micro-interactions on button hovers with scale transforms and neon cyan/magenta glow effects
- Smooth focus state transitions with animated neon borders\n- Purposeful animations guiding user flow (e.g., transcript auto-scroll, speaker highlight transitions)
- Custom loading sequences with Wisperina branded motion graphics
- Animated progress bars for transcription and upload processes with futuristic styling

### 4.3 Layout Design
- Responsive split-screen layout: video player on left, transcript panel on right\n- Adaptive design for desktop, tablet, and mobile devices
- Glassmorphism card containers with subtle shadows, backdrop blur, and gradient borders
- Floating action buttons with animated tooltips featuring neon accents
- Streamlined dashboard with minimal visual clutter, focused on file upload area, recent transcriptions list, and settings access
- No inline tips or tutorial hints on main dashboard

### 4.4 Speaker Visual Indicators
- Color-coded speaker labels: Speaker 1 (#10B981), Speaker 2 (#F59E0B), Speaker 3 (#EF4444), Speaker 4 (#8B5CF6)
- Animated speaker activity timeline with smooth transitions and neon glow effects
- Pulsing indicators for active speakers during playback with holographic styling
\n## 5. Technical & Architectural Considerations

### 5.1 Technology Stack\n- Front-end framework with component-based architecture
- CSS libraries for animations (Animate.css or GSAP for advanced animations)
- i18n library for multilingual support (e.g., i18next)
- Responsive design framework for cross-device compatibility
- Secure API integration layer for AssemblyAI and Whisperina

### 5.2 Code Modularity
- Modular component structure for easy maintenance
- Separation of concerns: UI components, API services, state management
- Reusable animation components and utilities
- Centralized i18n resource management\n
### 5.3 Performance Optimization
- Lazy loading for media files and transcript data
- Optimized animation performance with GPU acceleration
- Efficient state management for real-time synchronization
- Caching strategies for transcription results

### 5.4 Accessibility\n- Keyboard navigation support for all interactive elements
- Screen reader compatibility for transcript content
- High contrast mode option for visual accessibility
- Reduced motion option for users sensitive to animations