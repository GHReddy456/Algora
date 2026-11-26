import { useEffect, useRef } from "react";

interface BubbleCell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  kind: "cell" | "o2";
  hue: string;
}

const CELL_COLORS = [
  "rgba(16, 185, 129,", // emerald
  "rgba(52, 211, 153,", // mint-emerald
  "rgba(132, 204, 22,", // chlorophyll lime
  "rgba(23, 107, 67,",  // deep botanical
];

export function CursorAlgaeJet() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: BubbleCell[] = [];
    let lastX = -1;
    let lastY = -1;
    let raf = 0;

    const spawnJet = (x: number, y: number, dx: number, dy: number) => {
      const speed = Math.hypot(dx, dy);
      const count = Math.min(4, Math.max(1, Math.floor(speed / 9)));

      for (let i = 0; i < count; i++) {
        if (particles.length > 95) particles.shift();

        const spread = (Math.random() - 0.5) * 0.9;
        const angle = Math.atan2(-dy, -dx) + spread;
        const jetSpeed = 0.4 + Math.random() * 1.4;
        const isO2 = Math.random() > 0.42;

        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * jetSpeed,
          vy: Math.sin(angle) * jetSpeed - 0.35, // gentle upward buoyancy
          radius: isO2 ? 2.5 + Math.random() * 4.5 : 2 + Math.random() * 3.5,
          alpha: 0.72 + Math.random() * 0.25,
          decay: 0.016 + Math.random() * 0.014,
          kind: isO2 ? "o2" : "cell",
          hue: CELL_COLORS[Math.floor(Math.random() * CELL_COLORS.length)],
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (lastX >= 0 && lastY >= 0) {
        const dx = x - lastX;
        const dy = y - lastY;
        if (Math.hypot(dx, dy) > 2.5) {
          spawnJet(x, y, dx, dy);
        }
      }
      lastX = x;
      lastY = y;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy -= 0.028; // rising micro-bubble buoyancy
        p.radius += 0.04;
        p.alpha -= p.decay;

        if (p.alpha <= 0.02) {
          particles.splice(i, 1);
          continue;
        }

        if (p.kind === "o2") {
          // Refractive O2 micro-bubble with crisp rim and specular highlight
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(236, 253, 245, ${(p.alpha * 0.35).toFixed(3)})`;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = `rgba(16, 185, 129, ${(p.alpha * 0.65).toFixed(3)})`;
          ctx.stroke();

          // Tiny specular glint
          ctx.beginPath();
          ctx.arc(
            p.x - p.radius * 0.32,
            p.y - p.radius * 0.32,
            Math.max(0.7, p.radius * 0.22),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${(p.alpha * 0.9).toFixed(3)})`;
          ctx.fill();
        } else {
          // Living Chlorella micro-cell with soft outer membrane
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.hue} ${(p.alpha * 0.58).toFixed(3)})`;
          ctx.fill();
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(167, 243, 208, ${(p.alpha * 0.7).toFixed(3)})`;
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full"
    />
  );
}
