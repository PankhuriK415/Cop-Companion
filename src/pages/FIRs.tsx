import { useEffect, useState } from 'react';
import api from '../api/client';

interface FIRItem {
  _id: string;
  FIR_Date: string;
  Victim_ID?: { _id: string; Victim_Name: string };
  Case_ID?: { _id: string; Case_Status: string };
}

interface VictimOption { _id: string; Victim_Name: string; }
interface CaseOption { _id: string; Description: string; Case_Status: string; }

const inputCls = 'w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500';
const emptyForm = { FIR_Date: '', Victim_ID: '', Case_ID: '' };

export default function FIRs() {
  const [items, setItems]   = useState<FIRItem[]>([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [victims, setVictims] = useState<VictimOption[]>([]);
  const [cases, setCases]   = useState<CaseOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]     = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const limit = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/officer/firs?page=${page}&limit=${limit}`);
      setItems(res.data.data);
      setTotal(res.data.total);
    } catch { setItems([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page]);
  useEffect(() => {
    api.get('/officer/victims?limit=100').then(r => setVictims(r.data.data)).catch(() => {});
    api.get('/officer/cases?limit=100').then(r => setCases(r.data.data)).catch(() => {});
  }, []);

  const handleCreate = async () => {
    setError(''); setSaving(true);
    try {
      await api.post('/officer/firs', form);
      setShowModal(false); setForm(emptyForm); fetchData();
    } catch (e: unknown) {
      setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create FIR.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FIR? This action cannot be undone.')) return;
    try { await api.delete(`/officer/firs/${id}`); fetchData(); }
    catch { alert('Failed to delete.'); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-white">FIRs</h1>
        <button onClick={() => { setForm(emptyForm); setError(''); setShowModal(true); }}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
          + File FIR
        </button>
      </div>
      <p className="text-amber-400 text-sm mb-6">Note: FIR records cannot be edited once filed.</p>

      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        {loading ? <div className="text-slate-400 p-6">Loading...</div> : (
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                {['FIR Date', 'Victim', 'Case Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-4 text-left text-slate-300">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {items.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-slate-400 text-center">No FIRs found.</td></tr>
              ) : items.map(f => (
                <tr key={f._id} className="hover:bg-slate-700/50 transition">
                  <td className="px-6 py-4 text-slate-300">{new Date(f.FIR_Date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white">{f.Victim_ID?.Victim_Name || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                      {f.Case_ID?.Case_Status || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(f._id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-white">File New FIR</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">FIR Date *</label>
                <input type="date" value={form.FIR_Date} onChange={e => setForm(f => ({ ...f, FIR_Date: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Victim *</label>
                <select value={form.Victim_ID} onChange={e => setForm(f => ({ ...f, Victim_ID: e.target.value }))} className={inputCls}>
                  <option value="">Select victim</option>
                  {victims.map(v => <option key={v._id} value={v._id}>{v.Victim_Name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Case *</label>
                <select value={form.Case_ID} onChange={e => setForm(f => ({ ...f, Case_ID: e.target.value }))} className={inputCls}>
                  <option value="">Select case</option>
                  {cases.map(c => <option key={c._id} value={c._id}>{c.Description || c._id} ({c.Case_Status})</option>)}
                </select>
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button onClick={handleCreate} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg py-2.5 transition">
                {saving ? 'Filing...' : 'File FIR'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
