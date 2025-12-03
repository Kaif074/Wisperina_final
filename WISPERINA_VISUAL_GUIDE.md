# Wisperina - Visual Design Guide

## 🎨 Quick Reference

### Brand Colors (HSL)
```
Primary Purple:   258 90% 66%  (#8B5CF6)
Secondary Cyan:   200 98% 39%  (#06B6D4)
Accent Pink:      280 100% 70% (#E879F9)
Background:       240 10% 3.9% (#0A0A0F)
```

### Key Visual Elements

#### 1. Hero Section
```jsx
<Sparkles /> + "Wisperina" (gradient text) + <Sparkles />
"Transcribe the Future"
```
- Large gradient text with glow effect
- Animated sparkle icons
- Fade-in entrance animation

#### 2. Glass Cards
```css
.glass-card {
  background: rgba(31, 31, 46, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
}
```
- Frosted glass appearance
- Subtle purple border
- Hover effects with scale

#### 3. Processing Animation
**Components:**
- Central pulsating orb (primary color)
- 3 orbital rings (different speeds)
- 14 floating particles with glow
- Wave progress bar
- Shimmer text effect

**Timing:**
- Orbit slow: 8s
- Orbit fast: 4s
- Pulse: 2s
- Particle float: 3s

#### 4. Buttons
```css
.gradient-primary.hover-glow
```
- Purple to pink gradient
- Glow effect on hover
- Smooth transitions
- Lift animation (translateY)

#### 5. Speaker Timeline
- Glass surface background
- Colored speaker indicators with glow
- Animated current position marker
- Hover scale effects

#### 6. Transcript Viewer
- Glass card container
- Speaker badges with glass surface
- Active utterance with ring and glow
- Smooth scroll to active item

## 🎭 Animation Showcase

### Entrance Animations
```css
.animate-fade-in        /* Hero section */
.animate-pulse-glow     /* Icons, markers */
```

### Continuous Animations
```css
.animate-float          /* Floating elements */
.animate-shimmer        /* Text effects */
orbit-slow, orbit-fast  /* Orbital rings */
particle-float          /* Particle movement */
```

### Interaction Animations
```css
.hover-glow            /* Button hover */
.hover:scale-[1.01]    /* Card hover */
transition-all         /* Smooth transitions */
```

## 🌈 Gradient Combinations

### Text Gradients
```css
/* Primary: Purple → Pink */
.gradient-text
linear-gradient(135deg, #8B5CF6 0%, #E879F9 100%)

/* Cyan: Cyan → Light Cyan */
.gradient-text-cyan
linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)
```

### Background Gradients
```css
/* Page Background */
bg-gradient-to-br from-accent via-background to-secondary

/* Button Gradient */
.gradient-primary
linear-gradient(135deg, #8B5CF6 0%, #E879F9 100%)
```

## ✨ Glow Effects

### Shadow Glows
```css
.glow-primary    /* Purple: 0 0 40px rgba(139, 92, 246, 0.4) */
.glow-secondary  /* Cyan: 0 0 40px rgba(6, 182, 212, 0.4) */
.glow-accent     /* Pink: 0 0 40px rgba(232, 121, 249, 0.4) */
```

### Text Glows
```css
.text-glow       /* Purple: 0 0 20px rgba(139, 92, 246, 0.5) */
.text-glow-cyan  /* Cyan: 0 0 20px rgba(6, 182, 212, 0.5) */
```

### Interactive Glow
```css
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  transform: translateY(-2px);
}
```

## 🎯 Component Styling Patterns

### Card Pattern
```jsx
<Card className="glass-card glass-hover shadow-lg">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-2xl">
      <Icon className="w-6 h-6 text-primary" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

### Button Pattern
```jsx
<Button className="gradient-primary hover-glow">
  <Icon className="w-4 h-4 mr-2" />
  Action
</Button>
```

### Surface Pattern
```jsx
<div className="glass-surface rounded-lg p-4">
  {/* Content */}
</div>
```

### Badge Pattern
```jsx
<span className="glass-surface px-3 py-1 rounded-full font-medium">
  {/* Text */}
</span>
```

## 🔧 Utility Class Combinations

### Common Patterns
```css
/* Animated Icon */
text-primary animate-pulse-glow

/* Gradient Title */
gradient-text text-glow

/* Interactive Card */
glass-card glass-hover shadow-lg

/* Glowing Button */
gradient-primary hover-glow

/* Speaker Badge */
glass-surface px-3 py-1 rounded-full

/* Active State */
ring-2 ring-primary glow-primary

/* Smooth Transition */
transition-all hover:scale-[1.01]
```

## 📱 Responsive Considerations

### Breakpoints
```css
/* Mobile First */
text-5xl xl:text-6xl        /* Larger on desktop */
flex-col xl:flex-row        /* Stack on mobile */
w-full xl:w-auto            /* Full width on mobile */
p-4 xl:p-8                  /* More padding on desktop */
```

### Mobile Optimizations
- Smaller font sizes on mobile
- Full-width buttons on mobile
- Reduced animation complexity
- Touch-friendly hit areas

## 🎬 Animation Performance

### GPU Acceleration
```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}
```

### Optimized Properties
- Use `transform` instead of `top/left`
- Use `opacity` for fade effects
- Avoid animating `width/height`
- Use `will-change` sparingly

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animate-* {
    animation: none;
  }
}
```

## 🎨 Color Usage Guidelines

### When to Use Each Color

**Primary Purple (#8B5CF6)**
- Main brand elements
- Primary buttons
- Active states
- Important icons
- Text highlights

**Secondary Cyan (#06B6D4)**
- Secondary actions
- Informational elements
- Accent borders
- Alternative highlights
- Supporting icons

**Accent Pink (#E879F9)**
- Call-to-action elements
- Special features
- Decorative elements
- Gradient endpoints
- Attention-grabbing items

**Background Dark (#0A0A0F)**
- Page backgrounds
- Card backgrounds
- Surface elements
- Contrast base

## 🌟 Best Practices

### Do's ✅
- Use glassmorphism for cards
- Apply gradients to primary actions
- Add glow effects to interactive elements
- Use smooth transitions
- Maintain consistent spacing
- Follow color hierarchy

### Don'ts ❌
- Don't overuse animations
- Don't mix too many gradients
- Don't ignore reduced motion
- Don't use harsh color contrasts
- Don't forget hover states
- Don't skip accessibility

## 🚀 Quick Start Checklist

For new components:
- [ ] Apply glass-card or glass-surface
- [ ] Use semantic color tokens (primary, secondary, accent)
- [ ] Add appropriate glow effects
- [ ] Include hover states
- [ ] Add smooth transitions
- [ ] Test with reduced motion
- [ ] Verify color contrast
- [ ] Check responsive behavior

## 📚 Reference Links

### Key Files
- Design Spec: `WISPERINA_DESIGN_SPEC.md`
- Implementation: `WISPERINA_IMPLEMENTATION_SUMMARY.md`
- Styles: `src/index.css`
- Main Page: `src/pages/TranscriptionPage.tsx`
- Animation: `src/components/transcription/ProcessingAnimation.tsx`

### Component Examples
- SpeakerTimeline: Glass styling with animated markers
- TranscriptViewer: Glass cards with glow effects
- ProcessingAnimation: Full animation showcase
- TranscriptionPage: Complete design system usage
