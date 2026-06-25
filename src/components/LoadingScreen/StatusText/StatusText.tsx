import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusTextProps {
  /** The current status message to display */
  status: string;
}

export const StatusText: React.FC<StatusTextProps> = ({ status }) => {
  return (
    <div className="h-6 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={status}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-xs sm:text-sm font-medium tracking-wider text-center select-none"
          style={{ color: "var(--accent-custom)" }}
          aria-live="polite"
        >
          {status}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};
