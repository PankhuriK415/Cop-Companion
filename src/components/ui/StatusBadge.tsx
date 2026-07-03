import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case "Open":
      case "Under Investigation":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Closed":
      case "Dismissed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Pending Review":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status || "Unknown"}
    </span>
  );
}
