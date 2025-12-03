import { useEffect, useState } from 'react';

interface ProcessingAnimationProps {
  message?: string;
}

export default function ProcessingAnimation({ message = 'Processing your audio...' }: ProcessingAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Quantum Pulse Animation */}
      <div className="relative w-64 h-64 mb-8">
        {/* Central Orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full gradient-primary animate-pulse-glow glow-primary gpu-accelerated" />
        </div>

        {/* Orbital Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute w-40 h-40 rounded-full border-2 border-primary/30 gpu-accelerated"
            style={{ animation: 'orbit-slow 8s linear infinite' }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute w-52 h-52 rounded-full border-2 border-secondary/20 gpu-accelerated"
            style={{ animation: 'orbit-fast 6s linear infinite' }}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute w-60 h-60 rounded-full border border-accent/10 gpu-accelerated"
            style={{ animation: 'orbit-slow 10s linear infinite' }}
          />
        </div>

        {/* Floating Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary glow-primary gpu-accelerated"
            style={{
              top: `${50 + 30 * Math.cos((i * Math.PI * 2) / 8)}%`,
              left: `${50 + 30 * Math.sin((i * Math.PI * 2) / 8)}%`,
              animation: `particle-float ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}

        {/* Secondary Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`sec-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-secondary glow-secondary gpu-accelerated"
            style={{
              top: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6 + Math.PI / 6)}%`,
              left: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6 + Math.PI / 6)}%`,
              animation: `particle-float ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Status Message */}
      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-glow mb-2">{message}</p>
        <p className="text-sm text-muted-foreground">This may take a few moments</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md">
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div
            className="absolute inset-y-0 left-0 gradient-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          
          {/* Animated Wave Effect */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(var(--primary-glow)), transparent)',
              animation: 'wave-progress 2s linear infinite',
            }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="mt-2 text-center">
          <span className="text-sm font-medium gradient-text">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Shimmer Effect Text */}
      <div className="mt-8">
        <div
          className="text-xs text-muted-foreground"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--muted-foreground)), hsl(var(--primary)), hsl(var(--muted-foreground)))',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
          }}
        >
          Analyzing audio with AI...
        </div>
      </div>
    </div>
  );
}
