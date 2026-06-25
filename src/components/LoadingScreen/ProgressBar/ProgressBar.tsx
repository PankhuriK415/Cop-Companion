import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  /** Loading progress value between 0 and 100 */
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
          className="h-full rounded-full"
          style={{ 
            backgroundColor: "var(--accent-custom)",
            boxShadow: "0 0 8px var(--accent-custom)",
          }}
          animate={{ width: `${cleanProgress}%` }}
          transition={{ ease: "easeInOut", duration: 0.4 }}
        />
      </div>

      {/* Percentage Indicator */}
      <span 
        className="text-sm font-semibold font-mono w-12 text-right transition-colors duration-500"
        style={{ color: "var(--accent-custom)" }}
      >
        {Math.round(cleanProgress)}%
      </span>
    </div>
  );
};
