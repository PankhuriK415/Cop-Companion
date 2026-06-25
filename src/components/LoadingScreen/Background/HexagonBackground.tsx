import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface HexagonBackgroundProps {
  children?: React.ReactNode;
  /** If true, floating particles will animate */
  animateParticles?: boolean;
}

export const HexagonBackground: React.FC<HexagonBackgroundProps> = ({
  children,
  animateParticles = true,
}) => {
  const particles = useMemo(() => [
    { id: 1, left: "8%", size: 2, duration: 16, delay: 0 },
    { id: 2, left: "22%", size: 3, duration: 20, delay: 3 },
    { id: 3, left: "35%", size: 1.5, duration: 14, delay: 7 },
    { id: 4, left: "48%", size: 2, duration: 18, delay: 1 },
    { id: 5, left: "62%", size: 2.5, duration: 24, delay: 4 },
    { id: 6, left: "75%", size: 1.5, duration: 15, delay: 9 },
    { id: 7, left: "88%", size: 3, duration: 22, delay: 2 },
    { id: 8, left: "15%", size: 2, duration: 17, delay: 8 },
    { id: 9, left: "30%", size: 1.5, duration: 23, delay: 5 },
    { id: 10, left: "55%", size: 2.5, duration: 19, delay: 0 },
    { id: 11, left: "70%", size: 2, duration: 21, delay: 6 },
    { id: 12, left: "82%", size: 1.5, duration: 16, delay: 11 },
    { id: 13, left: "93%", size: 2, duration: 22, delay: 4 },
    { id: 14, left: "42%", size: 3, duration: 18, delay: 12 },
    { id: 15, left: "65%", size: 1.5, duration: 20, delay: 7 },
    { id: 16, left: "80%", size: 2, duration: 25, delay: 1 },
  ], []);

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-between select-none"
      style={{
        background: "linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%)",
      }}
    >
      {/* 1. Hexagonal Grid Overlay */}
      <div 
        className="absolute inset-0 bg-hex-grid bg-repeat pointer-events-none mix-blend-overlay"
        style={{ opacity: "var(--hex-opacity)" }}
      />

      {/* 2. Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* 3. Faint Floating Particles */}
      {animateParticles && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: p.left,
                width: p.size,
                height: p.size,
                backgroundColor: "var(--particle-color)",
                boxShadow: "0 0 8px var(--particle-color)",
              }}
              animate={{
                y: ["105vh", "-10vh"],
                x: [
                  "0px",
                  `${Math.sin(p.id) * 15}px`,
                  `${Math.sin(p.id + 2) * -15}px`,
                  "0px"
                ],
                opacity: [0, 0.45, 0.45, 0],
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
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between flex-grow">
        {children}
      </div>
    </div>
  );
};
