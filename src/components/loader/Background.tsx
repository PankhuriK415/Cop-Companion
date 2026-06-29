import React from "react";

interface BackgroundProps {
  children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-between select-none"
      style={{
        background: "linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%)",
      }}
    >
      {/* 1. Hexagonal Security Grid Overlay (5% opacity) */}
      <div
        className="absolute inset-0 bg-hex-grid bg-repeat pointer-events-none mix-blend-overlay"
        style={{ opacity: "var(--hex-opacity)" }}
      />

      {/* 2. Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-vignette pointer-events-none" />

      {/* 3. Children Content Wrapper */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between flex-grow">
        {children}
      </div>
    </div>
  );
};
