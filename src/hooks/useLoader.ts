import { useEffect, useState, useRef } from "react";
import { getStatusMessage } from "../constants/loadingSteps";

interface UseLoaderProps {
  progress?: number;
  setProgress?: React.Dispatch<React.SetStateAction<number>>;
  onLoadingComplete?: () => void;
  prefersReducedMotion?: boolean;
}

export const useLoader = ({
  progress: propProgress,
  setProgress: propSetProgress,
  onLoadingComplete,
  prefersReducedMotion = false,
}: UseLoaderProps) => {
  const [localProgress, setLocalProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scanFinished, setScanFinished] = useState(false);
  
  // Ref to track if we've fired the completion callback
  const hasCompletedRef = useRef(false);

  const progress = propProgress !== undefined ? propProgress : localProgress;

  const setProgress = (value: number | ((prev: number) => number)) => {
    const updateValue = (prev: number) => {
      const nextVal = typeof value === "function" ? value(prev) : value;
      // Ensure progress ONLY ever moves forward and stays within [0, 100]
      return Math.min(100, Math.max(prev, nextVal));
    };

    if (propSetProgress) {
      propSetProgress(updateValue);
    } else {
      setLocalProgress(updateValue);
    }
  };

  // 1. Organic progress driver (reaches 100% in ~2.0 - 2.5 seconds)
  useEffect(() => {
    if (progress >= 100) {
      setIsComplete(true);
      return;
    }

    const minDelay = prefersReducedMotion ? 80 : 120;
    const maxDelay = prefersReducedMotion ? 160 : 240;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;

    const timer = setTimeout(() => {
      const remaining = 100 - progress;
      
      let increment = 0;
      if (remaining > 40) {
        increment = Math.floor(Math.random() * 8) + 12; // 12 to 19%
      } else if (remaining > 15) {
        increment = Math.floor(Math.random() * 5) + 8;  // 8 to 12%
      } else if (remaining > 2) {
        increment = Math.floor(Math.random() * 3) + 2;  // 2 to 4%
      } else {
        increment = 1; // Final touch
      }

      setProgress(progress + increment);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [progress, prefersReducedMotion]);

  // 2. Handle completion flow:
  // Once the progress is 100% AND the scan animation signals it has finished its final sweep:
  // We trigger the exit transition after a 500ms delay for the final glow pulse to shine.
  useEffect(() => {
    if (isComplete && scanFinished && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const finalTimeout = setTimeout(() => {
        if (onLoadingComplete) {
          onLoadingComplete();
        }
      }, 500); // 500ms wait after final glow pulse
      return () => clearTimeout(finalTimeout);
    }
  }, [isComplete, scanFinished, onLoadingComplete]);

  const statusMessage = getStatusMessage(progress);

  return {
    progress,
    statusMessage,
    isComplete,
    scanFinished,
    setScanFinished,
  };
};
