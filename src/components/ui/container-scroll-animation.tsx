import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "motion/react";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.82, 1] : [1.06, 1]);

  const rotate = useTransform(scrollYProgress, [0.1, 0.55], [22, 0]);
  const scale = useTransform(scrollYProgress, [0.1, 0.55], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0.1, 0.55], [20, -40]);

  return (
    <div
      className="relative flex min-h-[46rem] items-center justify-center px-4 py-12 md:min-h-[56rem] md:px-10 md:py-20"
      ref={containerRef}
    >
      <div
        className="relative w-full py-6 md:py-16"
        style={{ perspective: "1100px" }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} translate={translate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const ScrollCard = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 20px 60px rgba(6, 35, 23, 0.14), 0 4px 16px rgba(5, 150, 105, 0.08)",
      }}
      className="mx-auto mt-6 w-full max-w-6xl rounded-[28px] border-2 border-[#A7F3D0] bg-[#062317] p-2.5 md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-[20px] bg-white">
        {children}
      </div>
    </motion.div>
  );
};
