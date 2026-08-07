export interface LoadingStep {
  id: number;
  labelTop: string;
  labelBottom: string;
  iconName: "Shield" | "User" | "Database" | "Folder" | "LayoutGrid" | "CheckCircle";
  threshold: number;         // Start of the step (inclusive)
  completionThreshold: number; // End of the step (exclusive)
  message: string;
}

export const LOADING_STEPS: LoadingStep[] = [
  {
    id: 0,
    labelTop: "Secure",
    labelBottom: "Environment",
    iconName: "Shield",
    threshold: 0,
    completionThreshold: 10,
    message: "Initializing Secure Environment...",
  },
  {
    id: 1,
    labelTop: "Verify",
    labelBottom: "Credentials",
    iconName: "User",
    threshold: 10,
    completionThreshold: 25,
    message: "Verifying User Credentials...",
  },
  {
    id: 2,
    labelTop: "Database",
    labelBottom: "Connection",
    iconName: "Database",
    threshold: 25,
    completionThreshold: 45,
    message: "Connecting to Encrypted Database...",
  },
  {
    id: 3,
    labelTop: "Load",
    labelBottom: "Records",
    iconName: "Folder",
    threshold: 45,
    completionThreshold: 65,
    message: "Loading Case Records...",
  },
  {
    id: 4,
    labelTop: "Prepare",
    labelBottom: "Dashboard",
    iconName: "LayoutGrid",
    threshold: 65,
    completionThreshold: 85,
    message: "Preparing Dashboard...",
  },
  {
    id: 5,
    labelTop: "Complete",
    labelBottom: "Session",
    iconName: "CheckCircle",
    threshold: 85,
    completionThreshold: 100,
    message: "Finalizing Session...",
  },
];

export const getStatusMessage = (progress: number): string => {
  if (progress >= 100) return "Launching Cop-Companion...";
  const currentStep = LOADING_STEPS.find(
    (step) => progress >= step.threshold && progress < step.completionThreshold
  );
  return currentStep ? currentStep.message : "Initializing...";
};
