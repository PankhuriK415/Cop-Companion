import React from "react";
import { Plus, Search } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addButtonText: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  /** Optional filter controls rendered next to search (e.g. status select) */
  filters?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  onAdd,
  addButtonText,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filters,
}: PageHeaderProps) {
  const titleParts = title.trim().split(/\s+/);
  const lastWord = titleParts.length > 1 ? titleParts.pop() : null;
  const titleLead = titleParts.join(" ");

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2">
            {lastWord ? (
              <>
                {titleLead} <span className="text-gradient">{lastWord}</span>
              </>
            ) : (
              <span className="text-gradient">{title}</span>
            )}
          </h1>
          <p className="text-slate-400 text-base md:text-lg">{subtitle}</p>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto shrink-0"
        >
          <Plus className="w-5 h-5" />
          {addButtonText}
        </button>
      </div>

      {(onSearchChange || filters) && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 glass-dark rounded-2xl border border-slate-700/50 p-3">
          {filters}
          {onSearchChange && (
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder={searchPlaceholder || "Search..."}
                className="w-full bg-slate-950/60 border border-slate-700/80 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/40 placeholder:text-slate-500"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
