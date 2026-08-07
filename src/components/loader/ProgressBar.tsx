import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const cleanProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="w-full max-w-xl px-6 md:px-0 flex items-center gap-4">
      {/* Progress Track */}
      <div
        className="flex-grow h-[2px] rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--track)" }}
        role="progressbar"
        aria-valuenow={Math.round(cleanProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="System Loading Progress"
      >
        {/* Progress Fill */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            backgroundColor: "var(--accent-custom)",
            boxShadow: "0 0 6px var(--accent-custom)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${cleanProgress}%` }}
          transition={{ ease: "easeInOut", duration: 0.4 }}
        >
          {/* Shimmer loading line overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "linear",
            }}
          />
        </motion.div>
      </div>

      {/* Percentage Indicator */}
      <span
        className="text-xs md:text-sm font-semibold font-mono w-10 text-right select-none transition-colors duration-500"
        style={{ color: "var(--accent-custom)" }}
      >
        {Math.round(cleanProgress)}%
      </span>
    </div>
  );
};
export default ProgressBar;
