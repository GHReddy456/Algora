import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Buildings, SquaresFour, TreeStructure, GlobeHemisphereWest } from "@phosphor-icons/react";
import { Velaris } from "@/components/ui/velaris";

const VISION_PILLARS = [
  {
    icon: Buildings,
    title: "Indoor environmental technology",
    description:
      "Compact desktop and room scale living systems designed for homes, studios, and laboratories.",
  },
  {
    icon: SquaresFour,
    title: "Modular photobioreactors",
    description:
      "Interlocking glass and aluminium panels engineered to integrate cleanly into architectural partitions.",
  },
  {
    icon: TreeStructure,
    title: "Sustainable urban infrastructure",
    description:
      "Distributed biological air renewal nodes for transit hubs, public atriums, and civic spaces.",
  },
  {
    icon: GlobeHemisphereWest,
    title: "Larger algae based installations",
    description:
      "Scalable cultivation architectures connecting urban environments with natural photosynthetic cycles.",
  },
];

export function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const globeScale = useTransform(scrollYProgress, [0, 0.6], [0.92, 1.04]);

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="relative overflow-hidden border-t border-[#D1FAE5] bg-gradient-to-b from-[#ECFDF5]/70 to-white px-6 py-24 sm:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
              Our vision
            </span>
            <h2 className="heading-2 mt-4 max-w-[680px] text-[#0F1F17]">
              A future where technology works with nature.
            </h2>
            <p className="body-3 mt-5 max-w-[520px] text-[#3B5246]">
              Algora is building scalable microalgae systems that bridge
              microscopic biology and architectural design, extending from a
              single desktop unit to the built environment.
            </p>
          </motion.div>

          <motion.div
            style={{ scale: globeScale }}
            className="relative h-[260px] overflow-hidden rounded-3xl border border-[#A7F3D0] bg-white shadow-[0_16px_48px_rgba(5,150,105,0.08)] lg:col-span-6"
          >
            <Velaris
              height="100%"
              bg="#FFFFFF"
              colors={["#ECFDF5", "#A7F3D0", "#6EE7B7", "#FFFFFF"]}
              speed={0.9}
              grain={0.1}
            >
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <GlobeHemisphereWest
                  size={44}
                  weight="thin"
                  className="text-[#059669]"
                  aria-hidden="true"
                />
                <p className="title-2 mt-4 max-w-sm text-[#0F1F17]">
                  Planetary photosynthesis, scaled for modern architecture
                </p>
              </div>
            </Velaris>
          </motion.div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VISION_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-2xl border border-[#D1FAE5] bg-white p-6 shadow-[0_8px_24px_rgba(5,150,105,0.04)]"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]">
                  <Icon size={20} weight="duotone" aria-hidden="true" />
                </div>
                <h3 className="title-3 text-[#0F1F17]">{pillar.title}</h3>
                <p className="body-6 mt-2 text-[#3B5246]">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
