import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  User,
  Database,
  Folder,
  LayoutGrid,
  CheckCircle,
} from "lucide-react";
import { LOADING_STEPS } from "../../constants/loadingSteps";

interface TimelineProps {
  progress: number;
}

export const Timeline: React.FC<TimelineProps> = ({ progress }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return Shield;
      case "User":
        return User;
      case "Database":
        return Database;
      case "Folder":
        return Folder;
      case "LayoutGrid":
        return LayoutGrid;
      case "CheckCircle":
        return CheckCircle;
      default:
        return Shield;
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 py-6 flex items-center justify-between select-none">
      {LOADING_STEPS.map((step, idx) => {
        const IconComponent = getIcon(step.iconName);
        const isCompleted = progress >= step.completionThreshold;
        const isActive = progress >= step.threshold && progress < step.completionThreshold;

        // Colors based on state
        const iconColor = isCompleted || isActive
          ? "var(--accent-custom)"
          : "var(--text-muted)";

        const circleBorderColor = isCompleted || isActive
          ? "var(--accent-custom)"
          : "rgba(107, 114, 128, 0.2)";

        const circleBg = isActive
          ? "var(--accent-custom-glow)"
          : isCompleted
          ? "rgba(0, 240, 255, 0.02)"
          : "transparent";

        return (
          <React.Fragment key={step.id}>
            {/* Step Circle & Labels */}
            <div className="flex flex-col items-center text-center flex-1 min-w-[65px] md:min-w-[110px]">
              <div className="relative flex items-center justify-center">
                {/* Active Outer Concentric Ring (matches reference image) */}
                 {isActive && (
                  <motion.div
                    className="absolute rounded-full border border-[var(--accent-custom)] pointer-events-none"
                    style={{
                      width: "calc(100% + 10px)",
                      height: "calc(100% + 10px)",
                      opacity: 0.35,
                      boxShadow: "0 0 8px var(--accent-custom-glow)",
                    }}
                    animate={{
                      scale: [1, 1.06, 1],
                      opacity: [0.25, 0.45, 0.25],
                    }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Inner Icon Circle */}
                <motion.div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-colors duration-500 z-10"
                  style={{
                    borderColor: circleBorderColor,
                    backgroundColor: circleBg,
                    color: iconColor,
                    boxShadow: isActive ? "0 0 6px var(--accent-custom-glow)" : "none",
                  }}
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.03, 1],
                        }
                      : { scale: 1 }
                  }
                  transition={
                    isActive
                      ? {
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                      : undefined
                  }
                >
                  <IconComponent className="w-3.8 h-3.8 md:w-4.2 md:h-4.2 stroke-[1.5]" />
                </motion.div>
              </div>

              {/* Labels */}
              <div className="mt-2.5 transition-colors duration-500">
                <p
                  className="text-[9px] md:text-[10px] font-semibold leading-tight tracking-wide"
                  style={{
                    color: isCompleted || isActive
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {step.labelTop}
                </p>
                <p
                  className="text-[8px] md:text-[9px] font-medium leading-none mt-0.5 tracking-wide"
                  style={{
                    color: isCompleted || isActive
                      ? "var(--accent-custom)"
                      : "var(--text-muted)",
                  }}
                >
                  {step.labelBottom}
                </p>
              </div>
            </div>

            {/* Connecting Divider Line */}
            {idx < LOADING_STEPS.length - 1 && (
              <div className="flex-grow flex items-center justify-center px-1 md:px-2">
                <div
                  className="h-[1px] w-full transition-colors duration-500"
                  style={{
                    backgroundColor:
                      progress >= LOADING_STEPS[idx + 1].threshold
                        ? "var(--accent-custom)"
                        : "rgba(107, 114, 128, 0.15)",
                    opacity: progress >= LOADING_STEPS[idx + 1].threshold ? 0.75 : 0.4,
                    boxShadow:
                      progress >= LOADING_STEPS[idx + 1].threshold
                        ? "0 0 4px var(--accent-custom)"
                        : "none",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default Timeline;
