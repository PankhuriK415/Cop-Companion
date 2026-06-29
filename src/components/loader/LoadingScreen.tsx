import React from "react";
import { useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";
import { CopCompanionLogo } from "../logo/CopCompanionLogo";
import { Background } from "./Background";
import { Particles } from "./Particles";
import { ProgressBar } from "./ProgressBar";
import { StatusText } from "./StatusText";
import { Timeline } from "./Timeline";
import { useLoader } from "../../hooks/useLoader";

interface LoadingScreenProps {
  /** Callback fired once the loading and final transition animations finish */
  onLoadingComplete?: () => void;
  /** Initial loading title passed from auth context (fallback) */
  title?: string;
  /** Initial loading subtitle passed from auth context (fallback) */
  subtitle?: string;
  /** Lifted progress state */
  progress?: number;
  /** Lifted setProgress state */
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadingComplete,
  progress,
  setProgress,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const {
    progress: currentProgress,
    statusMessage,
    isComplete,
    setScanFinished,
  } = useLoader({
    progress,
    setProgress,
    onLoadingComplete,
    prefersReducedMotion: prefersReducedMotion || false,
  });

  return (
    <div className="w-full h-full flex-grow flex flex-col">
      <Background>
        {/* Slow particles */}
        <Particles />

        {/* 1. Header Badge */}
        <div className="w-full text-center pt-8 px-4 flex flex-col items-center select-none z-10">
          <span
            className="text-[9px] tracking-[0.25em] font-mono font-bold uppercase py-1 px-3 border rounded bg-black/10 border-gray-500/10"
            style={{ color: "var(--text-secondary)" }}
          >
            RESTRICTED ACCESS // LAW ENFORCEMENT & INTEL ARCHIVE
          </span>
        </div>

        {/* 2. Centerpiece Logo, Typography, Status, Progress */}
        <div className="flex-grow flex flex-col items-center justify-center py-10 w-full max-w-lg z-10">
          <div className="flex flex-col items-center text-center gap-4 w-full">
            {/* SVG Logo */}
            <CopCompanionLogo
              size={180}
              animated={!prefersReducedMotion}
              glow={!prefersReducedMotion}
              stopScan={isComplete}
              onScanIterationComplete={() => setScanFinished(true)}
            />

            {/* Typography */}
            <div className="flex flex-col items-center w-full">
              <h1
                className="text-2xl md:text-3xl font-extrabold tracking-[0.16em] uppercase select-none transition-colors duration-500"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Orbitron', 'Syncopate', sans-serif",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.08), 0 0 20px var(--accent-custom-glow)",
                }}
              >
                COP-COMPANION
              </h1>

              {/* Subtitle with Custom Decorative Lines (Matches reference image) */}
              <div className="flex items-center justify-center gap-2.5 mt-1 w-full max-w-md px-4">
                <div className="h-[1px] w-8 md:w-11 bg-gradient-to-r from-transparent to-[var(--accent-custom)] opacity-50" />
                <div className="w-1.2 h-[1.5px] bg-[var(--accent-custom)] opacity-70" />
                <p
                  className="text-[8px] md:text-[9px] font-bold tracking-[0.18em] uppercase select-none whitespace-nowrap"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "'Inter', sans-serif",
                    opacity: 0.85,
                  }}
                >
                  Crime Record Management System
                </p>
                <div className="w-1.2 h-[1.5px] bg-[var(--accent-custom)] opacity-70" />
                <div className="h-[1px] w-8 md:w-11 bg-gradient-to-r from-[var(--accent-custom)] to-transparent opacity-50" />
              </div>
            </div>

            {/* Status Text (Cross-fading messages) */}
            <div className="mt-0.5">
              <StatusText status={statusMessage} />
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-0 flex justify-center">
              <ProgressBar progress={currentProgress} />
            </div>
          </div>
        </div>

        {/* 3. Bottom Timeline & Lock Badge */}
        <div className="w-full flex flex-col items-center pb-8 gap-4 px-4 select-none z-10">
          <Timeline progress={currentProgress} />

          <div
            className="flex items-center gap-2 mt-2 transition-colors duration-500"
            style={{ color: "var(--text-muted)" }}
          >
            <Lock className="w-3.5 h-3.5 stroke-[2] text-[var(--accent-custom)] opacity-80" />
            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Secured. Encrypted. Trusted.
            </span>
          </div>
        </div>
      </Background>
    </div>
  );
};
export default LoadingScreen;
