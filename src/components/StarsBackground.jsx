import { motion } from "framer-motion";
import { useMemo } from "react";

const generateStars = (count, sizeRange, opacity, twinkle = false) => {
  return Array.from({ length: count }).map((_, index) => {
    const size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;

    return (
      <motion.div
        key={index}
        className="absolute rounded-full bg-white"
        style={{
          width: size,
          height: size,
          top: `${top}%`,
          left: `${left}%`,
          opacity,
        }}
        animate={twinkle ? { opacity: [opacity, 0.2, opacity] } : false}
        transition={twinkle ? {
          duration,
          delay,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        } : undefined}
      />
    );
  });
};

export default function StarsBackground() {
  const stars = useMemo(() => (
    <>
      {/* Distant background stars */}
      {generateStars(30, [1, 1.5], 0.1)}

      {/* Mid-level twinkling stars */}
      {generateStars(20, [1.5, 2.5], 0.3, true)}

      {/* Occasional bright flickering stars */}
      {generateStars(8, [2.5, 4], 0.7, true)}
    </>
  ), []);

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {stars}
    </div>
  );
}
