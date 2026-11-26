import { useEffect, useRef, useState } from "react";

const TAGLINE_WORDS = (
  "Living biology engineered to quietly renew the air inside the spaces where we live and work."
).split(" ");

export function TaglineReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(1);
      return;
    }

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.25;
      const raw = (start - rect.top) / (start - end);
      setProgress((prev) => Math.max(prev, Math.min(1, Math.max(0, raw))));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Core thesis"
      className="border-y border-[#D1FAE5] bg-[#ECFDF5]/60 px-6 py-24 sm:px-10 md:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <p className="caption-3 mb-6 uppercase tracking-[0.18em] text-[#059669]">
          Photosynthetic intelligence
        </p>
        <h2 className="heading-2 max-w-[680px] leading-[1.15] text-[#0F1F17]">
          {TAGLINE_WORDS.map((word, idx) => {
            const threshold = idx / TAGLINE_WORDS.length;
            const active = reducedMotion || progress >= threshold;
            return (
              <span
                key={`${word}-${idx}`}
                className="inline-block transition-opacity duration-500 ease-algora"
                style={{ opacity: active ? 1 : 0.26 }}
              >
                {word}&nbsp;
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
