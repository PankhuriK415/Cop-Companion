import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

interface Stats {
  total: number;
  open: number;
  closed: number;
  pending: number;
}

interface RecentCase {
  _id: string;
  Case_Date: string;
  Case_Status: string;
  Description: string;
  Officer_ID?: { Officer_Name: string };
  Station_ID?: { Station_Name: string };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]   = useState<Stats>({ total: 0, open: 0, closed: 0, pending: 0 });
  const [recent, setRecent] = useState<RecentCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'officer') { setLoading(false); return; }
    const fetchData = async () => {
      try {
        const [openRes, closedRes, pendingRes, totalRes, recentRes] = await Promise.all([
          api.get('/officer/cases?status=Open&limit=1'),
          api.get('/officer/cases?status=Closed&limit=1'),
          api.get('/officer/cases?status=Pending Review&limit=1'),
          api.get('/officer/cases?limit=1'),
          api.get('/officer/cases?limit=5'),
        ]);
        setStats({
          total:   totalRes.data.total,
          open:    openRes.data.total,
          closed:  closedRes.data.total,
          pending: pendingRes.data.total,
        });
        setRecent(recentRes.data.data);
      } catch {
        // silently fail — stats stay at 0
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const statusColor = (s: string) => {
    if (s === 'Open') return 'bg-blue-900 text-blue-200';
    if (s === 'Closed') return 'bg-green-900 text-green-200';
    if (s === 'Pending Review') return 'bg-purple-900 text-purple-200';
    return 'bg-yellow-900 text-yellow-200';
  };

  // Victim dashboard
  if (user?.role === 'victim') {
    return <VictimDashboard />;
  }

  // Criminal dashboard
  if (user?.role === 'criminal') {
    return <CriminalDashboard />;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">Welcome back, {user?.username}</p>

      {loading ? (
        <div className="text-slate-400">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Cases" value={stats.total} color="text-white" />
            <StatCard label="Open Cases" value={stats.open} color="text-blue-400" />
            <StatCard label="Closed Cases" value={stats.closed} color="text-green-400" />
            <StatCard label="Pending Review" value={stats.pending} color="text-purple-400" />
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700">
              <h2 className="text-xl font-semibold text-white">Recent Cases</h2>
            </div>
            {recent.length === 0 ? (
              <p className="text-slate-400 p-6">No cases found.</p>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">Description</th>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">Status</th>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">Officer</th>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {recent.map(c => (
                    <tr key={c._id} className="hover:bg-slate-700/50 transition">
                      <td className="px-6 py-4 text-slate-300 truncate max-w-xs">{c.Description || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(c.Case_Status)}`}>
                          {c.Case_Status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{c.Officer_ID?.Officer_Name || '—'}</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(c.Case_Date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="text-slate-400 text-sm mb-2">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function VictimDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<{ victim: { Victim_Name: string }; cases: unknown[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/victim/data')
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
      <p className="text-slate-400 mb-8">Welcome, {user?.username} (Victim)</p>
      {loading ? <div className="text-slate-400">Loading...</div> : (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-2">{data?.victim?.Victim_Name}</h2>
          <p className="text-slate-400">Cases linked to your FIR: <span className="text-white font-semibold">{(data?.cases as unknown[])?.length ?? 0}</span></p>
        </div>
      )}
    </div>
  );
}

function CriminalDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<{ Criminal_Name: string; cases: unknown[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/criminal/status')
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
      <p className="text-slate-400 mb-8">Welcome, {user?.username} (Criminal Record)</p>
      {loading ? <div className="text-slate-400">Loading...</div> : (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-2">{data?.Criminal_Name}</h2>
          <p className="text-slate-400">Arrest records: <span className="text-white font-semibold">{(data?.cases as unknown[])?.length ?? 0}</span></p>
        </div>
      )}
    </div>
  );
}
