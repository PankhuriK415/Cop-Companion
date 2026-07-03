import React from 'react';
import { Edit2, Trash2 } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({ data, columns, onEdit, onDelete, emptyMessage = "No records found" }: DataTableProps<T>) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-8 py-5 text-sm font-semibold text-slate-300 border-b border-slate-700">
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-8 py-5 text-sm font-semibold text-slate-300 border-b border-slate-700 text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-8 py-12 text-center text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr key={i} className="group hover:bg-slate-800/25 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-8 py-5 text-slate-300">
                      {col.cell ? col.cell(item) : String(item[col.accessorKey as keyof T] || '—')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-8 py-5 text-right space-x-3 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
