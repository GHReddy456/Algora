import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Science", href: "#science" },
  { label: "Technology", href: "#how-it-works" },
  { label: "Our Product", href: "#product" },
  { label: "Research", href: "#monitoring" },
  { label: "About", href: "#vision" },
];

interface NavbarProps {
  onConnectClick: () => void;
}

export function Navbar({ onConnectClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 36);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean
    ) as Element[];
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -45% 0px" }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[#176B43] focus:px-4 focus:py-2 focus:text-white button-sm"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <nav
          aria-label="Primary navigation"
          className={cn(
            "pointer-events-auto flex items-center justify-between gap-6 transition-all duration-500 ease-algora",
            scrolled
              ? "mt-3 w-full max-w-5xl rounded-full border border-[#E4EAE5] bg-white/90 px-5 py-2.5 shadow-[0_8px_30px_rgba(23,28,25,0.06)] backdrop-blur-xl"
              : "w-full max-w-7xl bg-white/80 px-6 py-4 backdrop-blur-md sm:px-10"
          )}
        >
          <a
            href="#hero"
            className="flex items-center gap-2.5 text-[#171C19] transition-opacity duration-300 hover:opacity-80"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
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
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "title-4 rounded-full px-3 py-1.5 transition-colors duration-300 ease-algora",
                      activeSection === link.href || (!activeSection && link.href === "#science")
                        ? "bg-[#EBF5EE] text-[#176B43]"
                        : "text-[#4A5951] hover:text-[#171C19]"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onConnectClick}
              className="button-sm hidden items-center gap-1.5 rounded-full bg-[#059669] px-4 py-2 text-white shadow-[0_6px_18px_rgba(5,150,105,0.24)] transition-all duration-300 ease-algora hover:bg-[#047857] active:scale-[0.98] sm:inline-flex"
            >
              <span>Explore Algora</span>
              <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E4EAE5] bg-white text-[#171C19] transition-transform duration-300 ease-algora active:scale-[0.96] md:hidden"
            >
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -45, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {mobileOpen ? <X size={18} /> : <List size={18} />}
              </motion.span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-white/95 px-6 pb-10 pt-24 backdrop-blur-2xl md:hidden"
          >
            <nav aria-label="Mobile navigation">
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link, idx) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(idx * 0.06, 0.36),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="heading-4 block py-2 text-[#171C19] transition-colors hover:text-[#176B43]"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-[#E4EAE5] pt-6"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onConnectClick();
                }}
                className="button-md flex w-full items-center justify-center gap-2 rounded-full bg-[#176B43] px-4 py-3 text-white active:scale-[0.98]"
              >
                <span>Explore Algora</span>
                <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
