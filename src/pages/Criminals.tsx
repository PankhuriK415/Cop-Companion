import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { Search, Plus, Edit2, Trash2, X, Users, Loader2 } from "lucide-react";

interface Criminal {
  _id: string;
  Criminal_Name: string;
  Gender?: string;
  DOB?: string;
  Address?: string;
}

const inputCls =
  "w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner";
const emptyForm = { Criminal_Name: "", Gender: "", DOB: "", Address: "" };

export default function Criminals() {
  const [items, setItems] = useState<Criminal[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Criminal | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const limit = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      const res = await api.get(`/officer/criminals?${params}`);
      setItems(res.data.data);
      setTotal(res.data.total);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };
  const openEdit = (c: Criminal) => {
    setEditing(c);
    setForm({
      Criminal_Name: c.Criminal_Name,
      Gender: c.Gender || "",
      DOB: c.DOB ? c.DOB.slice(0, 10) : "",
      Address: c.Address || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      if (editing) await api.put(`/officer/criminals/${editing._id}`, form);
      else await api.post("/officer/criminals", form);
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
    if (!confirm("Confirm deletion of this criminal record?")) return;
    try {
      await api.delete(`/officer/criminals/${id}`);
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
              <Users className="h-10 w-10 text-blue-500" />
              Criminal <span className="text-gradient">Database</span>
            </h1>
            <p className="text-slate-400 text-sm">Manage criminal registries and profiles.</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Plus className="h-5 w-5" /> Add Criminal
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 glass-dark p-4 rounded-2xl border border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or address..."
              className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>

        <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {loading ? (
             <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
                <p>Accessing criminal registry...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    {["Name", "Gender", "Date of Birth", "Address", "Actions"].map(
                      (h) => (
                        <th key={h} className={h === "Actions" ? "px-8 py-5 text-right" : "px-8 py-5"}>
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-slate-400 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Users className="h-12 w-12 text-slate-700 mb-3" />
                          <p className="text-lg font-medium text-slate-300">No records found.</p>
                          <p className="text-sm">Try adjusting your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((c) => (
                      <tr key={c._id} className="hover:bg-white/[0.02] transition duration-200 group">
                        <td className="px-8 py-5 text-slate-200 font-semibold">
                          {c.Criminal_Name}
                        </td>
                        <td className="px-8 py-5 text-slate-400">
                          {c.Gender ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700">
                              {c.Gender}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-8 py-5 text-slate-400 font-mono text-sm">
                          {c.DOB ? new Date(c.DOB).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-8 py-5 text-slate-400 max-w-xs truncate">
                          {c.Address || "—"}
                        </td>
                        <td className="px-8 py-5 text-right space-x-3 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(c)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors inline-block"
                            title="Edit Record"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
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
            title={editing ? "Update Criminal Profile" : "Create Criminal Profile"}
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-5 mt-4">
              <Field label="Full Name *">
                <input
                  value={form.Criminal_Name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, Criminal_Name: e.target.value }))
                  }
                  className={inputCls}
                  placeholder="Enter explicit full name"
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Gender">
                  <select
                    value={form.Gender}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Gender: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">Select gender</option>
                    {["Male", "Female", "Other"].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Date of Birth">
                  <input
                    type="date"
                    value={form.DOB}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, DOB: e.target.value }))
                    }
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Address">
                <textarea
                  value={form.Address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, Address: e.target.value }))
                  }
                  className={`${inputCls} resize-none h-24 leading-relaxed`}
                  placeholder="Known residential address"
                />
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
                    <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    "Save Record"
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div 
        className="glass-dark border border-white/10 rounded-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{title}</h3>
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
