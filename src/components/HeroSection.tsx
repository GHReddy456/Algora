import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Mouse, Leaf, GlobeHemisphereWest, Plant } from "@phosphor-icons/react";
import { ChlorellaCellCanvas } from "@/components/three/ChlorellaCellCanvas";

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const y = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
        setScrollProgress(y);
        rafId = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-white via-[#F9FDF4] to-[#FEFDF2] px-6 pt-24 pb-8 sm:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-[18%] h-20 w-20 rounded-full bg-[#BEF264]/25 blur-xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[44%] top-[24%] h-12 w-12 rounded-full bg-[#86EFAC]/25 blur-lg"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[22%] right-[40%] h-16 w-16 rounded-full bg-[#FDE047]/20 blur-xl"
      />

      <div className="mx-auto my-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex flex-col items-start text-left lg:col-span-5"
        >
          <span className="caption-3 mb-5 uppercase tracking-[0.18em] text-[#176B43]">
            MICROALGAE BIOTECH
          </span>

          <h1 className="max-w-[540px] text-4xl font-semibold leading-[1.06] tracking-[-0.03em] text-[#171C19] sm:text-5xl lg:text-6xl">
            Living air <span className="text-[#2B8C4E]">purification.</span>
          </h1>

          <p className="mt-5 max-w-[460px] text-lg font-medium leading-relaxed text-[#4A5951] sm:text-xl">
            Engineered microalgae that capture carbon and breathe fresh oxygen
            into your space.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <a
              href="#science"
              className="button-md inline-flex items-center gap-2 rounded-full bg-[#0B6B3A] px-6 py-3 text-white shadow-[0_10px_26px_rgba(11,107,58,0.22)] transition-all duration-300 ease-algora hover:-translate-y-0.5 hover:bg-[#08542D] active:scale-[0.98]"
            >
              <span>Explore the science</span>
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </a>

            <a
              href="#product"
              className="button-md inline-flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-white px-6 py-3 text-[#171C19] transition-all duration-300 ease-algora hover:-translate-y-0.5 hover:border-[#176B43]/40 hover:bg-[#F8FAF7] active:scale-[0.98]"
            >
              <span>Discover Algora</span>
            </a>
          </div>

          <div className="mt-9 flex w-full max-w-[420px] items-center gap-3 pt-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D1FAE5] text-[#777F79]">
              <Mouse size={15} aria-hidden="true" />
            </div>
            <span className="caption-2 shrink-0 text-[#777F79]">
              Drag to explore the cell in 360°.
            </span>
            <span className="h-px flex-1 bg-[#E4EAE5]" aria-hidden="true" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[440px] w-full sm:h-[540px] lg:col-span-7 lg:h-[600px]"
        >
          <ChlorellaCellCanvas scrollProgress={scrollProgress} />
        </motion.div>
      </div>

      <div className="mx-auto mt-6 grid w-full max-w-5xl grid-cols-1 divide-y divide-[#E4EAE5] border-t border-[#E4EAE5] pt-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="flex items-center justify-center gap-3 py-2 sm:py-0">
          <Leaf size={20} weight="duotone" className="text-[#176B43]" aria-hidden="true" />
          <div className="text-left">
            <p className="caption-3 text-[#171C19]">Cleaner Air</p>
            <p className="caption-5 text-[#777F79]">Naturally</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 py-2 sm:py-0">
          <GlobeHemisphereWest size={20} weight="duotone" className="text-[#176B43]" aria-hidden="true" />
          <div className="text-left">
            <p className="caption-3 text-[#171C19]">Lower Carbon</p>
            <p className="caption-5 text-[#777F79]">Footprint</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 py-2 sm:py-0">
          <Plant size={20} weight="duotone" className="text-[#176B43]" aria-hidden="true" />
          <div className="text-left">
            <p className="caption-3 text-[#171C19]">A Greener</p>
            <p className="caption-5 text-[#777F79]">Tomorrow</p>
          </div>
        </div>
      </div>
    </section>
  );
}
