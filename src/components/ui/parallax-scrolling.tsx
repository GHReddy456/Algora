import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = parallaxRef.current;
    if (!container) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const triggerElement = container.querySelector("[data-parallax-layers]");
    if (!triggerElement) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0,
      },
    });

    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 },
    ];

    layers.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
        { yPercent: layerObj.yPercent, ease: "none" },
        idx === 0 ? undefined : "<"
      );
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={parallaxRef} className="relative w-full overflow-hidden bg-white">
      <style>{`
        .algora-parallax-header {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #F8FAF7;
        }
        .algora-parallax-layers {
          position: relative;
          width: 100%;
          height: 92vh;
          overflow: hidden;
        }
        .algora-parallax-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 115%;
          object-fit: cover;
          pointer-events: none;
        }
        .algora-parallax-title-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 1.5rem;
          z-index: 3;
        }
        .algora-parallax-fade {
          position: absolute;
          inset: auto 0 0 0;
          height: 28%;
          background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #FFFFFF 100%);
          z-index: 4;
          pointer-events: none;
        }
      `}</style>

      <section className="algora-parallax-header">
        <div data-parallax-layers className="algora-parallax-layers">
          <img
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1800&q=80"
            loading="eager"
            data-parallax-layer="1"
            alt="Botanical emerald foliage"
            className="algora-parallax-img opacity-30"
          />
          <img
            src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1800&q=80"
            loading="eager"
            data-parallax-layer="2"
            alt="Microalgae cellular texture"
            className="algora-parallax-img opacity-20 mix-blend-multiply"
          />
          <div data-parallax-layer="3" className="algora-parallax-title-wrap">
            <span className="caption-3 mb-4 uppercase tracking-[0.22em] text-[#176B43]">
              Microalgae Architecture
            </span>
            <h2 className="heading-1 max-w-[740px] text-[#0F1F17]">
              Living photosynthesis, engineered for interiors.
            </h2>
          </div>
          <div
            data-parallax-layer="4"
            className="pointer-events-none absolute inset-x-0 bottom-16 z-[3] flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D1FAE5] bg-white/90 px-4 py-2 shadow-sm backdrop-blur">
              <Leaf size={16} weight="duotone" className="text-[#176B43]" aria-hidden="true" />
              <span className="caption-4 text-[#0F1F17]">
                Chlorella vulgaris · Continuous CO₂ assimilation
              </span>
            </div>
          </div>
          <div className="algora-parallax-fade" />
        </div>
      </section>
    </div>
  );
}
