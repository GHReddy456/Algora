import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { FAQ_ITEMS, type FaqItem } from "@/data/algoraData";

interface FaqAndCtaSectionProps {
  onConnectClick: () => void;
}

const CARD_HEIGHT = 204;
const ROW_GAP = 20;
const TURN_SPAN = 120;
const BASE_SPEED = 48; // px per second along serpentine path

function SerpentineFaqConveyor({ items }: { items: FaqItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const pausedRef = useRef(false);
  const [width, setWidth] = useState(1280);
  const [reducedMotion, setReducedMotion] = useState(false);

  const cardW = width < 640 ? 290 : 360;
  const gap = 22;
  const pitch = cardW + gap;

  // Row 1 exits left -> Row 2 enters left, exits right -> Row 3 enters right, exits left
  const rowSpan = width + cardW + 40;
  const minNeeded = 3 * rowSpan + 2 * TURN_SPAN + pitch;
  const repeatCycles = Math.max(1, Math.ceil(minNeeded / (items.length * pitch)));

  const deck = useMemo(() => {
    const out: Array<FaqItem & { num: string; uid: string }> = [];
    for (let c = 0; c < repeatCycles; c++) {
      items.forEach((item, idx) => {
        out.push({
          ...item,
          num: String(idx + 1).padStart(2, "0"),
          uid: `${c}-${idx}`,
        });
      });
    }
    return out;
  }, [items, repeatCycles]);

  const totalLen = deck.length * pitch;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth || window.innerWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const rowY = [0, CARD_HEIGHT + ROW_GAP, (CARD_HEIGHT + ROW_GAP) * 2];
    const t1End = rowSpan + TURN_SPAN;
    const r2End = t1End + rowSpan;
    const t2End = r2End + TURN_SPAN;
    const r3End = t2End + rowSpan;

    let offset = 0;
    let currentSpeed = BASE_SPEED;
    let lastTime = 0;
    let raf = 0;

    const updatePositions = (now: number) => {
      const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
      lastTime = now;

      const targetSpeed = pausedRef.current ? 0 : BASE_SPEED;
      currentSpeed += (targetSpeed - currentSpeed) * 0.08;
      offset = (offset + currentSpeed * dt) % totalLen;

      for (let i = 0; i < deck.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;

        const s = (offset + i * pitch) % totalLen;
        let x = 0;
        let y = 0;
        let opacity = 1;
        let visible = true;

        if (s < rowSpan) {
          // Row 1: Right -> Left
          const u = s / rowSpan;
          x = width + 20 - u * rowSpan;
          y = rowY[0];
        } else if (s < t1End) {
          // Left U-turn: Row 1 exit -> Row 2 entrance
          const u = (s - rowSpan) / TURN_SPAN;
          const easeU =
            u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          x = -cardW - 20 - Math.sin(u * Math.PI) * 24;
          y = rowY[0] + easeU * (rowY[1] - rowY[0]);
          opacity = 1 - Math.sin(u * Math.PI) * 0.65;
        } else if (s < r2End) {
          // Row 2: Left -> Right (exact cards leaving Row 1 enter here)
          const u = (s - t1End) / rowSpan;
          x = -cardW - 20 + u * rowSpan;
          y = rowY[1];
        } else if (s < t2End) {
          // Right U-turn: Row 2 exit -> Row 3 entrance
          const u = (s - r2End) / TURN_SPAN;
          const easeU =
            u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
          x = width + 20 + Math.sin(u * Math.PI) * 24;
          y = rowY[1] + easeU * (rowY[2] - rowY[1]);
          opacity = 1 - Math.sin(u * Math.PI) * 0.65;
        } else if (s < r3End) {
          // Row 3: Right -> Left (exact cards leaving Row 2 enter here)
          const u = (s - t2End) / rowSpan;
          x = width + 20 - u * rowSpan;
          y = rowY[2];
        } else {
          // Offscreen wrap from Row 3 back to Row 1 entrance
          visible = false;
          opacity = 0;
          x = width + cardW;
          y = rowY[0];
        }

        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = visible ? opacity.toFixed(3) : "0";
        el.style.pointerEvents = visible ? "auto" : "none";
      }

      raf = requestAnimationFrame(updatePositions);
    };

    raf = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(raf);
  }, [deck.length, pitch, rowSpan, totalLen, width, cardW, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
        {items.map((item, idx) => (
          <article
            key={item.question}
            className="rounded-2xl border border-[#D1FAE5] bg-white p-6 shadow-[0_10px_32px_rgba(23,107,67,0.05)]"
          >
            <span className="font-mono caption-4 text-[#059669]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="title-2 mt-2 text-[#0F1F17]">{item.question}</h3>
            <p className="body-6 mt-2.5 leading-relaxed text-[#3B5246]">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    );
  }

  const totalHeight = CARD_HEIGHT * 3 + ROW_GAP * 2;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      onFocusCapture={() => {
        pausedRef.current = true;
      }}
      onBlurCapture={() => {
        pausedRef.current = false;
      }}
      className="relative w-full overflow-hidden"
      style={{ height: totalHeight }}
    >
      {/* Subtle serpentine flow connectors on left (1->2) and right (2->3) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-32"
      />

      {deck.map((item, idx) => (
        <article
          key={item.uid}
          ref={(el) => {
            cardRefs.current[idx] = el;
          }}
          style={{
            width: cardW,
            height: CARD_HEIGHT,
            willChange: "transform, opacity",
          }}
          className="absolute left-0 top-0 flex flex-col justify-between rounded-2xl border border-[#D1FAE5] bg-white p-5 shadow-[0_10px_32px_rgba(23,107,67,0.05)] transition-colors duration-300 hover:border-[#10B981] sm:p-6"
        >
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono caption-4 text-[#059669]">
                {item.num}
              </span>
            </div>
            <h3 className="title-3 text-[#0F1F17] line-clamp-2">
              {item.question}
            </h3>
          </div>
          <p className="body-6 mt-2 leading-relaxed text-[#3B5246] line-clamp-4">
            {item.answer}
          </p>
        </article>
      ))}
    </div>
  );
}

export function FaqAndCtaSection({ onConnectClick }: FaqAndCtaSectionProps) {
  return (
    <>
      {/* Continuous 3-Row Serpentine Scrolling FAQ Section */}
      <section
        id="faq"
        className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAF7] to-white py-24 md:py-28"
      >
        <div className="mx-auto mb-12 flex max-w-7xl flex-col justify-between gap-4 px-6 sm:flex-row sm:items-end sm:px-10">
          <div>
            <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
              Questions
            </span>
            <h2 className="heading-3 mt-3 text-[#0F1F17]">
              Scientific and technical details
            </h2>
          </div>
          <span className="caption-4 text-[#777F79]">
            Hover any card to pause the stream
          </span>
        </div>

        <SerpentineFaqConveyor items={FAQ_ITEMS} />
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-[#10B981]/20 bg-[#062317] px-6 py-24 text-white sm:px-10 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="heading-1 mx-auto max-w-[680px] bg-gradient-to-r from-white via-[#D1FAE5] to-[#4ADE80] bg-clip-text text-transparent">
              Let&apos;s grow a better atmosphere.
            </h2>
            <p className="body-3 mx-auto mt-6 max-w-xl text-[#A7F3D0]/85">
              Partner with Algora to explore microalgae photobioreactors,
              environmental research collaborations, and early architectural
              pilots.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onConnectClick}
                className="button-md inline-flex items-center gap-2 rounded-full bg-[#10B981] px-6 py-3 text-[#041810] shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-300 ease-algora hover:bg-[#34D399] active:scale-[0.98]"
              >
                <span>Connect with Algora</span>
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
              <a
                href="#how-it-works"
                className="button-md inline-flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-white/5 px-6 py-3 text-white transition-all duration-300 ease-algora hover:bg-white/10 active:scale-[0.98]"
              >
                <span>Explore our technology</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-[#E4EAE5] bg-white px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <svg
              width="22"
              height="22"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="#176B43"
                strokeWidth="2"
                fill="#F8FAF7"
              />
              <path
                d="M16 6.5C11.2 6.5 7.5 10.5 7.5 15.8C7.5 21.1 11.4 25.5 16.5 25.5C19.8 25.5 22.6 23.6 23.8 20.8C20.2 21.8 16.5 19.6 16.5 15.8C16.5 12 19.5 9.2 22.8 10.2C21.3 7.9 18.8 6.5 16 6.5Z"
                fill="#176B43"
              />
              <circle cx="13.5" cy="16.5" r="2.2" fill="#35A66A" />
            </svg>
            <span className="title-3 font-semibold tracking-wider text-[#171C19]">
              ALGORA
            </span>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
            <a href="#vision" className="body-5 text-[#777F79] hover:text-[#171C19]">
              About
            </a>
            <a href="#science" className="body-5 text-[#777F79] hover:text-[#171C19]">
              Research
            </a>
            <button
              type="button"
              onClick={onConnectClick}
              className="body-5 text-[#777F79] hover:text-[#171C19]"
            >
              Contact
            </button>
            <a href="#faq" className="body-5 text-[#777F79] hover:text-[#171C19]">
              Privacy policy
            </a>
            <a href="#faq" className="body-5 text-[#777F79] hover:text-[#171C19]">
              Terms
            </a>
          </nav>

          <div className="flex items-center gap-4 caption-4 text-[#777F79]">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#176B43]"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#176B43]"
            >
              X
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
