import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { Plus, Trash2, X, FileText, Loader2, UserPlus } from "lucide-react";

interface FIRItem {
  FIR_No?: number;
  _id?: any;
  FIR_Date: string;
  Victim_ID?: number | null;
  Case_ID?: number | null;
}

interface VictimOption {
  Victim_ID: number;
  Victim_Name: string;
}
interface CaseOption {
  Case_ID: number;
  Description: string;
  Case_Status: string;
}
interface NewVictimForm {
  Victim_Name: string;
  Gender: "Male" | "Female" | "Other" | "";
  Phone: string;
  Address: string;
}

interface CreateVictimResponse {
  Victim_ID?: string;
}

const inputCls =
  "w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner";
const emptyForm = { FIR_Date: "", Victim_ID: "", Case_ID: "" };
const emptyVictimForm: NewVictimForm = {
  Victim_Name: "",
  Gender: "",
  Phone: "",
  Address: "",
};

export default function FIRs() {
  const [items, setItems] = useState<FIRItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [victims, setVictims] = useState<VictimOption[]>([]);
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showVictimModal, setShowVictimModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [victimForm, setVictimForm] = useState<NewVictimForm>(emptyVictimForm);
  const [saving, setSaving] = useState(false);
  const [savingVictim, setSavingVictim] = useState(false);
  const [error, setError] = useState("");
  const [victimError, setVictimError] = useState("");
  const limit = 10;

  const fetchVictims = async () => {
    try {
      const res = await api.get("/officer/victims?limit=100");
      setVictims(res.data.data || []);
    } catch {
      setVictims([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/officer/firs?page=${page}&limit=${limit}`);
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
    fetchVictims();
    api
      .get("/officer/cases?limit=100")
      .then((r) => setCases(r.data.data))
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = {
        FIR_Date: form.FIR_Date,
        Case_ID: form.Case_ID ? Number(form.Case_ID) : null,
        Victim_ID: form.Victim_ID ? Number(form.Victim_ID) : null,
      };
      await api.post("/officer/firs", payload);
      setShowModal(false);
      setForm(emptyForm);
      fetchData();
    } catch (e: unknown) {
      setError(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create FIR.",
      );
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FIR? This action cannot be undone.")) return;
    try {
      await api.delete(`/officer/firs/${id}`);
      fetchData();
    } catch {
      alert("Failed to delete.");
    }
  };

  const handleCreateVictim = async () => {
    setVictimError("");
    setSavingVictim(true);

    if (!victimForm.Victim_Name.trim()) {
      setVictimError("Victim name is required.");
      setSavingVictim(false);
      return;
    }

    try {
      const payload = {
        Victim_Name: victimForm.Victim_Name.trim(),
        Gender: victimForm.Gender || undefined,
        Phone: victimForm.Phone.trim() || undefined,
        Address: victimForm.Address.trim() || undefined,
      };

      const res = await api.post<CreateVictimResponse>(
        "/officer/victims",
        payload,
      );
      const createdVictimId = res.data?.Victim_ID;

      await fetchVictims();

      if (createdVictimId) {
        setForm((prev) => ({ ...prev, Victim_ID: createdVictimId }));
      }

      setVictimForm(emptyVictimForm);
      setShowVictimModal(false);
    } catch (e: unknown) {
      setVictimError(
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to add victim.",
      );
    }

    setSavingVictim(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-black z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2 flex items-center gap-3">
              <FileText className="h-10 w-10 text-emerald-500" />
              FIR <span className="text-gradient">Records</span>
            </h1>
            <p className="text-slate-400 text-sm">First Information Reports registry.</p>
          </div>
          <button
            onClick={() => {
              setForm(emptyForm);
              setError("");
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-200 text-slate-950 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Plus className="h-5 w-5" /> File FIR
          </button>
        </div>
        
        <div className="mb-8 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm inline-block">
          <span className="font-bold">Attention:</span> FIR records are immutable and cannot be edited once firmly filed in the system.
        </div>

        <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {loading ? (
             <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4 text-emerald-500" />
                <p>Retrieving legal documents...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-white/5">
                  <tr>
                    {["Filing Date", "Victim", "Case Status", "Actions"].map((h) => (
                      <th key={h} className={h === "Actions" ? "px-8 py-5 text-right" : "px-8 py-5"}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-slate-400 text-center">
                         <div className="flex flex-col items-center justify-center">
                          <FileText className="h-12 w-12 text-slate-700 mb-3" />
                          <p className="text-lg font-medium text-slate-300">No FIRs filed.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((f) => (
                      <tr key={f._id} className="hover:bg-white/[0.02] transition duration-200 group">
                        <td className="px-8 py-5 text-slate-300 font-mono text-sm">
                          {new Date(f.FIR_Date).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 text-white font-semibold">
                          {f.Victim_ID?.Victim_Name || "—"}
                        </td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-full text-xs font-medium border border-slate-700 bg-slate-800 text-slate-300 shadow-sm">
                            {f.Case_ID?.Case_Status || "Unknown"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right space-x-3 opacity-100 sm:opacity-50 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(f._id)}
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

        {/* Create FIR Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
            <div 
              className="glass-dark border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Draft New FIR</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5">
                    Date of Filing *
                  </label>
                  <input
                    type="date"
                    value={form.FIR_Date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, FIR_Date: e.target.value }))
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Select Victim *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setVictimError("");
                        setVictimForm(emptyVictimForm);
                        setShowVictimModal(true);
                      }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                    >
                      <UserPlus className="h-3 w-3" /> New
                    </button>
                  </div>
                  <select
                    value={form.Victim_ID}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Victim_ID: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">Choose a victim profile</option>
                    {victims.map((v) => (
                      <option key={v.Victim_ID} value={String(v.Victim_ID)}>
                        {v.Victim_Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5">
                    Associated Case *
                  </label>
                  <select
                    value={form.Case_ID}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, Case_ID: e.target.value }))
                    }
                    className={inputCls}
                  >
                    <option value="">Select linked case</option>
                    {cases.map((c) => (
                      <option key={c.Case_ID} value={String(c.Case_ID)}>
                         {(c.Case_ID ? String(c.Case_ID).slice(-6) : "—")} — {c.Case_Status}
                      </option>
                    ))}
                  </select>
                </div>
                {error && (
                   <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    onClick={handleCreate}
                    disabled={saving}
                    className="w-full bg-white hover:bg-slate-200 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl py-3.5 transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2"
                  >
                    {saving ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</>
                    ) : (
                      "Officially File FIR"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Victim Modal (Nested) */}
        {showVictimModal && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[60] px-4 animate-fade-in">
            <div className="glass-dark border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Register Victim</h3>
                <button
                  onClick={() => setShowVictimModal(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5">
                    Victim Name *
                  </label>
                  <input
                    value={victimForm.Victim_Name}
                    onChange={(e) =>
                      setVictimForm((v) => ({
                        ...v,
                        Victim_Name: e.target.value,
                      }))
                    }
                    className={inputCls}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={victimForm.Gender}
                      onChange={(e) =>
                        setVictimForm((v) => ({
                          ...v,
                          Gender: e.target.value as NewVictimForm["Gender"],
                        }))
                      }
                      className={inputCls}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      value={victimForm.Phone}
                      onChange={(e) =>
                        setVictimForm((v) => ({ ...v, Phone: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5">
                    Address
                  </label>
                  <textarea
                    value={victimForm.Address}
                    onChange={(e) =>
                      setVictimForm((v) => ({ ...v, Address: e.target.value }))
                    }
                    className={`${inputCls} h-20 resize-none`}
                    placeholder="Enter address"
                  />
                </div>

                {victimError && (
                   <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                    {victimError}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowVictimModal(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl py-3.5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateVictim}
                    disabled={savingVictim}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3.5 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    {savingVictim ? "Saving..." : "Save Victim"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
