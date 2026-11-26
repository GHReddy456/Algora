import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "motion/react";
import { Wind, Drop, Cpu } from "@phosphor-icons/react";
import { ARCHITECTURE_STEPS } from "@/data/algoraData";

const CIRCUIT_META = {
  air: {
    label: "Air purification pathway",
    icon: Wind,
    badgeClass: "bg-[#F8FAF7] text-[#0F1F17] border-[#D1FAE5]",
  },
  algae: {
    label: "Algae cultivation circuit",
    icon: Drop,
    badgeClass: "bg-[#ECFDF5] text-[#059669] border-[#10B981]/35",
  },
  digital: {
    label: "Monitoring and control",
    icon: Cpu,
    badgeClass: "bg-[#F8FAF7] text-[#059669] border-[#D1FAE5]",
  },
};

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 35%"],
  });
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        ARCHITECTURE_STEPS.length - 1,
        Math.max(0, Math.floor(v * ARCHITECTURE_STEPS.length))
      );
      setActiveStep(idx);
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="border-t border-[#D1FAE5] bg-[#ECFDF5]/45 px-6 py-24 sm:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-[680px]"
        >
          <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
            System architecture
          </span>
          <h2 className="heading-2 mt-4 text-[#0F1F17]">
            Two coordinated pathways in one quiet cylinder.
          </h2>
          <p className="body-3 mt-5 text-[#3B5246]">
            Algora separates mechanical air filtration from biological
            cultivation while uniting both through continuous sensor telemetry.
          </p>
        </motion.div>

        <div className="mb-10 flex flex-wrap gap-3">
          {Object.entries(CIRCUIT_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <div
                key={key}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 caption-4 ${meta.badgeClass}`}
              >
                <Icon size={15} weight="duotone" aria-hidden="true" />
                <span>{meta.label}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ARCHITECTURE_STEPS.map((item, idx) => {
            const meta = CIRCUIT_META[item.circuit];
            const Icon = meta.icon;
            const lit = idx <= activeStep;
            return (
              <motion.div
                key={item.step}
                animate={{
                  borderColor: lit ? "#10B981" : "#D1FAE5",
                  y: lit ? -4 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-[0_8px_28px_rgba(5,150,105,0.05)]"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="font-mono caption-3 text-[#059669]">
                      {item.step}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 caption-5 ${meta.badgeClass}`}
                    >
                      <Icon size={13} aria-hidden="true" />
                      <span>{meta.label}</span>
                    </span>
                  </div>
                  <h3 className="title-2 text-[#0F1F17]">{item.title}</h3>
                  <p className="body-6 mt-2 text-[#3B5246]">{item.detail}</p>
                </div>

                <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-[#ECFDF5]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#059669] to-[#4ADE80] transition-all duration-500 ease-algora"
                    style={{ width: lit ? "100%" : "18%" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
