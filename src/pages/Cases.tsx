import { useEffect, useState } from "react";
import api from "../lib/apiClient";

interface CaseItem {
  _id: string;
  Case_Date: string;
  Case_Status: string;
  Description: string;
  Station_ID?: { _id: string; Station_Name: string };
  Officer_ID?: { _id: string; Officer_Name: string };
}

interface Station {
  _id: string;
  Station_Name: string;
}
interface Officer {
  _id: string;
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
  if (s === "Open") return "bg-blue-900 text-blue-200";
  if (s === "Closed") return "bg-green-900 text-green-200";
  if (s === "Pending Review") return "bg-purple-900 text-purple-200";
  if (s === "Dismissed") return "bg-red-900 text-red-200";
  return "bg-yellow-900 text-yellow-200";
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
      Station_ID: c.Station_ID?._id || "",
      Officer_ID: c.Officer_ID?._id || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/officer/cases/${editing._id}`, form);
      } else {
        await api.post("/officer/cases", form);
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
    if (!confirm("Delete this case?")) return;
    try {
      await api.delete(`/officer/cases/${id}`);
      fetchCases();
    } catch {
      alert("Failed to delete.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Cases</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          + New Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search description..."
          className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        {loading ? (
          <div className="text-slate-400 p-6">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-slate-300">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-slate-300">Status</th>
                <th className="px-6 py-4 text-left text-slate-300">Officer</th>
                <th className="px-6 py-4 text-left text-slate-300">Station</th>
                <th className="px-6 py-4 text-left text-slate-300">Date</th>
                <th className="px-6 py-4 text-left text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {cases.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-slate-400 text-center"
                  >
                    No cases found.
                  </td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                      {c.Description || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(c.Case_Status)}`}
                      >
                        {c.Case_Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {c.Officer_ID?.Officer_Name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {c.Station_ID?.Station_Name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(c.Case_Date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => openEdit(c)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${p === page ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={editing ? "Edit Case" : "New Case"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <Field label="Date">
              <input
                type="date"
                value={form.Case_Date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Case_Date: e.target.value }))
                }
                className={inputCls}
              />
            </Field>
            <Field label="Status">
              <select
                value={form.Case_Status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Case_Status: e.target.value }))
                }
                className={inputCls}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Description">
              <textarea
                value={form.Description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Description: e.target.value }))
                }
                className={`${inputCls} resize-none h-20`}
              />
            </Field>
            <Field label="Station">
              <select
                value={form.Station_ID}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Station_ID: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">Select station</option>
                {stations.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.Station_Name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Officer">
              <select
                value={form.Officer_ID}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Officer_ID: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">Select officer</option>
                {officers.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.Officer_Name}
                  </option>
                ))}
              </select>
            </Field>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg py-2.5 transition"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const inputCls =
  "w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
