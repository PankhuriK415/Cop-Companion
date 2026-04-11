import { useEffect, useState } from 'react';
import api from '../api/client';

interface Criminal {
  _id: string;
  Criminal_Name: string;
  Gender?: string;
  DOB?: string;
  Address?: string;
}

const inputCls = 'w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';
const emptyForm = { Criminal_Name: '', Gender: '', DOB: '', Address: '' };

export default function Criminals() {
  const [items, setItems]   = useState<Criminal[]>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Criminal | null>(null);
  const [form, setForm]     = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const limit = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (search) params.set('search', search);
      const res = await api.get(`/officer/criminals?${params}`);
      setItems(res.data.data);
      setTotal(res.data.total);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit   = (c: Criminal) => {
    setEditing(c);
    setForm({ Criminal_Name: c.Criminal_Name, Gender: c.Gender || '', DOB: c.DOB ? c.DOB.slice(0, 10) : '', Address: c.Address || '' });
    setError(''); setShowModal(true);
  };

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      if (editing) await api.put(`/officer/criminals/${editing._id}`, form);
      else await api.post('/officer/criminals', form);
      setShowModal(false); fetchData();
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this criminal record?')) return;
    try { await api.delete(`/officer/criminals/${id}`); fetchData(); }
    catch { alert('Failed to delete.'); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">Criminals</h1>
        <button onClick={openCreate} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
          + Add Criminal
        </button>
      </div>

      <div className="mb-6">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or address..."
          className="bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:border-blue-500" />
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        {loading ? <div className="text-slate-400 p-6">Loading...</div> : (
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                {['Name', 'Gender', 'Date of Birth', 'Address', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-slate-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-slate-400 text-center">No records found.</td></tr>
              ) : items.map(c => (
                <tr key={c._id} className="hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4 text-white font-medium">{c.Criminal_Name}</td>
                  <td className="px-6 py-4 text-slate-400">{c.Gender || '—'}</td>
                  <td className="px-6 py-4 text-slate-400">{c.DOB ? new Date(c.DOB).toLocaleDateString() : '—'}</td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{c.Address || '—'}</td>
                  <td className="px-6 py-4 flex gap-3">
                    <button onClick={() => openEdit(c)} className="text-blue-400 hover:text-blue-300 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${p === page ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{p}</button>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Criminal' : 'Add Criminal'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <Field label="Full Name *">
              <input value={form.Criminal_Name} onChange={e => setForm(f => ({ ...f, Criminal_Name: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Gender">
              <select value={form.Gender} onChange={e => setForm(f => ({ ...f, Gender: e.target.value }))} className={inputCls}>
                <option value="">Select gender</option>
                {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
            <Field label="Date of Birth">
              <input type="date" value={form.DOB} onChange={e => setForm(f => ({ ...f, DOB: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Address">
              <textarea value={form.Address} onChange={e => setForm(f => ({ ...f, Address: e.target.value }))} className={`${inputCls} resize-none h-20`} />
            </Field>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button onClick={handleSave} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg py-2.5 transition">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>{children}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
