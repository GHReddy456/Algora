import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MicroalgaeStream } from "@/components/ui/microalgae-stream";

gsap.registerPlugin(ScrollTrigger);

export function MicroToTangibleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [convergence, setConvergence] = useState(0.15);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setConvergence(0.92);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      end: "bottom 30%",
      scrub: true,
      onUpdate: (self) => {
        setConvergence(0.15 + self.progress * 0.8);
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-y border-[#10B981]/20 bg-[#062317] px-6 py-24 text-white sm:px-10 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="caption-3 uppercase tracking-[0.18em] text-[#4ADE80]">
            From microscopic to tangible
          </span>
          <h2 className="heading-2 mt-4 max-w-[680px] text-white">
            What nature perfected.
            <br />
            We bring into your space.
          </h2>
          <p className="body-3 mt-5 text-[#A7F3D0]/85">
            Living Chlorella vulgaris cultures circulate continuously inside an
            illuminated borosilicate column, uniting biological carbon capture
            with precision indoor air renewal.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#4ADE80] transition-all duration-150"
                style={{ width: `${Math.round(convergence * 100)}%` }}
              />
            </div>
            <span className="font-mono caption-4 text-[#4ADE80]">
              {convergence > 0.6 ? "Photobioreactor column" : "Cellular suspension"}
            </span>
          </div>
        </div>

        <div className="relative h-[400px] overflow-hidden rounded-3xl border border-[#10B981]/30 bg-[#041810] shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:h-[480px] lg:col-span-7">
          <MicroalgaeStream density={260} convergence={convergence} />
          <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
            <span className="rounded-full border border-[#10B981]/30 bg-[#062317]/90 px-4 py-1.5 caption-4 text-[#A7F3D0] backdrop-blur">
              Scroll to converge culture into cylindrical chamber
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
