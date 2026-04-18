import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { Search, Plus, Filter, Edit2, Trash2, X, FolderOpen, Loader2 } from "lucide-react";

interface CaseItem {
  Case_ID?: number;
  _id?: any;
  Case_Date: string;
  Case_Status: string;
  Description: string;
  Station_ID?: number | { Station_Name?: string } | null;
  Officer_ID?: number | { Officer_Name?: string } | null;
}

interface Station {
  Station_ID: number;
  Station_Name: string;
}
interface Officer {
  Officer_ID: number;
  Officer_Name: string;
}

const STATUS_OPTIONS = [
  "Open",
  "Closed",
  "Pending Review",
  "Under Investigation",
  "Dismissed",
];

const statusColor = (s: string) => {
  if (s === "Open") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
  if (s === "Closed") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  if (s === "Pending Review") return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
  if (s === "Dismissed") return "bg-red-500/10 text-red-400 border border-red-500/20";
  return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
};

const emptyForm = {
  Case_Date: "",
  Case_Status: "Open",
  Description: "",
  Station_ID: "",
  Officer_ID: "",
};

export default function Cases() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stations, setStations] = useState<Station[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CaseItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const limit = 10;

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get(`/officer/cases?${params}`);
      setCases(res.data.data);
      setTotal(res.data.total);
    } catch {
      setCases([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCases();
  }, [page, search, statusFilter]);

  useEffect(() => {
    api
      .get("/officer/stations")
      .then((r) => setStations(r.data.data))
      .catch(() => {});
    api
      .get("/officer/officers?limit=100")
      .then((r) => setOfficers(r.data.data))
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };
  const openEdit = (c: CaseItem) => {
    setEditing(c);
    setForm({
      Case_Date: c.Case_Date ? c.Case_Date.slice(0, 10) : "",
      Case_Status: c.Case_Status,
      Description: c.Description || "",
      Station_ID: typeof c.Station_ID === 'number' ? String(c.Station_ID) : (c.Station_ID && (c.Station_ID as any).Station_ID ? String((c.Station_ID as any).Station_ID) : ""),
      Officer_ID: typeof c.Officer_ID === 'number' ? String(c.Officer_ID) : (c.Officer_ID && (c.Officer_ID as any).Officer_ID ? String((c.Officer_ID as any).Officer_ID) : ""),
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = {
        Case_Date: form.Case_Date,
        Case_Status: form.Case_Status,
        Description: form.Description,
        Station_ID: form.Station_ID ? Number(form.Station_ID) : null,
        Officer_ID: form.Officer_ID ? Number(form.Officer_ID) : null,
      };
      if (editing) {
        await api.put(`/officer/cases/${editing.Case_ID || editing._id}`, payload);
      } else {
        await api.post("/officer/cases", payload);
      }
      setShowModal(false);
      fetchCases();
    } catch (e: unknown) {
      setError(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to save.",
      );
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deletion of this case record? This action cannot be undone.")) return;
    try {
      await api.delete(`/officer/cases/${id}`);
      fetchCases();
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
              <FolderOpen className="h-10 w-10 text-blue-500" />
              Case <span className="text-gradient">Records</span>
            </h1>
            <p className="text-slate-400 text-sm">Manage and track law enforcement case files.</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Plus className="h-5 w-5" /> New Case
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 glass-dark p-4 rounded-2xl border border-white/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search descriptions..."
              className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full appearance-none bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-12 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-500" />
               <p>Securely fetching records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5">Summary</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Lead Officer</th>
                    <th className="px-8 py-5">Station Branch</th>
                    <th className="px-8 py-5">Date Filed</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cases.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-slate-400 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FolderOpen className="h-12 w-12 text-slate-700 mb-3" />
                          <p className="text-lg font-medium text-slate-300">No cases match criteria.</p>
                          <p className="text-sm">Try adjusting your filters or create a new case.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cases.map((c) => (
                      <tr key={c._id} className="hover:bg-white/[0.02] transition duration-200 group">
                        <td className="px-8 py-5 text-slate-200 max-w-xs xl:max-w-md">
                           <div className="truncate font-medium">{c.Description || "—"}</div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border ${statusColor(c.Case_Status)}`}>
                            {c.Case_Status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-slate-300">
                          {typeof c.Officer_ID === 'number'
                            ? officers.find((o) => o.Officer_ID === c.Officer_ID)?.Officer_Name || "—"
                            : (c.Officer_ID as any)?.Officer_Name || "—"}
                        </td>
                        <td className="px-8 py-5 text-slate-300 font-medium">
                          {typeof c.Station_ID === 'number'
                            ? stations.find((s) => s.Station_ID === c.Station_ID)?.Station_Name || "—"
                            : (c.Station_ID as any)?.Station_Name || "—"}
                        </td>
                        <td className="px-8 py-5 text-slate-400 font-mono text-sm">
                          {c.Case_Date ? new Date(c.Case_Date).toLocaleDateString() : "—"}
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

        {/* Pagination */}
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

        {/* Modal */}
        {showModal && (
          <Modal
            title={editing ? "Update Case File" : "Initialize New Case"}
            onClose={() => setShowModal(false)}
          >
            <div className="space-y-5 mt-4">
              <Field label="Filing Date">
                <input
                  type="date"
                  value={form.Case_Date}
                  onChange={(e) => setForm((f) => ({ ...f, Case_Date: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Current Status">
                <select
                  value={form.Case_Status}
                  onChange={(e) => setForm((f) => ({ ...f, Case_Status: e.target.value }))}
                  className={inputCls}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Case Description">
                <textarea
                  value={form.Description}
                  onChange={(e) => setForm((f) => ({ ...f, Description: e.target.value }))}
                  className={`${inputCls} resize-none h-28 leading-relaxed`}
                  placeholder="Enter detailed summary..."
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Operating Station">
                  <select
                    value={form.Station_ID}
                    onChange={(e) => setForm((f) => ({ ...f, Station_ID: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select Station</option>
                    {stations.map((s) => (
                      <option key={s.Station_ID} value={String(s.Station_ID)}>{s.Station_Name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Assigned Officer">
                  <select
                    value={form.Officer_ID}
                    onChange={(e) => setForm((f) => ({ ...f, Officer_ID: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select Officer</option>
                    {officers.map((o) => (
                      <option key={o.Officer_ID} value={String(o.Officer_ID)}>{o.Officer_Name}</option>
                    ))}
                  </select>
                </Field>
              </div>
              
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
                    "Save Case Record"
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

const inputCls =
  "w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner";

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
        className="glass-dark border border-white/10 rounded-2xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
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
