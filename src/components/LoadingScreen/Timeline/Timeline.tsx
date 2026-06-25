import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  User, 
  Database, 
  Folder, 
  LayoutGrid, 
  CheckCircle,
  ChevronRight
} from "lucide-react";

interface TimelineProps {
  /** The current loading progress (0 - 100) */
  progress: number;
}

interface StepItem {
  id: number;
  labelTop: string;
  labelBottom: string;
  icon: React.ComponentType<any>;
  threshold: number;
  completionThreshold: number;
}

export const Timeline: React.FC<TimelineProps> = ({ progress }) => {
  const steps: StepItem[] = [
    {
      id: 0,
      labelTop: "Initializing",
      labelBottom: "Secure Environment",
      icon: Shield,
      threshold: 0,
      completionThreshold: 15,
    },
    {
      id: 1,
      labelTop: "Verifying",
      labelBottom: "User Credentials",
      icon: User,
      threshold: 15,
      completionThreshold: 32,
    },
    {
      id: 2,
      labelTop: "Connecting to",
      labelBottom: "Encrypted Database",
      icon: Database,
      threshold: 32,
      completionThreshold: 48,
    },
    {
      id: 3,
      labelTop: "Loading",
      labelBottom: "Case Records",
      icon: Folder,
      threshold: 48,
      completionThreshold: 65,
    },
    {
      id: 4,
      labelTop: "Preparing",
      labelBottom: "Dashboard",
      icon: LayoutGrid,
      threshold: 65,
      completionThreshold: 82,
    },
    {
      id: 5,
      labelTop: "Finalizing",
      labelBottom: "Session",
      icon: CheckCircle,
      threshold: 82,
      completionThreshold: 100,
    },
  ];

  return (
    <div className="w-full max-w-5xl px-4 py-8 flex items-center justify-between select-none">
      {steps.map((step, idx) => {
        const IconComponent = step.icon;
        const isCompleted = progress >= step.completionThreshold;
        const isActive = progress >= step.threshold && progress < step.completionThreshold;

        const iconColor = isCompleted || isActive 
          ? "var(--accent-custom)" 
          : "var(--text-muted)";

        const circleBorderColor = isCompleted || isActive 
          ? "var(--accent-custom)" 
          : "rgba(107, 114, 128, 0.25)";

        const circleBg = isActive 
          ? "var(--accent-custom-glow)" 
          : isCompleted 
            ? "rgba(0, 240, 255, 0.03)" 
            : "transparent";

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center flex-1 min-w-[70px] md:min-w-[120px]">
              <motion.div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-colors duration-500"
                style={{
                  borderColor: circleBorderColor,
                  backgroundColor: circleBg,
                  color: iconColor,
                }}
                animate={isActive ? {
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 4px var(--accent-custom-glow)",
                    "0 0 14px var(--accent-custom-glow-strong)",
                    "0 0 4px var(--accent-custom-glow)",
                  ],
                } : { scale: 1, boxShadow: "none" }}
                transition={isActive ? {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                } : undefined}
              >
                <IconComponent className="w-4 h-4 md:w-5 md:h-5 stroke-[1.5]" />
              </motion.div>

              <div className="hidden sm:block mt-3 transition-colors duration-500">
                <p 
                  className="text-[10px] md:text-xs font-semibold leading-tight"
                  style={{
                    color: isCompleted || isActive 
                      ? "var(--text-primary)" 
                      : "var(--text-muted)"
                  }}
                >
                  {step.labelTop}
                </p>
                <p 
                  className="text-[9px] md:text-[10px] font-medium leading-none mt-0.5"
                  style={{
                    color: isCompleted || isActive 
                      ? "var(--accent-custom)" 
                      : "var(--text-muted)"
                  }}
                >
                  {step.labelBottom}
                </p>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex-grow flex items-center justify-center px-1 md:px-2">
                <div 
                  className="hidden md:block h-[1px] w-full transition-colors duration-500"
                  style={{
                    backgroundColor: progress >= steps[idx + 1].threshold 
                      ? "var(--accent-custom)" 
                      : "rgba(107, 114, 128, 0.15)",
                    opacity: progress >= steps[idx + 1].threshold ? 0.7 : 0.5,
                    boxShadow: progress >= steps[idx + 1].threshold ? "0 0 4px var(--accent-custom)" : "none"
                  }}
                />
                <ChevronRight 
                  className="block md:hidden w-3.5 h-3.5"
                  style={{
                    color: progress >= steps[idx + 1].threshold 
                      ? "var(--accent-custom)" 
                      : "var(--text-muted)",
                    opacity: progress >= steps[idx + 1].threshold ? 0.8 : 0.3
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
