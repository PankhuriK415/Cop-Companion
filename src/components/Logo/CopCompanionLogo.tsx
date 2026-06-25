import React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface CopCompanionLogoProps {
  /** Size in pixels (width and height will scale proportionally) */
  size?: number;
  /** Custom CSS classes for positioning or layout overrides */
  className?: string;
  /** Control whether to play the intro & loop animations */
  animate?: boolean;
  /** Toggle glow effects (for performance optimization) */
  glow?: boolean;
}

export const CopCompanionLogo: React.FC<CopCompanionLogoProps> = ({
  size = 180,
  className = "",
  animate = true,
  glow = true,
}) => {
  // SVG ViewBox is 0 0 200 240
  const shieldPath =
    "M 100 35 C 135 35, 170 50, 180 60 C 180 120, 165 175, 100 215 C 35 175, 20 120, 20 60 C 30 50, 65 35, 100 35 Z";

  const cPath =
    "M 124 95 H 68 C 58 95, 56 97, 56 107 V 143 C 56 153, 58 155, 68 155 H 94";

  const pPath =
    "M 108 122 V 178 M 108 122 H 134 C 140 122, 144 126, 144 132 V 138 C 144 144, 140 148, 134 148 H 108";

  const containerVariants: Variants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.015, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const shieldVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: "easeInOut" },
        opacity: { duration: 0.1 },
      },
    },
  };

  const monogramVariants: Variants = {
    hidden: { opacity: 0, scale: 0.94 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const scanVariants: Variants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      opacity: 1,
      y: [-80, 240],
      transition: {
        y: {
          delay: 1.4,
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 0.8,
        },
        opacity: {
          delay: 1.4,
          duration: 0.2,
        },
      },
    },
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 1.2 }}
      variants={animate ? containerVariants : undefined}
      initial="initial"
      animate={animate ? "pulse" : undefined}
    >
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="shield-clip-path">
            <path d={shieldPath} />
          </clipPath>

          <linearGradient id="shield-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-custom)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-custom)" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="scan-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-custom)" stopOpacity="0" />
            <stop offset="85%" stopColor="var(--accent-custom)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="var(--accent-custom)" stopOpacity="0.25" />
          </linearGradient>

          <filter id="shield-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="logo-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {glow && (
          <motion.path
            d={shieldPath}
            stroke="var(--accent-custom)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
            style={{ filter: "url(#shield-glow)" }}
            variants={animate ? shieldVariants : undefined}
            initial={animate ? "hidden" : "visible"}
            animate={animate ? "visible" : "visible"}
          />
        )}

        <motion.path
          d={shieldPath}
          stroke="url(#shield-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={animate ? shieldVariants : undefined}
          initial={animate ? "hidden" : "visible"}
          animate={animate ? "visible" : "visible"}
        />

        <motion.g
          variants={animate ? monogramVariants : undefined}
          initial={animate ? "hidden" : "visible"}
          animate={animate ? "visible" : "visible"}
          style={glow ? { filter: "url(#logo-glow)" } : {}}
        >
          <path
            d={cPath}
            stroke="var(--accent-custom)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={pPath}
            stroke="var(--accent-custom)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>

        {animate && (
          <g clipPath="url(#shield-clip-path)">
            <motion.g
              variants={scanVariants}
              initial="hidden"
              animate="visible"
              className="pointer-events-none"
            >
              <rect
                x="0"
                y="0"
                width="200"
                height="80"
                fill="url(#scan-gradient)"
              />
              <line
                x1="0"
                y1="80"
                x2="200"
                y2="80"
                stroke="var(--accent-custom)"
                strokeWidth="1.5"
                strokeOpacity="0.8"
                style={glow ? { filter: "drop-shadow(0 0 4px var(--accent-custom))" } : {}}
              />
            </motion.g>
          </g>
        )}
      </svg>
    </motion.div>
  );
};
