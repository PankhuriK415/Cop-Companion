import React from "react";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

/** Shared padded content shell for CRUD list pages. */
export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`p-6 md:p-10 font-sans selection:bg-blue-500/30 ${className}`}>
      <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
    </div>
  );
}
