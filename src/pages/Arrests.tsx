import { useEffect, useState } from "react";
import api from "../lib/apiClient";

interface ArrestItem {
  _id: string;
  Arrest_Date: string;
  Charges?: string;
  Criminal_ID?: { _id: string; Criminal_Name: string };
  Case_ID?: { _id: string; Case_Status: string };
}

interface Criminal {
  _id: string;
  Criminal_Name: string;
}
interface CaseOption {
  _id: string;
  Description: string;
  Case_Status: string;
}

const inputCls =
  "w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";
const emptyForm = {
  Arrest_Date: "",
  Criminal_ID: "",
  Case_ID: "",
  Charges: "",
};

export default function Arrests() {
  const [items, setItems] = useState<ArrestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [criminals, setCriminals] = useState<Criminal[]>([]);
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ArrestItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const limit = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/officer/arrests?page=${page}&limit=${limit}`);
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
      .get("/officer/criminals?limit=100")
      .then((r) => setCriminals(r.data.data))
      .catch(() => {});
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
  const openEdit = (a: ArrestItem) => {
    setEditing(a);
    setForm({
      Arrest_Date: a.Arrest_Date ? a.Arrest_Date.slice(0, 10) : "",
      Criminal_ID: a.Criminal_ID?._id || "",
      Case_ID: a.Case_ID?._id || "",
      Charges: a.Charges || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      if (editing) await api.put(`/officer/arrests/${editing._id}`, form);
      else await api.post("/officer/arrests", form);
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
    if (!confirm("Delete this arrest record?")) return;
    try {
      await api.delete(`/officer/arrests/${id}`);
      fetchData();
    } catch {
      alert("Failed to delete.");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Arrests</h1>
        <button
          onClick={openCreate}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          + Record Arrest
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        {loading ? (
          <div className="text-slate-400 p-6">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                {[
                  "Criminal",
                  "Arrest Date",
                  "Charges",
                  "Case Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-slate-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-slate-400 text-center"
                  >
                    No arrest records found.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4 text-white font-medium">
                      {a.Criminal_ID?.Criminal_Name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(a.Arrest_Date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                      {a.Charges || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                        {a.Case_ID?.Case_Status || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => openEdit(a)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(a._id)}
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

      {showModal && (
        <Modal
          title={editing ? "Edit Arrest" : "Record Arrest"}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <Field label="Criminal *">
              <select
                value={form.Criminal_ID}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Criminal_ID: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">Select criminal</option>
                {criminals.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.Criminal_Name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Case *">
              <select
                value={form.Case_ID}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Case_ID: e.target.value }))
                }
                className={inputCls}
              >
                <option value="">Select case</option>
                {cases.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.Description || c._id} ({c.Case_Status})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Arrest Date *">
              <input
                type="date"
                value={form.Arrest_Date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Arrest_Date: e.target.value }))
                }
                className={inputCls}
              />
            </Field>
            <Field label="Charges">
              <textarea
                value={form.Charges}
                onChange={(e) =>
                  setForm((f) => ({ ...f, Charges: e.target.value }))
                }
                className={`${inputCls} resize-none h-20`}
                placeholder="e.g. Robbery under IPC 392"
              />
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
