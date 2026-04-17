import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/apiClient";

type AuthMode = "login" | "signup";
type UserRole = "officer" | "victim" | "criminal";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("officer");
  const [adminKey, setAdminKey] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const devAccounts: Record<UserRole, { username: string; password: string }> =
    {
      officer: { username: "officer_sharma", password: "Password@123" },
      victim: { username: "victim_amit", password: "Password@123" },
      criminal: { username: "criminal_rajan", password: "Password@123" },
    };

  const handleDevLogin = async (selectedRole: UserRole) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const account = devAccounts[selectedRole];
      await login(account.username, account.password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Dev login failed. Check demo account data in database.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(username, password);
        navigate("/dashboard");
      } else {
        await api.post("/auth/signup", {
          username,
          password,
          role,
          admin_key: adminKey,
        });
        setSuccess("Signup successful. You can now sign in.");
        setPassword("");
        setAdminKey("");
        setMode("login");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (mode === "login"
          ? "Login failed. Please check your credentials."
          : "Signup failed. Please check your details.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-slate-950 px-4 py-12 overflow-hidden selection:bg-blue-500/30">
      
      {/* Dynamic Background matching Home.tsx */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to Portal</span>
      </Link>

      <div className="w-full max-w-md relative z-10 animate-fade-in" style={{ animationDuration: "0.5s" }}>
        {/* Floating icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-8 transform -rotate-6 hover:rotate-0 transition-transform">
          <ShieldAlert className="h-8 w-8 text-white" />
        </div>

        <div className="glass-dark border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Case Companion</h1>
            <p className="text-slate-400 mt-2">
              Crime Record Management System
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6 bg-slate-700/40 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-300 hover:bg-slate-700"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-slate-300 hover:bg-slate-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
                placeholder="Enter your password"
              />
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="officer">Officer</option>
                    <option value="victim">Victim</option>
                    <option value="criminal">Criminal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Admin Key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition"
                    placeholder="Enter admin key"
                  />
                </div>
              </>
            )}

            {success && (
              <div className="bg-green-900/40 border border-green-700 text-green-300 rounded-lg px-4 py-3 text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2 animate-[slide-in_0.2s_ease-out]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-white text-slate-950 font-bold rounded-xl px-4 py-3.5 transition-all hover:bg-slate-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/5"
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign In"
                  : "Sign Up"}
            </button>

            {mode === "login" && (
              <div className="pt-1">
                <p className="text-xs font-medium text-slate-300 mb-2">
                  Quick Dev Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleDevLogin("officer")}
                    className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/60 disabled:cursor-not-allowed text-slate-100 rounded-lg px-3 py-2 text-xs font-medium transition"
                  >
                    Officer
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleDevLogin("victim")}
                    className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/60 disabled:cursor-not-allowed text-slate-100 rounded-lg px-3 py-2 text-xs font-medium transition"
                  >
                    Victim
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleDevLogin("criminal")}
                    className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/60 disabled:cursor-not-allowed text-slate-100 rounded-lg px-3 py-2 text-xs font-medium transition"
                  >
                    Criminal
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-xs text-slate-400">
            <p className="font-medium text-slate-300 mb-1">Demo Accounts:</p>
            <p>
              Officer: <span className="text-slate-200">officer_sharma</span> /
              Password@123
            </p>
            <p>
              Victim: <span className="text-slate-200">victim_amit</span> /
              Password@123
            </p>
            <p>
              Criminal: <span className="text-slate-200">criminal_rajan</span> /
              Password@123
            </p>
            <p className="mt-2">
              Signup requires admin key:{" "}
              <span className="text-slate-200">123456</span>
            </p>
            <p className="mt-1">No role record ID needed anymore.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
