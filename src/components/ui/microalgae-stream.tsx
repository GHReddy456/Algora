import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface MicroalgaeStreamProps {
  className?: string;
  density?: number;
  convergence?: number; // 0 = dispersed cloud, 1 = cylindrical bioreactor column
}

interface Particle {
  angle: number;
  radius: number;
  y: number;
  speed: number;
  size: number;
  isBubble: boolean;
  hueOffset: number;
}

/**
 * Helical fluid-stream particle canvas inspired by OrbitalHeroSection,
 * correlated to Chlorella vulgaris microalgae & O2 micro-bubbles circulating
 * inside a transparent cylindrical photobioreactor.
 */
export function MicroalgaeStream({
  className,
  density = 220,
  convergence = 0.75,
}: MicroalgaeStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const convRef = useRef(convergence);
  convRef.current = convergence;

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;

    const particles: Particle[] = Array.from({ length: density }, (_, i) => ({
      angle: (i / density) * Math.PI * 16,
      radius: 0.25 + ((i * 37) % 100) / 130,
      y: ((i * 73) % 100) / 100,
      speed: 0.28 + ((i * 19) % 40) / 90,
      size: i % 6 === 0 ? 3.2 : 1.8 + ((i * 13) % 10) / 5,
      isBubble: i % 7 === 0,
      hueOffset: ((i * 29) % 20) - 10,
    }));

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const colRadius = Math.min(width, height) * (0.42 - convRef.current * 0.24);

      // Subtle cylindrical glass boundary when converged
      if (convRef.current > 0.35) {
        const alpha = (convRef.current - 0.35) * 0.28;
        ctx.strokeStyle = `rgba(23, 107, 67, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.roundRect(cx - colRadius * 1.08, height * 0.1, colRadius * 2.16, height * 0.8, 24);
        ctx.stroke();
      }

      for (const p of particles) {
        const theta = p.angle + t * p.speed;
        const r = p.radius * colRadius;
        const x = cx + Math.cos(theta) * r;
        const depth = Math.sin(theta);
        const yNorm = (p.y - t * 0.08 * p.speed + 10) % 1;
        const y = height * 0.12 + yNorm * height * 0.76;
        const scale = 0.7 + (depth + 1) * 0.25;
        const alpha = 0.25 + (depth + 1) * 0.32;

        if (p.isBubble) {
          ctx.strokeStyle = `rgba(53, 166, 106, ${(alpha * 0.85).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          const g = 107 + p.hueOffset;
          ctx.fillStyle = `rgba(23, ${g}, 67, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      t += 0.016;
      draw();
      if (!reduced) {
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    draw();
    if (!reduced) raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <div ref={hostRef} className={cn("relative h-full w-full overflow-hidden", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
    </div>
  );
}
