import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, Lock, Loader2, Zap } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<
    "email" | "phone" | "employee" | "google" | "microsoft" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
    employeeId: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const demoUsers = [
    {
      name: "John Doe",
      role: "Senior Lawyer",
      email: "john.doe@law.com",
      id: "EMP-2024-001",
    },
    {
      name: "Sarah Smith",
      role: "Case Manager",
      email: "sarah.smith@law.com",
      id: "EMP-2024-002",
    },
    {
      name: "Mike Johnson",
      role: "Legal Assistant",
      email: "mike.johnson@law.com",
      id: "EMP-2024-003",
    },
    {
      name: "Emma Davis",
      role: "Admin",
      email: "emma.davis@law.com",
      id: "EMP-2024-004",
    },
    {
      name: "Robert Wilson",
      role: "Paralegal",
      email: "robert.wilson@law.com",
      id: "EMP-2024-005",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const handleDemoLogin = (user: (typeof demoUsers)[0]) => {
    setLoading(true);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: user.name,
        role: user.role,
        email: user.email,
        employeeId: user.id,
      }),
    );
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Case Companion</h1>
          <p className="text-xl text-slate-300">
            Secure case management for legal professionals
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Enterprise Security
              </h3>
              <p className="text-slate-400">
                End-to-end encryption for all case data
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Multiple Login Options
              </h3>
              <p className="text-slate-400">
                Choose your preferred authentication method
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <Phone className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Always Connected
              </h3>
              <p className="text-slate-400">
                Access your cases anytime, anywhere
              </p>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          © 2024 Case Companion. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-800 flex flex-col items-center justify-center p-6 overflow-auto">
        <div className="w-full max-w-md py-4">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Choose your login method</p>
          </div>

          {!loginMethod ? (
            // Login Method Selection
            <div className="space-y-3">
              {/* Demo Access Section */}
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={18} className="text-yellow-400" />
                  <h3 className="font-semibold text-yellow-200">
                    🧪 Dev Testing - Quick Access
                  </h3>
                </div>
                <p className="text-yellow-200 text-sm mb-3">
                  Select a personnel to test:
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {demoUsers.map((user, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDemoLogin(user)}
                      disabled={loading}
                      className="w-full p-2 bg-yellow-800 hover:bg-yellow-700 text-yellow-100 rounded text-sm transition disabled:opacity-50 text-left"
                    >
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-yellow-200">
                        {user.role} • {user.id}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">
                    Or use standard login
                  </span>
                </div>
              </div>

              <button
                onClick={() => setLoginMethod("email")}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Mail size={20} />
                  <span>Email & Password</span>
                </div>
                <span className="text-slate-400 group-hover:text-white transition">
                  →
                </span>
              </button>

              <button
                onClick={() => setLoginMethod("phone")}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Phone size={20} />
                  <span>Phone OTP</span>
                </div>
                <span className="text-slate-400 group-hover:text-white transition">
                  →
                </span>
              </button>

              <button
                onClick={() => setLoginMethod("employee")}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Lock size={20} />
                  <span>Employee ID</span>
                </div>
                <span className="text-slate-400 group-hover:text-white transition">
                  →
                </span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOAuthLogin("google")}
                className="w-full p-4 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

              <button
                onClick={() => handleOAuthLogin("microsoft")}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                Microsoft
              </button>
            </div>
          ) : loginMethod === "email" ? (
            // Email Login
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod(null)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            </form>
          ) : loginMethod === "phone" ? (
            // Phone OTP Login
            <form
              onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
              className="space-y-4"
            >
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-green-900 text-green-200 p-3 rounded-lg text-sm">
                    ✓ OTP sent to {formData.phone}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setLoginMethod(null);
                  setOtpSent(false);
                  setFormData({ ...formData, phone: "", otp: "" });
                }}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            </form>
          ) : loginMethod === "employee" ? (
            // Employee ID Login
            <form onSubmit={handleEmployeeLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="EMP-2024-001"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  PIN
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod(null)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            </form>
          ) : null}

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<
    "email" | "phone" | "employee" | "google" | "microsoft" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
    employeeId: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    setLoading(true);
    // Simulate OAuth login
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12">
        <div>
          <h1 className="text-5xl font-bold text-white mb-4">Case Companion</h1>
          <p className="text-xl text-slate-300">
            Secure case management for legal professionals
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Lock className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Enterprise Security
              </h3>
              <p className="text-slate-400">
                End-to-end encryption for all case data
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Multiple Login Options
              </h3>
              <p className="text-slate-400">
                Choose your preferred authentication method
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <Phone className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Always Connected
              </h3>
              <p className="text-slate-400">
                Access your cases anytime, anywhere
              </p>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          © 2024 Case Companion. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-slate-800 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Choose your login method</p>
          </div>

          {!loginMethod ? (
            // Login Method Selection
            <div className="space-y-3">
              <button
                onClick={() => setLoginMethod("email")}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Mail size={20} />
                  <span>Email & Password</span>
                </div>
                <span className="text-slate-400 group-hover:text-white transition">
                  →
                </span>
              </button>

              <button
                onClick={() => setLoginMethod("phone")}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Phone size={20} />
                  <span>Phone OTP</span>
                </div>
                <span className="text-slate-400 group-hover:text-white transition">
                  →
                </span>
              </button>

              <button
                onClick={() => setLoginMethod("employee")}
                className="w-full p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Lock size={20} />
                  <span>Employee ID</span>
                </div>
                <span className="text-slate-400 group-hover:text-white transition">
                  →
                </span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleOAuthLogin("google")}
                className="w-full p-4 bg-white hover:bg-slate-100 text-slate-900 rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>

              <button
                onClick={() => handleOAuthLogin("microsoft")}
                className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                Microsoft
              </button>
            </div>
          ) : loginMethod === "email" ? (
            // Email Login
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod(null)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            </form>
          ) : loginMethod === "phone" ? (
            // Phone OTP Login
            <form
              onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
              className="space-y-4"
            >
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-green-900 text-green-200 p-3 rounded-lg text-sm">
                    ✓ OTP sent to {formData.phone}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading && <Loader2 size={20} className="animate-spin" />}
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setLoginMethod(null);
                  setOtpSent(false);
                  setFormData({ ...formData, phone: "", otp: "" });
                }}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            </form>
          ) : loginMethod === "employee" ? (
            // Employee ID Login
            <form onSubmit={handleEmployeeLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="EMP-2024-001"
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  PIN
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none text-center text-2xl tracking-widest"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading && <Loader2 size={20} className="animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setLoginMethod(null)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            </form>
          ) : null}

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
