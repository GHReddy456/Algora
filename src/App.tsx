import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import ReactLenis from "lenis/react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ParallaxComponent } from "@/components/ui/parallax-scrolling";
import GlyphPortal from "@/components/ui/glyph-portal";
import { AlgaeTextScrollSection } from "@/components/ui/text-scroll-animation";
import { ScienceSection } from "@/components/ScienceSection";
import { MicroToTangibleSection } from "@/components/MicroToTangibleSection";
import { ProductSection } from "@/components/ProductSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { MonitoringSection } from "@/components/MonitoringSection";
import { VisionSection } from "@/components/VisionSection";
import { FaqAndCtaSection } from "@/components/FaqAndCtaSection";
import { ConnectModal } from "@/components/ConnectModal";

/** Live photosynthetic wave canvas rendered inside GlyphPortal. */
function TideField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      visible = false,
      width = 1,
      height = 1;

    const draw = (time: number) => {
      frame = 0;
      const t = motion.matches ? 0 : time / 8000;
      context.fillStyle = "#062317";
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        width * 0.72,
        height * 0.2,
        0,
        width * 0.5,
        height * 0.4,
        width * 0.8
      );
      glow.addColorStop(0, "#176B43");
      glow.addColorStop(1, "#041810");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (let line = -6; line < 46; line++) {
        context.beginPath();
        for (let x = -8; x <= width + 8; x += 8) {
          const u = x / width;
          const bend =
            Math.sin(u * 5 + t + line * 0.035) * height * 0.13 +
            Math.cos(u * 9 - t * 0.7) * height * 0.045;
          const y = (line * height) / 35 + bend;
          if (x === -8) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = line % 5 === 0 ? "#6EE7B7" : "#35A66A";
        context.globalAlpha = line % 5 === 0 ? 0.34 : 0.2;
        context.lineWidth = line % 5 === 0 ? 1.2 : 0.7;
        context.stroke();
      }
      context.globalAlpha = 1;

      if (visible && !motion.matches && !document.hidden) {
        frame = requestAnimationFrame(draw);
      }
    };

    const refresh = () => {
      cancelAnimationFrame(frame);
      const box = canvas.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const ratio = Math.min(devicePixelRatio, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    };

    const resize = new ResizeObserver(refresh);
    resize.observe(canvas);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      refresh();
    });
    observer.observe(canvas);
    motion.addEventListener("change", refresh);
    document.addEventListener("visibilitychange", refresh);
    refresh();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      motion.removeEventListener("change", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

export function App() {
  const [connectOpen, setConnectOpen] = useState(false);

  const isNotFound =
    typeof window !== "undefined" &&
    window.location.pathname !== "/" &&
    window.location.pathname !== "/index.html";

  if (isNotFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
          404
        </span>
        <h1 className="heading-2 mt-3 text-[#0F1F17]">Page not found</h1>
        <p className="body-3 mt-4 max-w-md text-[#4A6154]">
          The requested path does not exist on Algora. Return to the main
          experience.
        </p>
        <a
          href="/"
          className="button-md mt-8 rounded-full bg-[#059669] px-5 py-2.5 text-white hover:bg-[#047857]"
        >
          Return to Algora
        </a>
      </main>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
        <div className="min-h-screen bg-white text-[#0F1F17]">
          <Navbar onConnectClick={() => setConnectOpen(true)} />

          <main id="main-content">
            <HeroSection />
            <ParallaxComponent />

            <GlyphPortal
              word="ALGORA"
              focusChar="O"
              scrollLength={2.2}
              background={<TideField />}
            >
              <div className="mx-auto max-w-4xl">
                <span className="font-mono caption-3 uppercase tracking-[0.18em] text-[#4ADE80]">
                  Living photosynthesis
                </span>
                <h2 className="heading-1 mt-4 max-w-2xl text-white">
                  Go with the biological current.
                </h2>
                <p className="body-3 mt-5 max-w-xl text-[#D1FAE5]/90">
                  Every letter opens onto a continuous living culture where
                  Chlorella vulgaris transforms light and dissolved carbon into
                  fresh indoor oxygen.
                </p>
              </div>
            </GlyphPortal>

            <AlgaeTextScrollSection />
            <ScienceSection />
            <MicroToTangibleSection />
            <ProductSection />
            <HowItWorksSection />
            <MonitoringSection />
            <VisionSection />
            <FaqAndCtaSection onConnectClick={() => setConnectOpen(true)} />
          </main>

          <ConnectModal
            open={connectOpen}
            onClose={() => setConnectOpen(false)}
          />
        </div>
      </ReactLenis>
    </MotionConfig>
  );
}

export default App;
