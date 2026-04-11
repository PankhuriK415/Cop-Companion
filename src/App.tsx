import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login     from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases     from "./pages/Cases";
import Criminals from "./pages/Criminals";
import Victims   from "./pages/Victims";
import Evidence  from "./pages/Evidence";
import Arrests   from "./pages/Arrests";
import FIRs      from "./pages/FIRs";
import Profile   from "./pages/Profile";

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isActive = (path: string) =>
    location.pathname === path ? "text-white font-semibold" : "text-slate-400 hover:text-white transition";

  if (!user) return null;

  return (
    <nav className="bg-slate-950 border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-white hover:text-slate-200">
          Case Companion
        </Link>
        <div className="flex gap-5 text-sm items-center">
          <Link to="/dashboard" className={isActive("/dashboard")}>Dashboard</Link>

          {/* Officer-only nav items */}
          {user.role === "officer" && (
            <>
              <Link to="/cases"     className={isActive("/cases")}>Cases</Link>
              <Link to="/criminals" className={isActive("/criminals")}>Criminals</Link>
              <Link to="/victims"   className={isActive("/victims")}>Victims</Link>
              <Link to="/evidence"  className={isActive("/evidence")}>Evidence</Link>
              <Link to="/arrests"   className={isActive("/arrests")}>Arrests</Link>
              <Link to="/firs"      className={isActive("/firs")}>FIRs</Link>
            </>
          )}

          <Link to="/profile" className={isActive("/profile")}>Profile</Link>

          <button
            onClick={() => { logout(); window.location.href = "/login"; }}
            className="text-slate-400 hover:text-red-400 transition text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
      <NavBar />
      <div className="flex-1 overflow-auto">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

          {/* All authenticated routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Officer-only routes */}
          <Route path="/cases"     element={<ProtectedRoute roles={["officer"]}><Cases /></ProtectedRoute>} />
          <Route path="/criminals" element={<ProtectedRoute roles={["officer"]}><Criminals /></ProtectedRoute>} />
          <Route path="/victims"   element={<ProtectedRoute roles={["officer"]}><Victims /></ProtectedRoute>} />
          <Route path="/evidence"  element={<ProtectedRoute roles={["officer"]}><Evidence /></ProtectedRoute>} />
          <Route path="/arrests"   element={<ProtectedRoute roles={["officer"]}><Arrests /></ProtectedRoute>} />
          <Route path="/firs"      element={<ProtectedRoute roles={["officer"]}><FIRs /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
