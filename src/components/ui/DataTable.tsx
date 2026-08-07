import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    /** Prefer more space for longer text columns */
    grow?: boolean;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = "No records found",
}: DataTableProps<T>) {
  const showActions = !!(onEdit || onDelete);

  return (
    <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              {showActions && (
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="px-5 py-16 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr
                  key={i}
                  className="group hover:bg-white/[0.03] transition-colors"
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className={`px-5 py-4 text-sm text-slate-300 align-middle ${
                        col.grow
                          ? "min-w-[12rem] max-w-md"
                          : "whitespace-nowrap"
                      }`}
                    >
                      {col.cell
                        ? col.cell(item)
                        : String(item[col.accessorKey as keyof T] || "—")}
                    </td>
                  ))}
                  {showActions && (
                    <td className="px-5 py-4 text-right whitespace-nowrap align-middle">
                      <div className="inline-flex items-center gap-1">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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
