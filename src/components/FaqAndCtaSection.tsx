import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { FAQ_ITEMS, type FaqItem } from "@/data/algoraData";

interface FaqAndCtaSectionProps {
  onConnectClick: () => void;
}

function FaqMarqueeRow({
  items,
  direction = "left",
}: {
  items: FaqItem[];
  direction?: "left" | "right";
}) {
  const loopItems = [...items, ...items];
  return (
    <div className="faq-marquee-row relative flex w-full overflow-hidden py-2">
      <div
        className={`flex w-max shrink-0 gap-5 ${
          direction === "left" ? "animate-faq-left" : "animate-faq-right"
        }`}
      >
        {loopItems.map((item, idx) => (
          <article
            key={`${item.question}-${idx}`}
            className="w-[320px] shrink-0 rounded-2xl border border-[#D1FAE5] bg-white p-6 shadow-[0_10px_32px_rgba(23,107,67,0.05)] transition-colors duration-300 hover:border-[#10B981] sm:w-[380px]"
          >
            <h3 className="title-2 text-[#0F1F17]">{item.question}</h3>
            <p className="body-6 mt-3 leading-relaxed text-[#3B5246]">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function FaqAndCtaSection({ onConnectClick }: FaqAndCtaSectionProps) {
  const row1 = FAQ_ITEMS.slice(0, 3);
  const row2 = FAQ_ITEMS.slice(2, 5);
  const row3 = [FAQ_ITEMS[4], FAQ_ITEMS[5], FAQ_ITEMS[0]];

  return (
    <>
      {/* Scrolling Marquee FAQ Section */}
      <section
        id="faq"
        className="relative overflow-hidden bg-gradient-to-b from-white via-[#F8FAF7] to-white py-24 md:py-28"
      >
        <div className="mx-auto mb-12 max-w-7xl px-6 sm:px-10">
          <span className="caption-3 uppercase tracking-[0.18em] text-[#059669]">
            Questions
          </span>
          <h2 className="heading-3 mt-3 text-[#0F1F17]">
            Scientific and technical details
          </h2>
        </div>

        <div className="relative">
          {/* Soft left/right edge fades */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32"
          />

          <div className="flex flex-col gap-3">
            <FaqMarqueeRow items={row1} direction="left" />
            <FaqMarqueeRow items={row2} direction="right" />
            <FaqMarqueeRow items={row3} direction="left" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-[#10B981]/20 bg-[#062317] px-6 py-24 text-white sm:px-10 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="heading-1 mx-auto max-w-[680px] bg-gradient-to-r from-white via-[#D1FAE5] to-[#4ADE80] bg-clip-text text-transparent">
              Let&apos;s grow a better atmosphere.
            </h2>
            <p className="body-3 mx-auto mt-6 max-w-xl text-[#A7F3D0]/85">
              Partner with Algora to explore microalgae photobioreactors,
              environmental research collaborations, and early architectural
              pilots.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onConnectClick}
                className="button-md inline-flex items-center gap-2 rounded-full bg-[#10B981] px-6 py-3 text-[#041810] shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all duration-300 ease-algora hover:bg-[#34D399] active:scale-[0.98]"
              >
                <span>Connect with Algora</span>
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
              <a
                href="#how-it-works"
                className="button-md inline-flex items-center gap-2 rounded-full border border-[#10B981]/40 bg-white/5 px-6 py-3 text-white transition-all duration-300 ease-algora hover:bg-white/10 active:scale-[0.98]"
              >
                <span>Explore our technology</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="border-t border-[#E4EAE5] bg-white px-6 py-12 sm:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <svg
              width="22"
              height="22"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                stroke="#176B43"
                strokeWidth="2"
                fill="#F8FAF7"
              />
              <path
                d="M16 6.5C11.2 6.5 7.5 10.5 7.5 15.8C7.5 21.1 11.4 25.5 16.5 25.5C19.8 25.5 22.6 23.6 23.8 20.8C20.2 21.8 16.5 19.6 16.5 15.8C16.5 12 19.5 9.2 22.8 10.2C21.3 7.9 18.8 6.5 16 6.5Z"
                fill="#176B43"
              />
              <circle cx="13.5" cy="16.5" r="2.2" fill="#35A66A" />
            </svg>
            <span className="title-3 font-semibold tracking-wider text-[#171C19]">
              ALGORA
            </span>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-6">
            <a href="#vision" className="body-5 text-[#777F79] hover:text-[#171C19]">
              About
            </a>
            <a href="#science" className="body-5 text-[#777F79] hover:text-[#171C19]">
              Research
            </a>
            <button
              type="button"
              onClick={onConnectClick}
              className="body-5 text-[#777F79] hover:text-[#171C19]"
            >
              Contact
            </button>
            <a href="#faq" className="body-5 text-[#777F79] hover:text-[#171C19]">
              Privacy policy
            </a>
            <a href="#faq" className="body-5 text-[#777F79] hover:text-[#171C19]">
              Terms
            </a>
          </nav>

          <div className="flex items-center gap-4 caption-4 text-[#777F79]">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#176B43]"
            >
              LinkedIn
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#176B43]"
            >
              X
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
