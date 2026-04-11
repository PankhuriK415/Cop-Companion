import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";

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
    if (s === "Open") return "bg-blue-900 text-blue-200";
    if (s === "Closed") return "bg-green-900 text-green-200";
    if (s === "Pending Review") return "bg-purple-900 text-purple-200";
    return "bg-yellow-900 text-yellow-200";
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
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">Welcome back, {user?.username}</p>

      {loading ? (
        <div className="text-slate-400">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Cases"
              value={stats.total}
              color="text-white"
            />
            <StatCard
              label="Open Cases"
              value={stats.open}
              color="text-blue-400"
            />
            <StatCard
              label="Closed Cases"
              value={stats.closed}
              color="text-green-400"
            />
            <StatCard
              label="Pending Review"
              value={stats.pending}
              color="text-purple-400"
            />
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
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">
                      Officer
                    </th>
                    <th className="px-6 py-3 text-left text-slate-400 text-sm">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {recent.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-slate-700/50 transition"
                    >
                      <td className="px-6 py-4 text-slate-300 truncate max-w-xs">
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
                        {new Date(c.Case_Date).toLocaleDateString()}
                      </td>
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

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="text-slate-400 text-sm mb-2">{label}</div>
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
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
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
      <p className="text-slate-400 mb-8">Welcome, {user?.username} (Victim)</p>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Victim Record
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoCell label="Name" value={data?.victim?.Victim_Name} />
              <InfoCell label="Gender" value={data?.victim?.Gender} />
              <InfoCell label="Phone" value={data?.victim?.Phone} />
              <InfoCell label="Address" value={data?.victim?.Address} />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Linked Case Records
              </h2>
              <span className="text-slate-400 text-sm">
                {data?.cases?.length ?? 0} total
              </span>
            </div>
            {!data?.cases?.length ? (
              <p className="text-slate-400 p-6">
                No case records found for this victim.
              </p>
            ) : (
              <div className="divide-y divide-slate-700">
                {data.cases.map((record) => (
                  <div key={record.FIR_ID} className="p-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-slate-200 text-sm">
                        FIR Date:{" "}
                        {new Date(record.FIR_Date).toLocaleDateString()}
                      </p>
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-200 w-fit">
                        {record.Case_Status || "Unknown"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <InfoCell
                        label="Case Date"
                        value={
                          record.Case_Date
                            ? new Date(record.Case_Date).toLocaleDateString()
                            : "—"
                        }
                      />
                      <InfoCell
                        label="Police Station"
                        value={record.Station_Name || "—"}
                      />
                      <InfoCell
                        label="Case Description"
                        value={record.Case_Description || "—"}
                      />
                    </div>

                    <div>
                      <h3 className="text-slate-300 text-sm font-medium mb-2">
                        Evidence
                      </h3>
                      {!record.evidence?.length ? (
                        <p className="text-slate-400 text-sm">
                          No evidence linked to this case.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {record.evidence.map((ev) => (
                            <div
                              key={ev.Evidence_ID}
                              className="bg-slate-900/60 border border-slate-700 rounded-md p-3"
                            >
                              <p className="text-slate-200 text-sm font-medium">
                                {ev.Evidence_Type || "Evidence"}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {ev.Evidence_Description || "No description"}
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
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
      <p className="text-slate-400 mb-8">
        Welcome, {user?.username} (Criminal Record)
      </p>
      {loading ? (
        <div className="text-slate-400">Loading...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Criminal Record Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoCell label="Name" value={data?.Criminal_Name} />
              <InfoCell label="Gender" value={data?.Gender} />
              <InfoCell
                label="Date of Birth"
                value={
                  data?.DOB ? new Date(data.DOB).toLocaleDateString() : "—"
                }
              />
              <InfoCell label="Address" value={data?.Address} />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Arrest and Case History
              </h2>
              <span className="text-slate-400 text-sm">
                {data?.cases?.length ?? 0} total
              </span>
            </div>
            {!data?.cases?.length ? (
              <p className="text-slate-400 p-6">
                No arrest records found for this criminal.
              </p>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-900 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-slate-300 text-sm">
                      Arrest Date
                    </th>
                    <th className="px-6 py-3 text-left text-slate-300 text-sm">
                      Case Date
                    </th>
                    <th className="px-6 py-3 text-left text-slate-300 text-sm">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-slate-300 text-sm">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {data.cases.map((record) => (
                    <tr
                      key={record.Arrest_ID}
                      className="hover:bg-slate-700/50 transition"
                    >
                      <td className="px-6 py-4 text-slate-300">
                        {record.Arrest_Date
                          ? new Date(record.Arrest_Date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {record.Case_Date
                          ? new Date(record.Case_Date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {record.Case_Status || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-300 max-w-sm">
                        {record.Case_Description || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-slate-400">{label}</p>
      <p className="text-slate-200 font-medium break-words">{value || "—"}</p>
    </div>
  );
}
