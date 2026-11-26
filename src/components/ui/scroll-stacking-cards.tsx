import { useRef } from "react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlgoraDeckCard = {
  name: string;
  tag: string;
  summary: string;
  href: string;
  display?: string;
  image: string;
  accent: string;
};

export const ALGORA_DECK_CARDS: AlgoraDeckCard[] = [
  {
    name: "Photosynthesis",
    tag: "01 · Biological Engine",
    summary:
      "Chlorophyll a and b inside Chlorella vulgaris harvest visible photons to drive cellular energy synthesis.",
    href: "#science",
    display: "Photons → ATP & NADPH",
    image:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1400&q=80",
    accent: "#10B981",
  },
  {
    name: "Carbon Fixation",
    tag: "02 · Pyrenoid Core",
    summary:
      "RuBisCO enzymes concentrated inside the pyrenoid assimilate dissolved inorganic carbon from aerated water.",
    href: "#how-it-works",
    display: "Dissolved CO₂ → Biomass",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1400&q=80",
    accent: "#059669",
  },
  {
    name: "Oxygen Generation",
    tag: "03 · Indoor Renewal",
    summary:
      "Oxygenic photosynthesis splits water molecules and releases fresh molecular oxygen back into the room.",
    href: "#product",
    display: "H₂O → Pure O₂",
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=80",
    accent: "#34D399",
  },
  {
    name: "Desktop Photobioreactor",
    tag: "04 · Algora Hardware",
    summary:
      "A 1 litre borosilicate vessel uniting living microalgae cultivation with HEPA and activated carbon filtration.",
    href: "#monitoring",
    display: "Explore Prototype 01",
    image:
      "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=1400&q=80",
    accent: "#176B43",
  },
];

function DeckCard({
  card,
  index,
  total,
  progress,
}: {
  card: AlgoraDeckCard;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / Math.max(1, total - 1);
  const center = index * step;

  const y = useTransform(
    progress,
    [center - step, center, center + step],
    [220, 0, -36]
  );
  const scale = useTransform(
    progress,
    [center - step, center, center + step],
    [0.92, 1, 0.9]
  );
  const rotateX = useTransform(
    progress,
    [center - step, center, center + step],
    [14, 0, -6]
  );
  const opacity = useTransform(
    progress,
    [center - step * 1.1, center - step * 0.25, center, center + step],
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
      <div className="relative h-[420px] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#D1FAE5] bg-white shadow-[0_24px_70px_rgba(6,35,23,0.14)] sm:h-[480px]">
        <img
          src={card.image}
          alt={card.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041810]/90 via-[#041810]/35 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-end sm:p-8">
          <div className="max-w-xl">
            <span className="font-mono caption-4 uppercase tracking-[0.18em] text-[#6EE7B7]">
              {card.tag}
            </span>
            <h3 className="heading-3 mt-2 text-white">{card.name}</h3>
            <p className="body-6 mt-2 text-[#D1FAE5]/90">{card.summary}</p>
          </div>

          <a
            href={card.href}
            className="button-sm inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-[#0F1F17] shadow-md transition-transform duration-300 hover:-translate-y-0.5 sm:self-end"
          >
            <span>{card.display ?? card.name}</span>
            <ArrowUpRight
              className="h-4 w-4"
              style={{ color: card.accent }}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

export function ScrollStackingCards({
  cards = ALGORA_DECK_CARDS,
  className,
}: {
  cards?: AlgoraDeckCard[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.5,
  });

  if (reduced) {
    return (
      <section className={cn("bg-white px-6 py-20 sm:px-10", className)}>
        <div className="mx-auto grid max-w-5xl gap-6">
          {cards.map((card) => (
            <div
              key={card.name}
              className="overflow-hidden rounded-3xl border border-[#D1FAE5] bg-white p-6 shadow-sm"
            >
              <span className="font-mono caption-4 text-[#059669]">
                {card.tag}
              </span>
              <h3 className="heading-4 mt-1 text-[#0F1F17]">{card.name}</h3>
              <p className="body-6 mt-2 text-[#3B5246]">{card.summary}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={containerRef}
        className={cn("relative bg-white px-6 sm:px-10", className)}
        style={{ height: `${cards.length * 75}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
          <div className="mb-8 text-center">
            <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
              Scroll Deck · Biological Architecture
            </span>
            <h2 className="heading-3 mt-2 text-[#0F1F17]">
              Four stages of living air renewal
            </h2>
          </div>

          <div className="relative h-[440px] w-full max-w-4xl sm:h-[500px]">
            {cards.map((card, i) => (
              <DeckCard
                key={card.name}
                card={card}
                index={i}
                total={cards.length}
                progress={smoothProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
