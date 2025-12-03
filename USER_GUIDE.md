# Audio Transcriber - User Guide

## Welcome! 🎵

Audio Transcriber is a powerful tool that converts speech in audio and video files into written text using advanced AI technology with speaker identification capabilities.

## Quick Start

### Basic Transcription

1. **Click on the "Upload File" tab** (default view)
2. **Choose whether to enable Speaker Identification** (toggle on/off)
3. **Click "Choose File"** or drag and drop your file
4. **Wait for file validation** - you'll see a success message if the file is valid
5. **Click "Transcribe"** button
6. **Wait for processing** - this typically takes 30 seconds to 2 minutes depending on file length
7. **View your transcription** - the text will appear below once complete
8. **Copy the text** - click the "Copy" button to copy the transcription to your clipboard

### Advanced Features (Speaker Identification)

When you enable **Speaker Identification**, you get:
- 🎭 **Automatic speaker detection** - identifies different speakers
- 🎨 **Color-coded transcript** - each speaker gets a unique color
- 📹 **Video player** (for video files) - watch while reading transcript
- ⏱️ **Interactive timeline** - visual representation of who spoke when
- 🔍 **Clickable transcript** - click any line to jump to that moment in the video
- 📊 **Speaker summary** - see how many speakers were detected

## How to Use

### Method 1: Upload a File

1. **Click on the "Upload File" tab** (default view)
2. **Toggle "Enable Speaker Identification"** if you want to identify different speakers
3. **Click "Choose File"** or drag and drop your file
4. **Wait for file validation** - you'll see a success message if the file is valid
5. **Click "Transcribe"** button
6. **Wait for processing** - this typically takes 30 seconds to 2 minutes depending on file length
7. **View your results**:
   - **With Speaker ID**: See video player, timeline, and interactive transcript
   - **Without Speaker ID**: See simple text transcription
8. **Interact with results**:
   - Click transcript lines to jump to that timestamp
   - Click timeline segments to navigate
   - Copy full transcript with the "Copy" button

### Method 2: Use a URL

1. **Click on the "Audio URL" tab**
2. **Toggle "Enable Speaker Identification"** if desired
3. **Paste the direct URL** to your audio or video file
   - Example: `https://example.com/audio.mp3`
   - The file must be publicly accessible (no login required)
4. **Click "Transcribe"** button
5. **Wait for processing** and view your results

## Understanding Speaker Identification

### What is Speaker Diarization?
Speaker diarization is the process of identifying "who spoke when" in an audio or video file. The AI analyzes voice patterns to distinguish between different speakers.

### How to Read the Results

**Speaker Labels:**
- Speakers are labeled as "Speaker A", "Speaker B", etc.
- Each speaker gets a consistent color throughout the transcript
- The system shows the total number of unique speakers detected

**Interactive Transcript:**
- Each utterance shows the speaker label and timestamp
- Click any utterance to jump the video to that moment
- The current utterance is highlighted with a ring effect
- Transcript auto-scrolls to follow video playback

**Speaker Timeline:**
- Visual bar showing the entire audio/video duration
- Color-coded segments show when each speaker talked
- Click any segment to jump to that point
- Current playback position shown with a marker

### When to Use Speaker Identification

**Best for:**
- ✅ Interviews with 2-4 people
- ✅ Podcast episodes with multiple hosts
- ✅ Meeting recordings
- ✅ Panel discussions
- ✅ Video content with dialogue

**Not recommended for:**
- ❌ Single speaker presentations (unnecessary overhead)
- ❌ Audio with heavy background noise
- ❌ Very large groups (10+ speakers)
- ❌ Overlapping speech or crosstalk

## Supported File Formats

### Audio Formats ✅
- **MP3** - Most common audio format
- **WAV** - Uncompressed audio, high quality
- **M4A** - Apple audio format
- **FLAC** - Lossless audio compression
- **OGG** - Open-source audio format
- **AAC** - Advanced Audio Coding
- **WebM** - Web-optimized audio
- **Opus** - Low-latency audio codec
- **WMA** - Windows Media Audio

### Video Formats ✅
- **MP4** - Most common video format
- **MOV** - Apple QuickTime format
- **AVI** - Audio Video Interleave
- **MKV** - Matroska video format

> **Note**: For video files, only the audio track is transcribed. The video itself is not processed.

## File Requirements

### Size Limit
- **Maximum file size**: 100MB
- For larger files, consider:
  - Compressing the audio
  - Splitting into smaller segments
  - Using a lower bitrate

### Quality Tips
For the best transcription accuracy:

1. **Clear Audio** 🎤
   - Use a good quality microphone
   - Record in a quiet environment
   - Minimize background noise

2. **Speech Clarity** 🗣️
   - Speak clearly and at a moderate pace
   - Avoid mumbling or speaking too fast
   - Ensure speakers are close to the microphone

3. **Audio Quality** 🔊
   - Use a reasonable bitrate (128kbps or higher)
   - Avoid heavily compressed audio
   - Check that audio levels are not too low or distorted

## Common Issues & Solutions

### "Invalid file format" Error
**Problem**: The file type is not recognized

**Solutions**:
- Check that your file has the correct extension (.mp3, .wav, etc.)
- Try converting your file to MP3 or WAV format
- Ensure the file is not corrupted

### "File size must be less than 100MB" Error
**Problem**: Your file is too large

**Solutions**:
- Compress the audio using a tool like Audacity
- Convert to a more efficient format (MP3 with 128kbps)
- Split the file into smaller segments

### "No transcription text received" Error
**Problem**: The transcription completed but no text was generated

**Possible Causes**:
- The audio file is silent or contains no speech
- The audio quality is too poor to transcribe
- The speech is in a language not well-supported

**Solutions**:
- Verify the audio file plays correctly and contains speech
- Try a different audio file to test
- Ensure the audio is clear and audible

### "Transcription timeout" Error
**Problem**: The transcription is taking too long

**Solutions**:
- Try a shorter audio file
- Check your internet connection
- Try again later (the service might be busy)

### "Failed to send request" Error
**Problem**: Cannot connect to the transcription service

**Solutions**:
- Check your internet connection
- Refresh the page and try again
- Clear your browser cache

## Tips for Best Results

### 1. Prepare Your Audio
- Listen to your audio before transcribing
- Trim silence from the beginning and end
- Normalize audio levels if too quiet

### 2. Choose the Right Format
- **For speech**: MP3 or M4A work great
- **For music with lyrics**: Use higher quality formats like FLAC or WAV
- **For podcasts**: MP3 at 128kbps is sufficient

### 3. Test with Short Clips First
- If you're unsure about quality, test with a 30-second clip first
- This helps you verify the transcription accuracy before processing longer files

### 4. Use URL Method for Large Files
- If you have files hosted online, use the URL method
- This is faster than uploading large files

## Privacy & Security

- **Your files are processed securely** through encrypted connections
- **Files are not permanently stored** - they're only used for transcription
- **Transcriptions are not saved** - copy your text before leaving the page

## Technical Specifications

- **Maximum processing time**: 2 minutes (120 seconds)
- **Supported languages**: English (primary), with support for many other languages
- **Transcription model**: AssemblyAI Universal Speech Model
- **Accuracy**: Typically 85-95% depending on audio quality

## Need Help?

If you encounter issues not covered in this guide:

1. **Check the error message** - it usually provides specific guidance
2. **Try a different file** - to determine if the issue is file-specific
3. **Refresh the page** - sometimes a simple refresh resolves connection issues
4. **Check browser console** - for technical users, the browser console may show additional error details

## Browser Compatibility

Audio Transcriber works best on:
- ✅ Google Chrome (recommended)
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Safari (macOS/iOS)

---

**Enjoy transcribing!** 🎉

If you find this tool helpful, consider sharing it with others who might benefit from automatic transcription services.
