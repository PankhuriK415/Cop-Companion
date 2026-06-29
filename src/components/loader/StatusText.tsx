import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusTextProps {
  status: string;
}

export const StatusText: React.FC<StatusTextProps> = ({ status }) => {
  return (
    <div className="h-6 flex items-center justify-center select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="flex items-center justify-center gap-2.5"
          aria-live="polite"
        >
          {/* Concentric Pulsing Status Dot */}
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            {/* Outer Ring pulsing */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-custom)] opacity-40 animate-ping" style={{ animationDuration: "2s" }} />
            {/* Outer static ring */}
            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full border border-[var(--accent-custom)] opacity-60" />
            {/* Center solid dot */}
            <span className="relative inline-flex h-1.2 w-1.2 rounded-full bg-[var(--accent-custom)]" />
          </div>

          <p
            className="text-xs sm:text-sm font-medium tracking-wide"
            style={{ color: "var(--text-primary)", opacity: 0.85 }}
          >
            {status}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default StatusText;
