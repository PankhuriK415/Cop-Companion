import React from 'react';
import { X, Loader2 } from "lucide-react";

interface CrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  isSaving: boolean;
  error?: string;
  children: React.ReactNode;
}

export function CrudModal({
  isOpen,
  onClose,
  title,
  isEditing,
  onSubmit,
  isSaving,
  error,
  children
}: CrudModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? `Edit ${title}` : `Add New ${title}`}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
