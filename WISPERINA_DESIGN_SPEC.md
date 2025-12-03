# Wisperina - Design Specification

## Brand Identity

### Name
**Wisperina** - A fusion of "Whisper" (soft speech) and "Erina" (giving it a modern, AI-assistant feel)

### Tagline
"Transcribe the Future"

### Brand Personality
- Futuristic
- Intelligent
- Precise
- Modern
- Sophisticated

## Color System

### Primary Palette
```css
--primary: 258 90% 66%        /* Vibrant Purple #8B5CF6 */
--primary-glow: 258 90% 76%   /* Lighter Purple #A78BFA */
--primary-dark: 258 90% 56%   /* Darker Purple #7C3AED */

--secondary: 200 98% 39%      /* Deep Cyan #06B6D4 */
--secondary-glow: 200 98% 49% /* Bright Cyan #22D3EE */

--accent: 280 100% 70%        /* Neon Pink #E879F9 */
--accent-glow: 280 100% 80%   /* Light Pink #F0ABFC */
```

### Background Palette
```css
--background: 240 10% 3.9%    /* Deep Dark Blue #0A0A0F */
--surface: 240 10% 8%         /* Dark Surface #14141F */
--surface-glass: 240 10% 12%  /* Glass Surface #1F1F2E */

--foreground: 0 0% 98%        /* Almost White #FAFAFA */
--muted-foreground: 240 5% 64.9% /* Muted Gray #9CA3AF */
```

### Accent Colors
```css
--neon-blue: 210 100% 60%     /* Electric Blue #3B82F6 */
--neon-green: 142 76% 36%     /* Neon Green #10B981 */
--metallic-gold: 45 93% 58%   /* Gold Accent #F59E0B */
```

## Typography

### Font Family
**Primary**: "Space Grotesk", "Inter", system-ui, sans-serif
- Geometric sans-serif
- Modern and clean
- Excellent readability

### Font Sizes
```css
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem       /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */
--text-5xl: 3rem        /* 48px */
```

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Visual Effects

### Glassmorphism
```css
.glass-card {
  background: rgba(31, 31, 46, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.15);
}

.glass-surface {
  background: rgba(20, 20, 31, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(6, 182, 212, 0.15);
}
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, 
  hsl(258, 90%, 66%) 0%, 
  hsl(280, 100%, 70%) 100%);

--gradient-secondary: linear-gradient(135deg, 
  hsl(200, 98%, 39%) 0%, 
  hsl(210, 100%, 60%) 100%);

--gradient-accent: linear-gradient(135deg, 
  hsl(258, 90%, 66%) 0%, 
  hsl(200, 98%, 49%) 50%,
  hsl(280, 100%, 70%) 100%);

--gradient-surface: linear-gradient(180deg,
  rgba(31, 31, 46, 0.8) 0%,
  rgba(20, 20, 31, 0.9) 100%);
```

### Shadows
```css
--shadow-glow: 0 0 40px rgba(139, 92, 246, 0.4);
--shadow-glow-cyan: 0 0 40px rgba(6, 182, 212, 0.4);
--shadow-glow-pink: 0 0 40px rgba(232, 121, 249, 0.4);

--shadow-elevated: 0 20px 60px -10px rgba(139, 92, 246, 0.3);
--shadow-card: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
```

### Borders
```css
--border-glass: 1px solid rgba(139, 92, 246, 0.2);
--border-glow: 1px solid rgba(139, 92, 246, 0.4);
--border-neon: 1px solid rgba(6, 182, 212, 0.6);
```

## Animation System

### Processing Animation
**Name**: "Quantum Pulse"

**Description**: A sophisticated animation featuring:
1. **Central Orb**: Pulsating sphere with gradient fill
2. **Orbital Rings**: 3 rotating rings at different speeds
3. **Particle Field**: Floating particles with glow effects
4. **Progress Wave**: Animated wave pattern showing progress

**Keyframes**:
```css
@keyframes pulse-glow {
  0%, 100% { 
    transform: scale(1);
    opacity: 1;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes orbit-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes orbit-fast {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes particle-float {
  0%, 100% { 
    transform: translateY(0) translateX(0);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-20px) translateX(10px);
    opacity: 1;
  }
}

@keyframes wave-progress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

### Interaction Animations
```css
/* Hover Effects */
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  transform: translateY(-2px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button Press */
.button-press:active {
  transform: scale(0.95);
  transition: transform 0.1s;
}

/* Fade In */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Slide In */
@keyframes slide-in {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

## Component Designs

### 1. Hero Section
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ✨ WISPERINA                        │
│                 Transcribe the Future                   │
│                                                         │
│         [Gradient text with glow effect]                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Styling**:
- Large gradient text (text-5xl)
- Glow effect on title
- Subtle animation on load
- Centered layout

### 2. Upload Area (Glass Card)
```
┌─────────────────────────────────────────────────────────┐
│  [Glassmorphism Card with border glow]                  │
│                                                         │
│              🎵 Drop your file here                     │
│                                                         │
│         or click to browse                              │
│                                                         │
│  Supports: MP3, WAV, MP4, and more                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Styling**:
- Glassmorphism background
- Glowing border on hover
- Smooth transitions
- Icon with gradient

### 3. Processing Animation
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    ╭─────────╮                         │
│                 ╱  │    ●    │  ╲                      │
│               ╱    │  Pulse  │    ╲                    │
│              │     ╰─────────╯     │                   │
│               ╲    [Particles]    ╱                    │
│                 ╲               ╱                       │
│                                                         │
│              Processing your audio...                   │
│                                                         │
│         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━         │
│              [Animated progress wave]                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements**:
- Central pulsating orb with gradient
- 3 orbital rings rotating at different speeds
- Floating particles with glow
- Animated progress bar with wave effect
- Status text with shimmer

### 4. Results Display (Glass Cards)
```
┌─────────────────────────────────────────────────────────┐
│  [Media Player - Glass Card]                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🎵 Audio Player                                │   │
│  │  [Gradient background with glow]                │   │
│  └─────────────────────────────────────────────────┘   │
│  ▶️ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│     [Neon progress bar]                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [Transcript - Glass Card]                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Speaker A  [Neon badge]                        │   │
│  │  0:00 - 0:15                                    │   │
│  │  Hello there...                                 │   │
│  │                                                 │   │
│  │  Speaker B  [Neon badge]                        │   │
│  │  0:15 - 0:30                                    │   │
│  │  Hi, how are you...                             │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Styling**:
- Glassmorphism cards
- Neon accents for speakers
- Smooth hover effects
- Glowing borders

### 5. Speaker Timeline
```
┌─────────────────────────────────────────────────────────┐
│  Speaker Timeline  [Glass Card]                         │
│                                                         │
│  [A] [B] [C]  [Speaker legend with neon colors]        │
│                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  [Neon-colored segments for each speaker]               │
│  ▲ [Current position indicator with glow]               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Styling**:
- Glassmorphism background
- Neon-colored speaker segments
- Glowing position indicator
- Smooth animations

## Layout Structure

### Main Page Layout
```
┌─────────────────────────────────────────────────────────┐
│  [Dark gradient background with subtle pattern]         │
│                                                         │
│                    ✨ WISPERINA                        │
│                 Transcribe the Future                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [Upload Area - Glass Card]                     │   │
│  │  [File Upload / URL Input Tabs]                 │   │
│  │  [Speaker ID Toggle]                            │   │
│  │  [Transcribe Button - Gradient with glow]       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Results appear below in glass cards]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Two-Column Results Layout
```
┌─────────────────────────────────────────────────────────┐
│  Left Column              │  Right Column               │
│  ┌─────────────────────┐  │  ┌─────────────────────┐   │
│  │  Media Player       │  │  │  Speaker Timeline   │   │
│  │  [Glass Card]       │  │  │  [Glass Card]       │   │
│  └─────────────────────┘  │  └─────────────────────┘   │
│                           │                             │
│  ┌─────────────────────┐  │  ┌─────────────────────┐   │
│  │  Full Transcript    │  │  │  Interactive        │   │
│  │  [Glass Card]       │  │  │  Transcript         │   │
│  └─────────────────────┘  │  │  [Glass Card]       │   │
│                           │  └─────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Removed Elements

### Dashboard Cleanup
**Removed**:
- ❌ Tutorial hints
- ❌ Tips and tricks
- ❌ Help tooltips
- ❌ Onboarding messages
- ❌ Feature explanations
- ❌ Usage instructions on main page

**Kept**:
- ✅ Core upload functionality
- ✅ Settings toggle (speaker ID)
- ✅ Action buttons
- ✅ Results display
- ✅ Error messages (when needed)

## Interactive States

### Button States
```css
/* Default */
.btn-primary {
  background: linear-gradient(135deg, #8B5CF6, #E879F9);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
}

/* Hover */
.btn-primary:hover {
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
  transform: translateY(-2px);
}

/* Active */
.btn-primary:active {
  transform: scale(0.95);
}

/* Disabled */
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Card States
```css
/* Default */
.glass-card {
  border: 1px solid rgba(139, 92, 246, 0.2);
  transition: all 0.3s ease;
}

/* Hover */
.glass-card:hover {
  border: 1px solid rgba(139, 92, 246, 0.4);
  box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.25);
}

/* Active/Selected */
.glass-card.active {
  border: 1px solid rgba(6, 182, 212, 0.6);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.4);
}
```

## Responsive Behavior

### Desktop (1280px+)
- Two-column layout
- Full glassmorphism effects
- All animations enabled
- Large text sizes

### Tablet (768px - 1279px)
- Single column layout
- Reduced glassmorphism blur
- Simplified animations
- Medium text sizes

### Mobile (< 768px)
- Single column layout
- Minimal glassmorphism
- Essential animations only
- Smaller text sizes
- Touch-optimized controls

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Minimum contrast ratio: 4.5:1
- Enhanced contrast for important elements

### Focus States
```css
.focusable:focus-visible {
  outline: 2px solid hsl(258, 90%, 66%);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Performance Considerations

### Optimization Strategies
1. **GPU Acceleration**: Use `transform` and `opacity` for animations
2. **Lazy Loading**: Load heavy effects only when needed
3. **Debouncing**: Throttle expensive operations
4. **CSS Variables**: Use for dynamic theming
5. **Will-Change**: Hint browser for animated elements

### Animation Performance
```css
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU acceleration */
}
```

## Implementation Priority

### Phase 1: Core Branding ✅
1. Update application name to "Wisperina"
2. Implement color system
3. Add typography
4. Update all text references

### Phase 2: Visual Effects ✅
1. Implement glassmorphism
2. Add gradients
3. Create glow effects
4. Update shadows and borders

### Phase 3: Animations ✅
1. Create processing animation component
2. Add interaction animations
3. Implement transitions
4. Test performance

### Phase 4: Dashboard Cleanup ✅
1. Remove tips and hints
2. Simplify layout
3. Focus on core functionality
4. Polish final design

---

**Design System Version**: 1.0.0  
**Last Updated**: 2025-01-02  
**Status**: Ready for Implementation
