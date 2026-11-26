import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Sun, Wind, Drop, Leaf, Pulse, ShieldCheck } from "@phosphor-icons/react";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

type CharacterProps = {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
};

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " ";
  const distanceFromCenter = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.42], [distanceFromCenter * 38, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.42], [distanceFromCenter * 36, 0]);

  return (
    <motion.span
      className={cn("inline-block text-[#059669]", isSpace && "w-3 sm:w-5")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

const ALGAE_PILLARS = [
  {
    index: "01",
    icon: Sun,
    label: "Photon capture",
    detail: "Tuned optical wavelengths energize chlorophyll a and b inside the culture.",
  },
  {
    index: "02",
    icon: Leaf,
    label: "Chlorella culture",
    detail: "Living freshwater microalgae suspended in a 1 litre borosilicate vessel.",
  },
  {
    index: "03",
    icon: Wind,
    label: "Oxygen generation",
    detail: "Oxygenic photosynthesis releases fresh molecular O₂ into indoor spaces.",
  },
  {
    index: "04",
    icon: Drop,
    label: "Bio aeration",
    detail: "Concealed fluidics gently circulate and aerate the living suspension.",
  },
  {
    index: "05",
    icon: ShieldCheck,
    label: "HEPA + Carbon",
    detail: "Multi stage mechanical and activated carbon filtration captures particulates.",
  },
  {
    index: "06",
    icon: Pulse,
    label: "Live telemetry",
    detail: "Continuous environmental sensing tracks temperature, humidity, and status.",
  },
];

export function AlgaeTextScrollSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const targetRef2 = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: scrollYProgress2 } = useScroll({
    target: targetRef2,
    offset: ["start end", "center center"],
  });

  const text = "BREATHE NATURE INDOORS";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  const gridOpacity = useTransform(scrollYProgress2, [0, 0.45], [0.35, 1]);
  const gridY = useTransform(scrollYProgress2, [0, 0.55], [40, 0]);

  return (
    <section className="w-full overflow-hidden border-y border-[#D1FAE5] bg-[#F8FAF7]">
      {/* Block 1: 3D Character Scroll Assembly */}
      <div
        ref={targetRef}
        className="relative flex h-[56vh] items-center justify-center px-6 md:h-[68vh]"
      >
        <div
          className="w-full max-w-5xl text-center text-3xl font-semibold uppercase tracking-tight sm:text-5xl md:text-6xl"
          style={{ perspective: "600px" }}
        >
          {characters.map((char, index) => (
            <CharacterV1
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* Block 2: Clean Architectural 3x2 System Bento Grid */}
      <div ref={targetRef2} className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
        <motion.div
          style={{ opacity: gridOpacity, y: gridY }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ALGAE_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-[#D1FAE5] bg-white p-6 transition-all duration-300 ease-algora hover:border-[#10B981] hover:shadow-[0_14px_36px_rgba(5,150,105,0.08)]"
              >
                <Spotlight size={220} />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]">
                    <Icon size={20} weight="duotone" aria-hidden="true" />
                  </div>
                  <span className="font-mono caption-4 text-[#059669]">
                    {item.index}
                  </span>
                </div>
                <h3 className="title-3 relative z-10 mt-5 text-[#0F1F17]">
                  {item.label}
                </h3>
                <p className="body-6 relative z-10 mt-2 text-[#3B5246]">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
