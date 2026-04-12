import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";
import { Copy, Activity, Folders, CheckCircle2, Clock, ShieldAlert, FileText, MapPin, Phone, User, Calendar } from "lucide-react";

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

interface VictimCase {
  FIR_ID: string;
  FIR_Date: string;
  Case_ID: string;
  Case_Date: string;
  Case_Status: string;
  Case_Description: string;
  Station_Name?: string;
  evidence: Array<{
    Evidence_ID: string;
    Evidence_Type: string;
    Evidence_Description: string;
  }>;
}

interface VictimDashboardData {
  victim: {
    Victim_ID: string;
    Victim_Name: string;
    Gender?: string;
    Phone?: string;
    Address?: string;
  };
  cases: VictimCase[];
}

interface CriminalCase {
  Arrest_ID: string;
  Arrest_Date: string;
  Case_ID?: string;
  Case_Status?: string;
  Case_Date?: string;
  Case_Description?: string;
}

interface CriminalDashboardData {
  Criminal_ID: string;
  Criminal_Name: string;
  Gender?: string;
  DOB?: string;
  Address?: string;
  cases: CriminalCase[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    open: 0,
    closed: 0,
    pending: 0,
  });
  const [recent, setRecent] = useState<RecentCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "officer") {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const [openRes, closedRes, pendingRes, totalRes, recentRes] =
          await Promise.all([
            api.get("/officer/cases?status=Open&limit=1"),
            api.get("/officer/cases?status=Closed&limit=1"),
            api.get("/officer/cases?status=Pending Review&limit=1"),
            api.get("/officer/cases?limit=1"),
            api.get("/officer/cases?limit=5"),
          ]);
        setStats({
          total: totalRes.data.total,
          open: openRes.data.total,
          closed: closedRes.data.total,
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
    if (s === "Open") return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    if (s === "Closed") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (s === "Pending Review") return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
  };

  // Victim dashboard
  if (user?.role === "victim") {
    return <VictimDashboard />;
  }

  // Criminal dashboard
  if (user?.role === "criminal") {
    return <CriminalDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto animate-fade-in">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2">
            Command <span className="text-gradient">Center</span>
          </h1>
          <p className="text-slate-400 text-lg">Welcome back, Officer {user?.username}. Here's the intelligence report.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-blue-400 p-6 glass-dark rounded-2xl w-fit">
            <Activity className="h-5 w-5 animate-spin" />
            <span className="font-medium">Aggregating intel...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard
                icon={Folders}
                label="Total Active Cases"
                value={stats.total}
                bgColor="from-blue-600/20 to-blue-900/5"
                iconColor="text-blue-400"
                borderColor="border-blue-500/20"
              />
              <StatCard
                icon={Activity}
                label="Open Investigations"
                value={stats.open}
                bgColor="from-amber-600/20 to-amber-900/5"
                iconColor="text-amber-400"
                borderColor="border-amber-500/20"
              />
              <StatCard
                icon={CheckCircle2}
                label="Cases Closed"
                value={stats.closed}
                bgColor="from-emerald-600/20 to-emerald-900/5"
                iconColor="text-emerald-400"
                borderColor="border-emerald-500/20"
              />
              <StatCard
                icon={Clock}
                label="Pending Review"
                value={stats.pending}
                bgColor="from-purple-600/20 to-purple-900/5"
                iconColor="text-purple-400"
                borderColor="border-purple-500/20"
              />
            </div>

            <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-blue-400" />
                    Recent Live Cases
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Latest updates across the precinct</p>
                </div>
              </div>
              
              {recent.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-300 font-medium">No recent cases active.</p>
                  <p className="text-slate-500 text-sm mt-1">New case filings will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      <tr>
                        <th className="px-8 py-4">Case Description</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Lead Officer</th>
                        <th className="px-8 py-4 text-right">Filed Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recent.map((c) => (
                        <tr
                          key={c._id}
                          className="hover:bg-white/[0.02] transition duration-200 group cursor-default"
                        >
                          <td className="px-8 py-5 text-slate-200 font-medium whitespace-normal max-w-sm leading-relaxed group-hover:text-blue-100 transition-colors">
                            <div className="line-clamp-2">{c.Description || "—"}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${statusColor(c.Case_Status)}`}
                            >
                              {c.Case_Status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-slate-300 flex items-center gap-2 mt-1">
                            <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                              <User className="h-3 w-3 text-slate-400" />
                            </div>
                            {c.Officer_ID?.Officer_Name || "Unassigned"}
                          </td>
                          <td className="px-8 py-5 text-slate-400 text-right font-mono text-sm">
                            {new Date(c.Case_Date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  bgColor,
  iconColor,
  borderColor,
}: {
  icon: any;
  label: string;
  value: number;
  bgColor: string;
  iconColor: string;
  borderColor: string;
}) {
  return (
    <div className={`glass-dark rounded-2xl p-6 border ${borderColor} shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} opacity-50 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <div className="text-slate-400 text-sm font-semibold tracking-wide uppercase mb-2">{label}</div>
          <div className="text-4xl font-black text-white font-['Outfit'] tracking-tight">{value}</div>
        </div>
        <div className={`p-3 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 shadow-inner ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function VictimDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<VictimDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/victim/data")
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-black z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Portal</span>
          </h1>
          <p className="text-slate-400 text-lg">Secure profile overview for {user?.username}.</p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-emerald-400 p-6 glass-dark rounded-2xl w-fit">
            <Activity className="h-5 w-5 animate-spin" />
            <span className="font-medium">Loading dossier...</span>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass-dark rounded-2xl border border-emerald-500/20 shadow-2xl p-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <User className="text-emerald-400 h-6 w-6" />
                Personal Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <InfoCell icon={Copy} label="Full Name" value={data?.victim?.Victim_Name} />
                <InfoCell icon={User} label="Gender" value={data?.victim?.Gender} />
                <InfoCell icon={Phone} label="Contact" value={data?.victim?.Phone} />
                <InfoCell icon={MapPin} label="Address" value={data?.victim?.Address} />
              </div>
            </div>

            <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="bg-black/20 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Folders className="text-emerald-400 h-5 w-5" />
                  Linked Case Records
                </h2>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold shadow-sm">
                  {data?.cases?.length ?? 0} Records
                </span>
              </div>

              {!data?.cases?.length ? (
                <div className="p-12 text-center flex flex-col items-center">
                   <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-300 font-medium">No active records found.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {data.cases.map((record) => (
                    <div key={record.FIR_ID} className="p-8 hover:bg-white/[0.02] transition cursor-default">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                            <Calendar className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-0.5">FIR Filed</p>
                            <p className="text-slate-200 font-medium">
                              {new Date(record.FIR_Date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                            </p>
                          </div>
                        </div>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                          Status: {record.Case_Status || "Unknown"}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-5 bg-black/20 rounded-xl border border-white/5">
                        <InfoCell
                          icon={Clock}
                          label="Incident Date"
                          value={record.Case_Date ? new Date(record.Case_Date).toLocaleDateString() : "—"}
                        />
                        <InfoCell
                          icon={MapPin}
                          label="Jurisdiction"
                          value={record.Station_Name || "—"}
                        />
                        <div className="md:col-span-3">
                           <InfoCell
                            icon={FileText}
                            label="Case Summary"
                            value={record.Case_Description || "—"}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <ShieldAlert className="h-4 w-4" /> Supporting Evidence
                        </h3>
                        {!record.evidence?.length ? (
                          <p className="text-slate-400 text-sm italic ml-6">No evidence linked.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {record.evidence.map((ev) => (
                              <div key={ev.Evidence_ID} className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition group/ev">
                                <p className="text-emerald-400 text-sm font-semibold mb-1 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover/ev:animate-ping" />
                                  {ev.Evidence_Type || "Artifact"}
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                  {ev.Evidence_Description || "No details."}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CriminalDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<CriminalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/criminal/status")
      .then((r) => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans selection:bg-red-500/30">
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-900/10 via-slate-950 to-black z-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl mx-auto animate-fade-in">
        <div className="mb-10">
           <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight font-['Outfit'] mb-2">
            Status <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Portal</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Record overview for {user?.username}.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 text-red-400 p-6 glass-dark rounded-2xl w-fit">
            <Activity className="h-5 w-5 animate-spin" />
            <span className="font-medium">Fetching records...</span>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass-dark rounded-2xl border border-red-500/20 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px]" />
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <ShieldAlert className="text-red-400 h-6 w-6" />
                Profile Master
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                <InfoCell icon={User} label="Name" value={data?.Criminal_Name} />
                <InfoCell icon={User} label="Gender" value={data?.Gender} />
                <InfoCell
                  icon={Calendar}
                  label="DOB"
                  value={data?.DOB ? new Date(data.DOB).toLocaleDateString() : "—"}
                />
                <InfoCell icon={MapPin} label="Location" value={data?.Address} />
              </div>
            </div>

            <div className="glass-dark rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="bg-black/20 px-8 py-5 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="text-red-400 h-5 w-5" />
                  Arrest & Case History
                </h2>
                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-bold shadow-sm">
                  {data?.cases?.length ?? 0} Events
                </span>
              </div>

              {!data?.cases?.length ? (
                <div className="p-12 text-center flex flex-col items-center">
                   <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-slate-300 font-medium">Clean record.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-black/40 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4">Arrested</th>
                        <th className="px-8 py-4">Case Dated</th>
                        <th className="px-8 py-4">Current Status</th>
                        <th className="px-8 py-4">Charges / Desc</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.cases.map((record) => (
                        <tr
                          key={record.Arrest_ID}
                          className="hover:bg-white/[0.02] transition"
                        >
                          <td className="px-8 py-5 text-slate-300 font-medium">
                            {record.Arrest_Date ? new Date(record.Arrest_Date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}
                          </td>
                          <td className="px-8 py-5 text-slate-400">
                            {record.Case_Date ? new Date(record.Case_Date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : "—"}
                          </td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-red-500/10 border-red-500/20 text-red-400">
                              {record.Case_Status || "—"}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-slate-300 whitespace-normal max-w-sm line-clamp-2 leading-relaxed">
                            {record.Case_Description || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCell({ icon: Icon, label, value }: { icon: any; label: string; value?: string }) {
  return (
    <div className="group">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" /> {label}
      </p>
      <p className="text-slate-200 font-medium break-words text-[15px] pl-5 border-l-2 border-slate-800 group-hover:border-blue-500/50 transition-colors">
        {value || "—"}
      </p>
    </div>
  );
}
