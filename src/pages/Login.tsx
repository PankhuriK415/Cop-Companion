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
    <div className="flex items-center justify-center min-h-full px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl">
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
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
              <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-3 transition"
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

          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-xs text-slate-400">
            <p className="font-medium text-slate-300 mb-1">Demo Accounts:</p>
            <p>
              Officer: <span className="text-slate-200">officer1</span> /
              Password@123
            </p>
            <p>
              Victim: <span className="text-slate-200">victim1</span> /
              Password@123
            </p>
            <p>
              Criminal: <span className="text-slate-200">criminal1</span> /
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
