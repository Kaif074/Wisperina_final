# Audio Player Visual Guide

## Audio Player Interface

When you upload an audio file and transcribe it, you'll see a beautiful audio player interface:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ╭─────────╮                         │
│                    │         │                         │
│                    │   🎵    │  ← Music Icon           │
│                    │         │                         │
│                    ╰─────────╯                         │
│                                                         │
│                  Audio Player                          │
│                  0:45 / 3:24                           │
│                                                         │
│  (Gradient background with primary color theme)        │
│                                                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  0:45  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  3:24    │
│                                                         │
│  ▶️  🔊 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Play  Volume Slider                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Video Player Interface

For comparison, video files show:

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                                                         │
│              [Video Content Display]                    │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  0:45  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  3:24    │
│                                                         │
│  ▶️  🔊 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ⛶ │
│  Play  Volume Slider                          Fullscreen│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Control Elements

### Play/Pause Button
```
▶️  Play    (when paused)
⏸️  Pause   (when playing)
```

### Volume Controls
```
🔊  Volume On   + Slider (0-100%)
🔇  Muted       + Slider (grayed out)
```

### Progress Bar
```
Current Time    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    Total Duration
    0:45        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━         3:24

Click anywhere on the bar to seek to that position
```

### Fullscreen Button (Video Only)
```
⛶  Fullscreen   (only visible for video files)
```

## Color Scheme

### Audio Player
- **Background**: Gradient from `primary/10` to `primary/5`
- **Icon Circle**: `primary/20` background
- **Music Icon**: `primary` color
- **Text**: Default foreground colors
- **Border**: Card border

### Controls
- **Progress Bar**: Primary color for played portion
- **Volume Slider**: Primary color
- **Buttons**: Ghost variant (transparent with hover)
- **Time Display**: Muted foreground color

## Layout Structure

```
┌─ Card Container ──────────────────────────────────────┐
│                                                        │
│  ┌─ Media Display Area ─────────────────────────────┐ │
│  │                                                   │ │
│  │  [Audio Player UI] or [Video Element]            │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
│  ┌─ Controls Area ──────────────────────────────────┐ │
│  │                                                   │ │
│  │  Progress Bar with Time Labels                   │ │
│  │                                                   │ │
│  │  Play/Pause | Volume | [Fullscreen]              │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Desktop (1280px+)
- Full-width player
- All controls visible
- Comfortable spacing

### Tablet (768px - 1279px)
- Slightly narrower
- All controls still visible
- Adjusted spacing

### Mobile (< 768px)
- Full-width on small screens
- Controls stack if needed
- Touch-friendly buttons

## Interactive States

### Hover States
```
Button:
  Default:  Transparent background
  Hover:    Light background (ghost variant)
  Active:   Slightly darker

Slider:
  Default:  Primary color track
  Hover:    Slightly brighter
  Dragging: Full brightness
```

### Playing State
```
▶️ → ⏸️   Button changes
Progress bar animates smoothly
Time updates every 200ms
Transcript auto-scrolls every 500ms
```

### Seeking State
```
Click progress bar → Jump to position
Click transcript → Seek to timestamp
Drag slider → Smooth seeking
```

## Accessibility Features

### Keyboard Support
- Tab: Navigate between controls
- Space/Enter: Activate buttons
- Arrow keys: Adjust sliders

### Screen Reader Support
- Proper ARIA labels
- Semantic HTML elements
- Descriptive button text

### Visual Indicators
- Clear play/pause states
- Volume level visualization
- Time progress display
- Active transcript highlighting

## Integration with Transcript

### Synchronized Features

1. **Auto-Scroll**
   - Transcript scrolls as audio plays
   - Active utterance highlighted
   - Smooth scrolling animation

2. **Click-to-Seek**
   - Click any transcript line
   - Audio jumps to that timestamp
   - Playback continues from there

3. **Speaker Highlighting**
   - Current speaker color-coded
   - Matches timeline visualization
   - Updates in real-time

## Example Usage Flow

```
1. Upload Audio File
   ↓
2. Enable Speaker Identification (optional)
   ↓
3. Click "Transcribe Audio"
   ↓
4. Wait for Processing
   ↓
5. Audio Player Appears
   ↓
6. Click Play ▶️
   ↓
7. Listen + Read Transcript
   ↓
8. Click Transcript to Jump
   ↓
9. Adjust Volume as Needed
   ↓
10. Copy Transcript When Done
```

## Tips for Best Experience

### Audio Quality
- Use high-quality audio files
- Clear speech improves accuracy
- Minimize background noise

### Speaker Identification
- Enable for multi-speaker content
- Works best with distinct voices
- Requires clear audio separation

### Playback
- Use volume slider for fine control
- Click transcript for quick navigation
- Let auto-scroll guide you

### Performance
- Works smoothly with files up to 100MB
- Optimized for long recordings
- No lag or stuttering

## Troubleshooting

### Audio Not Playing
- Check file format is supported
- Verify file uploaded successfully
- Try refreshing the page

### Controls Not Responding
- Ensure JavaScript is enabled
- Check browser compatibility
- Clear browser cache

### Sync Issues
- Refresh the page
- Re-upload the file
- Check internet connection

## Browser Compatibility

### Fully Supported
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Audio Format Support
Varies by browser, but all major formats work:
- MP3: Universal support
- WAV: Universal support
- M4A: Most browsers
- OGG: Most browsers
- FLAC: Modern browsers

---

**Enjoy your audio transcription experience!** 🎵
