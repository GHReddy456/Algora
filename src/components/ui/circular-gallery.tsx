import React, { useState, useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by: string;
  };
}

export const ALGORA_GALLERY_ITEMS: GalleryItem[] = [
  {
    common: "Chlorella vulgaris",
    binomial: "Freshwater green microalga",
    photo: {
      url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=900&q=80",
      text: "Microalgae culture under laboratory illumination",
      by: "Algora Biology",
    },
  },
  {
    common: "Photobioreactor Vessel",
    binomial: "1L Borosilicate chamber",
    photo: {
      url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=900&q=80",
      text: "Transparent laboratory vessel with living culture",
      by: "Algora Hardware",
    },
  },
  {
    common: "Chlorophyll Synthesis",
    binomial: "Light harvesting complex",
    photo: {
      url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=900&q=80",
      text: "Deep botanical chlorophyll structure",
      by: "Algora Research",
    },
  },
  {
    common: "Optical Grow Array",
    binomial: "Full spectrum LED crown",
    photo: {
      url: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=900&q=80",
      text: "Precision optical sensor and lighting module",
      by: "Algora Optics",
    },
  },
  {
    common: "Atmospheric Exchange",
    binomial: "CO₂ fixation & O₂ release",
    photo: {
      url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=900&q=80",
      text: "Microscopic cellular gas exchange",
      by: "Algora Science",
    },
  },
  {
    common: "Urban Bio-Infrastructure",
    binomial: "Scalable modular panels",
    photo: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
      text: "Planetary atmospheric renewal network",
      by: "Algora Vision",
    },
  },
];

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items?: GalleryItem[];
  radius?: number;
  autoRotateSpeed?: number;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    {
      items = ALGORA_GALLERY_ITEMS,
      className,
      radius = 480,
      autoRotateSpeed = 0.04,
      ...props
    },
    ref
  ) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        setRotation(scrollProgress * 360);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      const reduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const autoRotate = () => {
        if (!isScrolling) {
          setRotation((prev) => prev + autoRotateSpeed);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Algora 3D Research Gallery"
        className={cn(
          "relative flex h-full w-full items-center justify-center",
          className
        )}
        style={{ perspective: "2000px" }}
        {...props}
      >
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle
            );
            const opacity = Math.max(0.28, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.common}
                role="group"
                aria-label={item.common}
                className="absolute h-[360px] w-[260px] sm:h-[380px] sm:w-[280px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-140px",
                  marginTop: "-190px",
                  opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-2xl border border-[#D1FAE5] bg-white shadow-[0_20px_50px_rgba(6,35,23,0.14)]">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: item.photo.pos || "center" }}
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#041810]/90 via-[#041810]/45 to-transparent p-5 text-white">
                    <h3 className="title-2 text-white">{item.common}</h3>
                    <p className="caption-4 mt-0.5 text-[#A7F3D0]">
                      {item.binomial}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
