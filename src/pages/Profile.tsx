import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const roleLabel: Record<string, string> = {
  officer:  'Police Officer',
  victim:   'Victim',
  criminal: 'Criminal Record',
};

const roleBadgeColor: Record<string, string> = {
  officer:  'bg-blue-900 text-blue-300',
  victim:   'bg-green-900 text-green-300',
  criminal: 'bg-red-900 text-red-300',
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-700 flex items-center justify-center text-2xl font-bold text-white">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-xl font-semibold text-white">{user.username}</div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadgeColor[user.role]}`}>
              {roleLabel[user.role] || user.role}
            </span>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-4 space-y-3">
          <InfoRow label="Username" value={user.username} />
          <InfoRow label="Role" value={roleLabel[user.role] || user.role} />
          <InfoRow label="Account ID" value={user.login_id} mono />
          <InfoRow label="User ID" value={user.user_id} mono />
        </div>

        <div className="border-t border-slate-700 pt-4">
          {user.role === 'officer' && (
            <p className="text-slate-400 text-sm mb-4">
              You have full access to manage cases, criminals, victims, evidence, arrests, FIRs, and stations.
            </p>
          )}
          {user.role === 'victim' && (
            <p className="text-slate-400 text-sm mb-4">
              You can view the FIRs and case details related to you.
            </p>
          )}
          {user.role === 'criminal' && (
            <p className="text-slate-400 text-sm mb-4">
              You can view your arrest records and associated case statuses.
            </p>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2.5 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`text-slate-200 text-sm ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
