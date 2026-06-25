import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CopCompanionLogo } from "../Logo/CopCompanionLogo";
import { HexagonBackground } from "./Background/HexagonBackground";
import { ProgressBar } from "./ProgressBar/ProgressBar";
import { StatusText } from "./StatusText/StatusText";
import { Timeline } from "./Timeline/Timeline";
import { Lock } from "lucide-react";

interface LoadingScreenProps {
  /** Callback fired once the loading and final transition animations finish */
  onLoadingComplete?: () => void;
  /** Initial loading title passed from auth context */
  title?: string;
  /** Initial loading subtitle passed from auth context */
  subtitle?: string;
  /** Lifted progress state */
  progress?: number;
  /** Lifted setProgress state */
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onLoadingComplete,
  title,
  subtitle,
  progress: propProgress,
  setProgress: propSetProgress
}) => {
  const [localProgress, setLocalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const progress = propProgress !== undefined ? propProgress : localProgress;

  const setProgress = (value: number | ((prev: number) => number)) => {
    const updateValue = (prev: number) => {
      const nextVal = typeof value === "function" ? value(prev) : value;
      return Math.max(prev, nextVal); // Progress can never decrease!
    };

    if (propSetProgress) {
      propSetProgress(updateValue);
    } else {
      setLocalProgress(updateValue);
    }
  };

  // Progress driver (reaches 100% in ~6.5 seconds)
  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
      return;
    }

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = prefersReducedMotion ? 3500 : 6500;
    
    // Adjust start time to resume progress exactly from the current value
    const adjustedStartTime = startTime - (progress / 100) * duration;

    const tick = () => {
      const elapsed = Date.now() - adjustedStartTime;
      const rawProgress = (elapsed / duration) * 100;

      if (rawProgress >= 100) {
        setProgress(100);
        setIsComplete(true);
      } else {
        const organicModifier = Math.sin((rawProgress / 100) * Math.PI - Math.PI / 2) * 5;
        const currentProgress = rawProgress + organicModifier + 5;
        setProgress(currentProgress);
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [prefersReducedMotion, isComplete]);

  useEffect(() => {
    if (isComplete) {
      const transitionTimer = setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 700);
      return () => clearTimeout(transitionTimer);
    }
  }, [isComplete, onLoadingComplete]);

  // Status progression mapping
  const getStatusMessage = (p: number): string => {
    if (p < 15) return subtitle || "Initializing Secure Environment...";
    if (p < 32) return "Verifying User Credentials...";
    if (p < 48) return "Connecting to Encrypted Database...";
    if (p < 65) return "Loading Case Records...";
    if (p < 82) return "Preparing Dashboard...";
    if (p < 96) return "Finalizing Session...";
    return "Launching Cop-Companion...";
  };

  const statusMessage = getStatusMessage(progress);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isComplete ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="w-full h-full flex-grow flex flex-col"
    >
      <HexagonBackground animateParticles={!isComplete}>
        {/* Header Badge */}
        <div className="w-full text-center pt-8 px-4 flex flex-col items-center select-none">
          <span 
            className="text-[9px] tracking-[0.25em] font-mono font-bold uppercase py-1 px-3 border rounded bg-black/10 border-gray-500/10"
            style={{ color: "var(--text-secondary)" }}
          >
            RESTRICTED ACCESS // LAW ENFORCEMENT & INTEL ARCHIVE
          </span>
        </div>

        {/* Centerpiece Logo & Title */}
        <div className="flex-grow flex flex-col items-center justify-center py-10 w-full max-w-lg">
          <div className="flex flex-col items-center text-center gap-6">
            <div
              className={`transition-all duration-700 ease-out ${
                isComplete 
                  ? "scale-[1.03] filter drop-shadow-[0_0_24px_rgba(0,240,255,0.75)]" 
                  : ""
              }`}
            >
              <CopCompanionLogo 
                size={180} 
                animate={!isComplete && !prefersReducedMotion} 
                glow={!prefersReducedMotion}
              />
            </div>

            <div className="flex flex-col items-center">
              <h1 
                className="text-3xl md:text-4xl font-extrabold tracking-[0.16em] uppercase select-none transition-colors duration-500"
                style={{ 
                  color: "var(--text-primary)",
                  fontFamily: "'Orbitron', 'Syncopate', sans-serif",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.12), 0 0 20px var(--accent-custom-glow)"
                }}
              >
                COP-COMPANION
              </h1>
              
              <div className="flex items-center justify-center gap-3 mt-2.5 w-full max-w-md px-4">
                <div className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-transparent to-[var(--accent-custom)] opacity-60" />
                <p 
                  className="text-[9px] md:text-[10px] font-bold tracking-[0.18em] uppercase select-none whitespace-nowrap"
                  style={{ 
                    color: "var(--text-muted)", 
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.85
                  }}
                >
                  Crime Record Management System
                </p>
                <div className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-[var(--accent-custom)] to-transparent opacity-60" />
              </div>
            </div>

            <div className="mt-4">
              <StatusText status={statusMessage} />
            </div>

            <div className="w-full mt-1 flex justify-center">
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>

        {/* Bottom Timeline steps */}
        <div className="w-full flex flex-col items-center pb-8 gap-4 px-4 select-none">
          <Timeline progress={progress} />

          <div className="flex items-center gap-1.5 mt-2 transition-colors duration-500" style={{ color: "var(--text-muted)" }}>
            <Lock className="w-3 h-3 stroke-[2]" style={{ color: "var(--accent-custom)" }} />
            <span className="text-[10px] font-mono uppercase tracking-widest">
              Secure. Reliable. Always.
            </span>
          </div>
        </div>
      </HexagonBackground>
    </motion.div>
  );
};
