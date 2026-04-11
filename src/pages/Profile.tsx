export default function Profile() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white font-bold">JD</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">John Doe</h2>
              <p className="text-slate-400">Senior Case Manager</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-t border-slate-700 pt-4">
              <label className="text-slate-400 text-sm">Email</label>
              <p className="text-white font-semibold">john.doe@casesystem.com</p>
            </div>
            
            <div className="border-t border-slate-700 pt-4">
              <label className="text-slate-400 text-sm">Department</label>
              <p className="text-white font-semibold">Legal Affairs</p>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <label className="text-slate-400 text-sm">Cases Managed</label>
              <p className="text-white font-semibold">24 Active Cases</p>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <label className="text-slate-400 text-sm">Member Since</label>
              <p className="text-white font-semibold">January 2024</p>
            </div>
          </div>
        </div>

        <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
          Edit Profile
        </button>
        <button className="w-full mt-3 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
          Logout
        </button>
      </div>
    </div>
  );
}
