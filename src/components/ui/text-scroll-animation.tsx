import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
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

function StackingPillarCard({
  item,
  index,
  total,
  progress,
}: {
  item: (typeof ALGAE_PILLARS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const Icon = item.icon;
  const step = 1 / Math.max(1, total - 1);
  const center = index * step;

  const y = useTransform(
    progress,
    [center - step, center, center + step],
    [240, 0, -28 - index * 4]
  );
  const scale = useTransform(
    progress,
    [center - step, center, center + step],
    [0.92, 1, 0.9]
  );
  const rotateX = useTransform(
    progress,
    [center - step, center, center + step],
    [16, 0, -6]
  );
  const opacity = useTransform(
    progress,
    [center - step * 1.05, center - step * 0.25, center, center + step],
    [0, 1, 1, 0.35]
  );

  return (
    <motion.article
      style={{
        y,
        scale,
        rotateX,
        opacity,
        zIndex: index + 1,
        transformPerspective: 1200,
      }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="group relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D1FAE5] bg-white p-8 shadow-[0_24px_64px_rgba(6,35,23,0.1)] sm:p-10">
        <Spotlight size={260} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]">
            <Icon size={24} weight="duotone" aria-hidden="true" />
          </div>
          <span className="font-mono title-3 text-[#059669]">
            {item.index}
          </span>
        </div>

        <h3 className="heading-4 relative z-10 mt-8 text-[#0F1F17]">
          {item.label}
        </h3>
        <p className="body-3 relative z-10 mt-3 max-w-lg text-[#3B5246]">
          {item.detail}
        </p>
      </div>
    </motion.article>
  );
}

export function AlgaeTextScrollSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: deckScrollProgress } = useScroll({
    target: deckRef,
    offset: ["start start", "end end"],
  });

  const smoothDeckProgress = useSpring(deckScrollProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });

  const text = "BREATHE NATURE INDOORS";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <section className="w-full border-y border-[#D1FAE5] bg-[#F8FAF7]">
      {/* Block 1: 3D Character Scroll Assembly */}
      <div
        ref={targetRef}
        className="relative flex h-[56vh] items-center justify-center overflow-hidden px-6 md:h-[68vh]"
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

      {/* Block 2: 3D Scroll-Stacking Cards for the 6 Algae Pillars */}
      {reduced ? (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 pb-24 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
          {ALGAE_PILLARS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-[#D1FAE5] bg-white p-6"
              >
                <div className="flex items-center justify-between">
                  <Icon size={20} weight="duotone" className="text-[#059669]" />
                  <span className="font-mono caption-4 text-[#059669]">
                    {item.index}
                  </span>
                </div>
                <h3 className="title-3 mt-4 text-[#0F1F17]">{item.label}</h3>
                <p className="body-6 mt-2 text-[#3B5246]">{item.detail}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={deckRef}
          className="relative px-6 sm:px-10"
          style={{ height: `${ALGAE_PILLARS.length * 60}vh` }}
        >
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
            <div className="relative h-[300px] w-full max-w-2xl sm:h-[320px]">
              {ALGAE_PILLARS.map((item, idx) => (
                <StackingPillarCard
                  key={item.label}
                  item={item}
                  index={idx}
                  total={ALGAE_PILLARS.length}
                  progress={smoothDeckProgress}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
