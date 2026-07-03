import React from 'react';
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onAdd: () => void;
  addButtonText: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function PageHeader({ 
  title, 
  subtitle, 
  onAdd, 
  addButtonText, 
  searchPlaceholder, 
  searchValue, 
  onSearchChange 
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-slate-400">{subtitle}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        {onSearchChange && (
          <input
            type="text"
            placeholder={searchPlaceholder || "Search..."}
            className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full sm:w-64"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}
        <button
          onClick={onAdd}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          {addButtonText}
        </button>
      </div>
    </div>
  );
}
