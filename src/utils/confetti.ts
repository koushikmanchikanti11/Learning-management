import confetti from 'canvas-confetti';

/**
 * Fires a festive multi-stage confetti burst across the screen
 */
export function triggerCelebrationConfetti() {
  const count = 220;
  const defaults = {
    origin: { y: 0.68 },
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    try {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    } catch {
      // Fallback gracefully if canvas context is unavailable
    }
  }

  // Primary center bursts with rich color palette
  fire(0.28, {
    spread: 35,
    startVelocity: 55,
    colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#3B82F6', '#FBBF24'],
  });

  fire(0.22, {
    spread: 65,
    colors: ['#F59E0B', '#FBBF24', '#34D399', '#6EE7B7', '#A78BFA'],
  });

  fire(0.32, {
    spread: 110,
    decay: 0.91,
    scalar: 0.85,
    colors: ['#F59E0B', '#10B981', '#E11D48', '#8B5CF6'],
  });

  fire(0.1, {
    spread: 130,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.25,
  });

  fire(0.08, {
    spread: 140,
    startVelocity: 45,
  });

  // Lateral side cannons
  setTimeout(() => {
    try {
      confetti({
        particleCount: 65,
        angle: 60,
        spread: 60,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
      confetti({
        particleCount: 65,
        angle: 120,
        spread: 60,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
      });
    } catch {
      // ignore
    }
  }, 220);

  // Final star shower
  setTimeout(() => {
    try {
      confetti({
        particleCount: 40,
        spread: 100,
        origin: { y: 0.4 },
        shapes: ['star'],
        colors: ['#F59E0B', '#FBBF24', '#FFFFFF'],
        scalar: 1.1,
      });
    } catch {
      // ignore
    }
  }, 450);
}
