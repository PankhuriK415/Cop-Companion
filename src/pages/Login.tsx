import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/apiClient";
import { ArrowLeft } from "lucide-react";
import { CopCompanionLogo } from "../components/logo/CopCompanionLogo";

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
      console.log("[Login] handleDevLogin", selectedRole);
      const account = devAccounts[selectedRole];
      await login(account.username, account.password);
      console.log("[Login] dev login succeeded");
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
    console.log("[Login] handleSubmit called", { username, mode });

    try {
      if (mode === "login") {
        await login(username, password);
        console.log("[Login] login succeeded");
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
    <div className="relative flex justify-center items-center min-h-screen bg-slate-950 px-4 py-6 overflow-hidden selection:bg-blue-500/30">
      {/* Dynamic Background matching Home.tsx */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
      <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />

      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to Portal</span>
      </Link>

      <div
        className="w-full max-w-md relative z-10 animate-fade-in"
        style={{ animationDuration: "0.5s" }}
      >
        {/* Floating icon */}
        <div className="mx-auto flex justify-center mb-4">
          <CopCompanionLogo size={80} animated={true} className="filter drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" />
        </div>

        <div className="glass-dark border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="text-center mb-5">
            <h1 className="text-2xl font-extrabold tracking-wider text-white uppercase" style={{ fontFamily: "'Orbitron', sans-serif" }}>Cop-Companion</h1>
            <p className="text-slate-400 mt-1.5 text-xs tracking-wide">
              Crime Record Management System
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-700/40 p-1 rounded-lg">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3.5 py-2 focus:outline-none focus:border-blue-500 transition text-sm"
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
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3.5 py-2 focus:outline-none focus:border-blue-500 transition text-sm"
                placeholder="Enter your password"
              />
            </div>

            {mode === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3.5 py-2 focus:outline-none focus:border-blue-500 transition text-sm"
                  >
                    <option value="officer">Officer</option>
                    <option value="victim">Victim</option>
                    <option value="criminal">Criminal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">
                    Admin Key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3.5 py-2 focus:outline-none focus:border-blue-500 transition text-sm"
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
              className="w-full group relative overflow-hidden bg-white text-slate-950 font-bold rounded-xl px-4 py-2.5 transition-all hover:bg-slate-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/5 text-sm"
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Sign In"
                  : "Sign Up"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
