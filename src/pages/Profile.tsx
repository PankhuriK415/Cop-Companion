import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, AlertTriangle, Fingerprint, LogOut } from 'lucide-react';

const roleLabel: Record<string, string> = {
  officer:  'Police Officer',
  victim:   'Victim',
  criminal: 'Known Criminal',
};

const roleBadgeColor: Record<string, string> = {
  officer:  'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  victim:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  criminal: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

const roleIcon: Record<string, React.ReactNode> = {
  officer: <Shield className="h-5 w-5 text-blue-400" />,
  victim: <AlertTriangle className="h-5 w-5 text-emerald-400" />,
  criminal: <Fingerprint className="h-5 w-5 text-red-400" />
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 p-6 md:p-12 relative overflow-hidden font-sans flex items-center justify-center selection:bg-blue-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg mx-auto animate-fade-in">
        
        <div className="glass-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8">
          
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl shadow-blue-500/20">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 p-2 bg-slate-900 rounded-full border border-slate-700 shadow-xl">
                 {roleIcon[user.role] || <User className="h-5 w-5 text-slate-400" />}
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight font-['Outfit']">{user.username}</h1>
              <div className="mt-2 text-center">
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm inline-flex items-center gap-2 ${roleBadgeColor[user.role]}`}>
                   {roleLabel[user.role] || user.role}
                 </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Metadata</h3>
            <InfoRow label="Access Role" value={roleLabel[user.role] || user.role} />
            <InfoRow label="Authentication ID" value={user.login_id} mono />
            <InfoRow label="System User ID" value={user.user_id} mono />
            
            <div className="pt-4 mt-2 border-t border-white/10">
               {user.role === 'officer' && (
                 <p className="text-slate-300 text-sm leading-relaxed">
                   Authorized personnel. You have full systemic clearance to manage cases, view registries, handle evidence, and file FIRs.
                 </p>
               )}
               {user.role === 'victim' && (
                 <p className="text-slate-300 text-sm leading-relaxed">
                   You have portal access to actively view your filed FIRs and correspond with the resolution of linked cases.
                 </p>
               )}
               {user.role === 'criminal' && (
                 <p className="text-slate-300 text-sm leading-relaxed">
                   Restricted access. You can view your arrest records and judicial case standings assigned to your profile.
                 </p>
               )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 font-bold rounded-xl py-3.5 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" /> Terminate Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-slate-400 text-sm font-medium">{label}</span>
      <span className={`text-slate-200 text-sm font-medium bg-slate-900/50 px-3 py-1 rounded-lg border border-white/5 ${mono ? 'font-mono text-xs tracking-wider text-blue-300' : ''}`}>
        {value}
      </span>
    </div>
  );
}
