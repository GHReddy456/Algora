import { useEffect, useRef, useState } from "react";

const BALL_SIZE = 340;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

interface InversionCircleScrollProps {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function InversionCircleScrollAnimation({
  eyebrow = "The science of microalgae",
  title = "Nature engineered this long before we did.",
  subtitle = "Scroll to enter the photosynthetic cycle.",
}: InversionCircleScrollProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    progress: 0,
    viewH: 760,
    viewW: 1200,
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setMetrics({
        progress: 1,
        viewH: window.innerHeight,
        viewW: window.innerWidth,
      });
      return;
    }

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const viewW = window.innerWidth;
      const travel = Math.max(1, el.offsetHeight - viewH);
      const raw = clamp(-rect.top / travel);
      setMetrics({ progress: raw, viewH, viewW });
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const { progress, viewH, viewW } = metrics;

  // Phase 1 (0 -> 0.5): Circle rises from bottom to center
  // Phase 2 (0.5 -> 1.0): Circle expands to fill the entire viewport
  const p1 = clamp(progress * 2);
  const p2 = clamp((progress - 0.5) * 2);

  const p1e = p1 < 0.5 ? 8 * p1 ** 4 : 1 - (-2 * p1 + 2) ** 4 / 2;
  const p2e = p2 * p2;

  const yOff = (1 - p1e) * (viewH / 2 + BALL_SIZE / 2);
  const coverSize = Math.max(viewW, viewH) * 2.6;
  const ballSize = BALL_SIZE + p2e * (coverSize - BALL_SIZE);
  const clipX = viewW / 2;
  const clipY = viewH / 2 + yOff;
  const clipR = ballSize / 2;

  return (
    <div ref={trackRef} className="relative h-[240vh] w-full bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Expanding Deep Forest Emerald Circle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 rounded-full bg-[#062317] will-change-transform"
          style={{
            width: ballSize,
            height: ballSize,
            transform: `translate(-50%, calc(-50% + ${yOff}px))`,
          }}
        />

        {/* Dark Ink Layer (visible outside the circle) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-[#0F1F17]">
          <span className="caption-3 mb-4 uppercase tracking-[0.2em] text-[#059669]">
            {eyebrow}
          </span>
          <h2 className="heading-1 max-w-[680px]">{title}</h2>
          <p className="body-3 mt-5 max-w-md text-[#3B5246]">{subtitle}</p>
        </div>

        {/* Inverted White Ink Layer (clipped inside the circle) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white will-change-[clip-path]"
          style={{ clipPath: `circle(${clipR}px at ${clipX}px ${clipY}px)` }}
        >
          <span className="caption-3 mb-4 uppercase tracking-[0.2em] text-[#4ADE80]">
            {eyebrow}
          </span>
          <h2 className="heading-1 max-w-[680px] text-white">{title}</h2>
          <p className="body-3 mt-5 max-w-md text-[#A7F3D0]">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
