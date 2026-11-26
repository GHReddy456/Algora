import { useState } from "react";
import {
  Thermometer,
  DropHalfBottom,
  Sun,
  Pulse,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function MonitoringSection() {
  const [lightingOn, setLightingOn] = useState(true);
  const [pumpActive, setPumpActive] = useState(true);

  return (
    <section id="monitoring" className="bg-white py-12">
      <ContainerScroll
        titleComponent={
          <div className="mx-auto max-w-3xl px-4">
            <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
              Intelligent monitoring
            </span>
            <h2 className="heading-2 mt-3 text-[#0F1F17]">
              Calm visibility into a living system.
            </h2>
            <p className="body-3 mx-auto mt-4 max-w-xl text-[#3B5246]">
              An integrated sensor suite keeps track of culture health and room
              conditions without noisy notifications.
            </p>
          </div>
        }
      >
        <Card className="border-0 bg-[#F8FAF7] p-5 shadow-none sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#D1FAE5] pb-5">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
              <span className="title-3 text-[#0F1F17]">
                Algora Studio Unit · Prototype 01
              </span>
            </div>
            <span className="font-mono caption-4 rounded-full border border-[#A7F3D0] bg-white px-3 py-1 text-[#059669]">
              Demo telemetry · Simulated preview
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#D1FAE5] bg-white p-5">
              <div className="flex items-center justify-between text-[#3B5246]">
                <span className="caption-1">Culture temperature</span>
                <Thermometer size={18} className="text-[#059669]" aria-hidden="true" />
              </div>
              <p className="font-mono heading-4 mt-4 text-[#0F1F17]">24.3 °C</p>
              <p className="caption-5 mt-1 text-[#777F79]">
                Demonstration reading · Optimal range
              </p>
            </div>

            <div className="rounded-2xl border border-[#D1FAE5] bg-white p-5">
              <div className="flex items-center justify-between text-[#3B5246]">
                <span className="caption-1">Ambient temperature</span>
                <Thermometer size={18} className="text-[#777F79]" aria-hidden="true" />
              </div>
              <p className="font-mono heading-4 mt-4 text-[#0F1F17]">22.8 °C</p>
              <p className="caption-5 mt-1 text-[#777F79]">
                Demonstration reading · Room sensor
              </p>
            </div>

            <div className="rounded-2xl border border-[#D1FAE5] bg-white p-5">
              <div className="flex items-center justify-between text-[#3B5246]">
                <span className="caption-1">Relative humidity</span>
                <DropHalfBottom size={18} className="text-[#059669]" aria-hidden="true" />
              </div>
              <p className="font-mono heading-4 mt-4 text-[#0F1F17]">51.4 %</p>
              <p className="caption-5 mt-1 text-[#777F79]">
                Demonstration reading · Balanced indoor air
              </p>
            </div>

            <div className="rounded-2xl border border-[#D1FAE5] bg-white p-5">
              <div className="flex items-center justify-between text-[#3B5246]">
                <span className="caption-1">System status</span>
                <Pulse size={18} className="text-[#10B981]" aria-hidden="true" />
              </div>
              <p className="title-1 mt-4 text-[#059669]">Nominal</p>
              <p className="caption-5 mt-1 text-[#777F79]">
                All internal circuits operating normally
              </p>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#D1FAE5] bg-white p-5">
              <div className="flex items-center justify-between text-[#3B5246]">
                <span className="caption-1">Lighting status</span>
                <Sun size={18} className="text-[#059669]" aria-hidden="true" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="title-1 text-[#0F1F17]">
                  {lightingOn ? "Photoperiod active" : "Standby"}
                </span>
                <button
                  type="button"
                  onClick={() => setLightingOn((v) => !v)}
                  aria-pressed={lightingOn}
                  className={`button-xsm rounded-full px-3 py-1 transition-colors ${
                    lightingOn
                      ? "bg-[#059669] text-white"
                      : "border border-[#D1FAE5] bg-[#F8FAF7] text-[#3B5246]"
                  }`}
                >
                  {lightingOn ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#D1FAE5] bg-white p-5">
              <div className="flex items-center justify-between text-[#3B5246]">
                <span className="caption-1">Pump status</span>
                <ArrowsClockwise size={18} className="text-[#059669]" aria-hidden="true" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="title-1 text-[#0F1F17]">
                  {pumpActive ? "Circulating" : "Paused"}
                </span>
                <button
                  type="button"
                  onClick={() => setPumpActive((v) => !v)}
                  aria-pressed={pumpActive}
                  className={`button-xsm rounded-full px-3 py-1 transition-colors ${
                    pumpActive
                      ? "bg-[#059669] text-white"
                      : "border border-[#D1FAE5] bg-[#F8FAF7] text-[#3B5246]"
                  }`}
                >
                  {pumpActive ? "Active" : "Paused"}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </ContainerScroll>
    </section>
  );
}
