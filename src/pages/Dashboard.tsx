export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Total Cases</div>
          <div className="text-3xl font-bold text-white">24</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Open Cases</div>
          <div className="text-3xl font-bold text-blue-400">12</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Closed Cases</div>
          <div className="text-3xl font-bold text-green-400">10</div>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="text-slate-400 text-sm mb-2">Pending Review</div>
          <div className="text-3xl font-bold text-yellow-400">2</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="text-slate-400">
          <p className="mb-2">• Case #2024-001 status updated to "In Progress"</p>
          <p className="mb-2">• New document added to Case #2024-003</p>
          <p>• Team member assigned to Case #2024-005</p>
        </div>
      </div>
    </div>
  );
}
