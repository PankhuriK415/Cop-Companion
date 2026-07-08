import React, { useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import type { Variants } from "framer-motion";

interface CopCompanionLogoProps {
  /** Size in pixels (width and height will scale proportionally) */
  size?: number;
  /** Custom CSS classes for positioning or layout overrides */
  className?: string;
  /** Control whether to play the intro & loop animations */
  animated?: boolean;
  /** Toggle glow effects (for performance optimization) */
  glow?: boolean;
  /** Signal that the loading has completed and the scan should stop at the end of its current loop */
  stopScan?: boolean;
  /** Callback fired when the scan finishes its sweep after stopScan is true */
  onScanIterationComplete?: () => void;
}

export const CopCompanionLogo: React.FC<CopCompanionLogoProps> = ({
  size,
  className = "",
  animated = true,
  glow = true,
  stopScan = false,
  onScanIterationComplete,
}) => {
  const shieldPath =
    "M 100 21 C 133 44, 166 55, 188 53 C 188 131, 177 204, 100 226 C 23 204, 12 131, 12 53 C 34 55, 67 44, 100 21 Z";

  // Symmetrical concentric letter "C"
  const outerCPath =
    "M 138 78 H 94 C 79 78, 66 91, 66 106 V 134 C 66 149, 79 162, 94 162 H 138";
  const innerCPath =
    "M 138 100 H 94 C 91 100, 88 103, 88 106 V 134 C 88 137, 91 140, 94 140 H 138";

  // Motion values for scan line y position and opacity
  const scanY = useMotionValue(-59);
  const scanOpacity = useMotionValue(0);

  // Motion values for final shield flash/glow opacity
  const finalGlowOpacity = useMotionValue(0);

  // Phase 1 & 2: Intro animation variants
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
    hidden: { opacity: 0, scale: 0.95 },
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

  // Phase 4: Idle soft glow pulse every 3 seconds (Only if not complete)
  const containerVariants: Variants = {
    initial: { scale: 1 },
    pulse: {
      scale: stopScan ? 1 : [1, 1.01, 1],
      transition: {
        duration: 3,
        repeat: stopScan ? 0 : Infinity,
        ease: "easeInOut",
        repeatDelay: 0.5,
      },
    },
  };
  // Use refs to avoid re-triggering completion callbacks when props change
  const onScanIterationCompleteRef = React.useRef(onScanIterationComplete);

  useEffect(() => {
    onScanIterationCompleteRef.current = onScanIterationComplete;
  }, [onScanIterationComplete]);

  // Phase 3: Control scan line sweep (Run exactly ONCE on mount)
  useEffect(() => {
    if (!animated) return;

    let isCancelled = false;

    const runScan = () => {
      if (isCancelled) return;

      // Start of a new scan
      scanY.set(-59);
      scanOpacity.set(0.85);

      const controls = animate(scanY, 226, {
        duration: 1.5,
        ease: "easeInOut",
        onComplete: () => {
          if (isCancelled) return;
          // Fade out scan line after single sweep
          animate(scanOpacity, 0, { duration: 0.3 });
        },
      });

      return () => controls.stop();
    };

    // Delay start until Shield draws (800ms) + C fades in (600ms)
    const delayTimer = setTimeout(() => {
      runScan();
    }, 1400);

    return () => {
      isCancelled = true;
      clearTimeout(delayTimer);
    };
  }, [animated, scanY, scanOpacity]);

  // Phase 4: Trigger final glow pulse and loading completion when stopScan becomes true
  useEffect(() => {
    if (!animated) return;

    if (stopScan) {
      // Trigger a single final pulse glow
      animate(finalGlowOpacity, [0, 0.9, 0], {
        duration: 0.6,
        ease: "easeInOut",
        onComplete: () => {
          if (onScanIterationCompleteRef.current) {
            onScanIterationCompleteRef.current();
          }
        }
      });
    }
  }, [stopScan, animated, finalGlowOpacity]);

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={size !== undefined ? { width: size, height: size * 1.2 } : undefined}
      variants={animated ? containerVariants : undefined}
      initial="initial"
      animate={animated ? "pulse" : undefined}
    >
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="shield-clip">
            <path d={shieldPath} />
          </clipPath>

          <linearGradient id="shield-stroke-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-custom)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-custom)" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="c-stroke-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" /> {/* bright cyan */}
            <stop offset="100%" stopColor="#0891b2" /> {/* deep cyan */}
          </linearGradient>

          <linearGradient id="scan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-custom)" stopOpacity="0" />
            <stop offset="70%" stopColor="var(--accent-custom)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--accent-custom)" stopOpacity="0.3" />
          </linearGradient>

          <filter id="shield-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="logo-glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>


        {/* 2. Soft Background Shield Glow (pulsing dynamically) */}
        {glow && (
          <motion.path
            d={shieldPath}
            stroke="var(--accent-custom)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
            style={{ filter: "url(#shield-glow-filter)" }}
            variants={animated ? shieldVariants : undefined}
            initial={animated ? "hidden" : "visible"}
            animate={animated ? "visible" : "visible"}
          />
        )}

        {/* 3. Main Shield Border */}
        <motion.path
          d={shieldPath}
          stroke="url(#shield-stroke-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={animated ? shieldVariants : undefined}
          initial={animated ? "hidden" : "visible"}
          animate={animated ? "visible" : "visible"}
        />

        {/* 4. Final Flash Shield Overlay (visible on completion) */}
        {glow && (
          <motion.path
            d={shieldPath}
            stroke="var(--accent-custom)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              filter: "url(#shield-glow-filter)",
              opacity: finalGlowOpacity,
            }}
          />
        )}

        {/* 5. Stylized Monogram "C" */}
        <motion.g
          variants={animated ? monogramVariants : undefined}
          initial={animated ? "hidden" : "visible"}
          animate={animated ? "visible" : "visible"}
          style={glow ? { filter: "url(#logo-glow-filter)" } : {}}
        >
          {/* Outer C */}
          <path
            d={outerCPath}
            stroke="url(#c-stroke-grad)"
            strokeWidth="11"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />

          {/* Inner C */}
          <path
            d={innerCPath}
            stroke="url(#c-stroke-grad)"
            strokeWidth="11"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
        </motion.g>

        {/* 6. Scan Line and Trails (clipped within shield) */}
        {animated && (
          <g clipPath="url(#shield-clip)">
            <motion.g
              style={{ y: scanY, opacity: scanOpacity }}
              className="pointer-events-none"
            >
              {/* Subtle Trail Rect */}
              <rect
                x="0"
                y="0"
                width="200"
                height="80"
                fill="url(#scan-grad)"
              />
              {/* Scan Front Line */}
              <line
                x1="0"
                y1="80"
                x2="200"
                y2="80"
                stroke="var(--accent-custom)"
                strokeWidth="1.8"
                style={glow ? { filter: "drop-shadow(0 0 5px var(--accent-custom))" } : {}}
              />
            </motion.g>
          </g>
        )}
      </svg>
    </motion.div>
  );
};
export default CopCompanionLogo;
