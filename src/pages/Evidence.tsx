import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { Plus, Edit2, Trash2, X, Archive, Loader2 } from "lucide-react";

interface EvidenceItem {
  Evidence_ID?: number;
  _id?: any;
  Evidence_Type: string;
  Description?: string;
  Case_ID?: number | null;
}

interface CaseOption {
  Case_ID: number;
  Description: string;
  Case_Status: string;
}

const inputCls =
  "w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner";
const emptyForm = { Evidence_Type: "", Description: "", Case_ID: "" };

export default function Evidence() {
  const [items, setItems] = useState<EvidenceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EvidenceItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const limit = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/officer/evidence?page=${page}&limit=${limit}`,
      );
      setItems(res.data.data);
      setTotal(res.data.total);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    api
      .get("/officer/cases?limit=100")
      .then((r) => setCases(r.data.data))
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };
  const openEdit = (e: EvidenceItem) => {
    setEditing(e);
    setForm({
      Evidence_Type: e.Evidence_Type,
      Description: e.Description || "",
      Case_ID: e.Case_ID ? String(e.Case_ID) : "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = {
        Evidence_Type: form.Evidence_Type,
        Description: form.Description,
        Case_ID: form.Case_ID ? Number(form.Case_ID) : null,
      };
      if (editing)
        await api.put(
          `/officer/evidence/${editing.Evidence_ID || editing._id}`,
          payload,
        );
      else await api.post("/officer/evidence", payload);
      setShowModal(false);
      fetchData();
    } catch (e: unknown) {
      setError(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save.",
      );
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deletion of this evidence log?")) return;
    try {
      await api.delete(`/officer/evidence/${id}`);
      fetchData();
    } catch {
      alert("Failed to delete.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-black z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2 flex items-center gap-3">
              <Archive className="h-10 w-10 text-amber-500" />
              Evidence <span className="text-gradient">Locker</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Secure storage and logging for case evidence.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Plus className="h-5 w-5" /> Log Evidence
          </button>
        </div>

        <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-amber-500" />
              <p>Accessing evidence locker...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    {[
                      "Evidence Category",
                      "Detailed Tracking",
                      "Linked Case",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className={
                          h === "Actions" ? "px-8 py-5 text-right" : "px-8 py-5"
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-8 py-12 text-slate-400 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <Archive className="h-12 w-12 text-slate-700 mb-3" />
                          <p className="text-lg font-medium text-slate-300">
                            Locker is empty.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((e) => (
                      <tr
                        key={e._id}
                        className="hover:bg-white/[0.02] transition duration-200 group"
                      >
                        <td className="px-8 py-5 text-slate-200 font-semibold">
                          {e.Evidence_Type}
                        </td>
                        <td className="px-8 py-5 text-slate-400 max-w-xs xl:max-w-md truncate">
                          {e.Description || "—"}
                        </td>
                        <td className="px-8 py-5 text-slate-400 max-w-xs truncate">
                          <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md text-xs font-medium mr-2">
                            Link
                          </span>
                          {e.Case_ID?.Description || "—"}
                        </td>
                        <td className="px-8 py-5 text-right space-x-3 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(e)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors inline-block"
                            title="Edit Record"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(e._id)}
                            className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors inline-block"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${p === page ? "bg-white text-slate-950 shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {showModal && (
          <Modal
            title={editing ? "Update Evidence Log" : "Log New Evidence"}
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-5 mt-4">
              <Field label="Evidence Category *">
                <input
                  value={form.Evidence_Type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, Evidence_Type: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="e.g. CCTV Footage, Weapon, Digital Media..."
                />
              </Field>
              <Field label="Detailed Description">
                <textarea
                  value={form.Description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, Description: e.target.value }))
                  }
                  className={`${inputCls} resize-none h-28 leading-relaxed`}
                  placeholder="Provide precise details for the evidence manifest..."
                />
              </Field>
              <Field label="Linked Case *">
                <select
                  value={form.Case_ID}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, Case_ID: e.target.value }))
                  }
                  className={inputCls}
                >
                  <option value="">Attach to a case file</option>
                  {cases.map((c) => (
                    <option key={c.Case_ID} value={String(c.Case_ID)}>
                      {c.Description || c.Case_ID} — ({c.Case_Status})
                    </option>
                  ))}
                </select>
              </Field>
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-white hover:bg-slate-200 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl py-3.5 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Seal & Save Evidence"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div
        className="glass-dark border border-white/10 rounded-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
