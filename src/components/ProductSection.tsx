import { useState } from "react";
import { motion } from "motion/react";
import { Stack, ArrowsOutLineVertical } from "@phosphor-icons/react";
import { PhotobioreactorCanvas } from "@/components/three/PhotobioreactorCanvas";
import { REACTOR_COMPONENTS, type ReactorComponent } from "@/data/algoraData";
import { cn } from "@/lib/utils";

export function ProductSection() {
  const [exploded, setExploded] = useState(false);
  const [selectedId, setSelectedId] = useState<ReactorComponent["id"]>("chamber");

  return (
    <section id="product" className="bg-white px-6 py-24 sm:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-[680px]">
          <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
            Introducing Algora
          </span>
          <h2 className="heading-2 mt-4 text-[#0F1F17]">
            A living photobioreactor for architectural interiors.
          </h2>
          <p className="body-3 mt-5 text-[#3B5246]">
            Designed around a compact 1 litre borosilicate algae chamber,
            concealed circulation hardware, and an integrated air filtration
            stage.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="relative h-[480px] rounded-3xl border border-[#E4EAE5] bg-gradient-to-b from-[#F1F3F5] to-[#E5E8EC] shadow-[0_20px_50px_rgba(15,31,23,0.06)] sm:h-[580px] lg:col-span-7">
            {/* Top-left hint */}
            <div className="pointer-events-none absolute left-5 top-5 z-10 hidden rounded-full border border-[#D1FAE5] bg-white/90 px-3.5 py-1.5 caption-4 text-[#0F1F17] backdrop-blur sm:block">
              Click any module · Drag to rotate
            </div>

            {/* Top-right Implode / Explode Segmented Control */}
            <div
              role="group"
              aria-label="Photobioreactor assembly view"
              className="absolute right-4 top-4 z-10 inline-flex rounded-full border border-[#D1FAE5] bg-white/90 p-1 shadow-sm backdrop-blur sm:right-5 sm:top-5"
            >
              <button
                type="button"
                onClick={() => setExploded(false)}
                aria-pressed={!exploded}
                className={cn(
                  "button-xsm inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all duration-300 ease-algora",
                  !exploded
                    ? "bg-[#176B43] text-white shadow-sm"
                    : "text-[#3B5246] hover:text-[#0F1F17]"
                )}
              >
                <Stack size={14} weight="bold" aria-hidden="true" />
                <span>Implode</span>
              </button>
              <button
                type="button"
                onClick={() => setExploded(true)}
                aria-pressed={exploded}
                className={cn(
                  "button-xsm inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all duration-300 ease-algora",
                  exploded
                    ? "bg-[#176B43] text-white shadow-sm"
                    : "text-[#3B5246] hover:text-[#0F1F17]"
                )}
              >
                <ArrowsOutLineVertical size={14} weight="bold" aria-hidden="true" />
                <span>Explode</span>
              </button>
            </div>

            <PhotobioreactorCanvas
              exploded={exploded}
              selectedId={selectedId}
              onSelectComponent={setSelectedId}
            />
          </div>

          <div className="flex flex-col gap-3 lg:col-span-5">
            {REACTOR_COMPONENTS.map((comp) => {
              const active = comp.id === selectedId;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => setSelectedId(comp.id)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-all duration-300 ease-algora",
                    active
                      ? "border-[#059669] bg-[#ECFDF5] shadow-[0_8px_24px_rgba(5,150,105,0.1)]"
                      : "border-[#D1FAE5] bg-white hover:border-[#10B981]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="title-3 text-[#0F1F17]">{comp.name}</span>
                    <span className="caption-4 rounded-full border border-[#A7F3D0] bg-white px-2.5 py-0.5 text-[#059669]">
                      {comp.tag}
                    </span>
                  </div>
                  {active && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="body-6 mt-2.5 text-[#3B5246]"
                    >
                      {comp.description}
                    </motion.p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
