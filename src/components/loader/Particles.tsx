import React, { useMemo } from "react";
import { motion } from "framer-motion";

export const Particles: React.FC = () => {
  const particlesList = useMemo(
    () => [
      { id: 1, left: "8%", size: 1.5, duration: 22, delay: 0 },
      { id: 2, left: "20%", size: 2.2, duration: 28, delay: 2 },
      { id: 3, left: "34%", size: 1.2, duration: 24, delay: 5 },
      { id: 4, left: "47%", size: 2.5, duration: 32, delay: 1 },
      { id: 5, left: "60%", size: 1.5, duration: 26, delay: 4 },
      { id: 6, left: "72%", size: 2.0, duration: 30, delay: 8 },
      { id: 7, left: "85%", size: 1.2, duration: 23, delay: 3 },
      { id: 8, left: "94%", size: 2.5, duration: 34, delay: 6 },
      { id: 9, left: "14%", size: 1.5, duration: 25, delay: 10 },
      { id: 10, left: "28%", size: 2.0, duration: 29, delay: 7 },
      { id: 11, left: "53%", size: 1.2, duration: 27, delay: 0 },
      { id: 12, left: "66%", size: 2.2, duration: 33, delay: 9 },
      { id: 13, left: "80%", size: 1.5, duration: 26, delay: 11 },
      { id: 14, left: "90%", size: 1.8, duration: 31, delay: 5 },
    ],
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particlesList.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: "rgba(0, 240, 255, 0.15)", // Very soft cyan
            boxShadow: "0 0 4px rgba(0, 240, 255, 0.08)", // Negligible glow
          }}
          animate={{
            y: ["105vh", "-10vh"],
            x: [
              "0px",
              `${Math.sin(p.id) * 10}px`,
              `${Math.sin(p.id + 2) * -10}px`,
              "0px",
            ],
            opacity: [0, 0.3, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};
export default Particles;
