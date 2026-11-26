import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Sun, ArrowsClockwise, Wind } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight";
import { Velaris } from "@/components/ui/velaris";
import { SCIENCE_CONCEPTS } from "@/data/algoraData";

const ICONS = [Sun, ArrowsClockwise, Wind];

export function ScienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const railWidth = useTransform(scrollYProgress, [0.15, 0.75], ["0%", "100%"]);
  const yOffsets = [
    useTransform(scrollYProgress, [0, 1], [36, -24]),
    useTransform(scrollYProgress, [0, 1], [54, -36]),
    useTransform(scrollYProgress, [0, 1], [72, -48]),
  ];

  return (
    <section
      id="science"
      ref={sectionRef}
      className="bg-white px-6 py-24 sm:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 max-w-[680px]"
        >
          <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
            The science of microalgae
          </span>
          <h2 className="heading-2 mt-4 text-[#0F1F17]">
            Nature engineered this long before we did.
          </h2>
          <p className="body-3 mt-5 text-[#3B5246]">
            Microalgae operate as self sustaining photosynthetic reactors,
            coupling light capture with carbon assimilation and oxygen release.
          </p>
        </motion.div>

        <div className="mb-12 h-1 w-full overflow-hidden rounded-full bg-[#ECFDF5]">
          <motion.div
            style={{ width: railWidth }}
            className="h-full rounded-full bg-gradient-to-r from-[#059669] to-[#4ADE80]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SCIENCE_CONCEPTS.map((concept, idx) => {
            const Icon = ICONS[idx];
            return (
              <motion.div key={concept.index} style={{ y: yOffsets[idx] }}>
                <Card className="group relative flex h-full flex-col justify-between overflow-hidden border-[#D1FAE5] bg-white p-8 transition-all duration-300 ease-algora hover:border-[#10B981] hover:shadow-[0_16px_44px_rgba(5,150,105,0.09)]">
                  <Spotlight size={280} />

                  <div className="relative z-10">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="font-mono caption-3 text-[#059669]">
                        {concept.index}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]">
                        <Icon size={22} weight="duotone" aria-hidden="true" />
                      </div>
                    </div>

                    <h3 className="heading-5 text-[#0F1F17]">{concept.title}</h3>
                    <p className="caption-1 mt-1 text-[#059669]">
                      {concept.subtitle}
                    </p>
                    <p className="body-6 mt-4 text-[#3B5246]">
                      {concept.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 overflow-hidden rounded-xl border border-[#A7F3D0]">
                    <Velaris
                      height="68px"
                      bg="#ECFDF5"
                      colors={["#A7F3D0", "#6EE7B7", "#34D399", "#ECFDF5"]}
                      speed={1.2 + idx * 0.2}
                      grain={0.1}
                    >
                      <div className="flex h-full items-center justify-center px-4 text-center">
                        <span className="font-mono caption-4 font-semibold text-[#064E3B]">
                          {concept.mechanism}
                        </span>
                      </div>
                    </Velaris>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
