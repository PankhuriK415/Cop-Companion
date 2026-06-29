import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/loader/LoadingScreen";
import { CopCompanionLogo } from "./components/logo/CopCompanionLogo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Criminals from "./pages/Criminals";
import Victims from "./pages/Victims";
import Evidence from "./pages/Evidence";
import Arrests from "./pages/Arrests";
import FIRs from "./pages/FIRs";
import Profile from "./pages/Profile";

function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/40 px-6 py-3 font-medium">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
        >
          <CopCompanionLogo size={32} animated={false} glow={true} className="mr-0.5" />
          Cop-<span className="font-light text-slate-300">Companion</span>
        </Link>
        
        <div className="flex gap-1 text-sm items-center bg-slate-900/50 p-1 rounded-full border border-white/5">
          <Link 
            to="/dashboard" 
            className={`px-4 py-1.5 rounded-full transition-all ${isActive("/dashboard") ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
          >
            Dashboard
          </Link>

          {/* Officer-only nav items */}
          {user.role === "officer" && (
            <>
              <div className="w-px h-4 bg-slate-700 mx-1"></div>
              {["/cases", "/criminals", "/victims", "/evidence", "/arrests", "/firs"].map(path => (
                <Link 
                  key={path}
                  to={path} 
                  className={`px-4 py-1.5 rounded-full transition-all capitalize ${isActive(path) ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
                >
                  {path.substring(1)}
                </Link>
              ))}
            </>
          )}

          <div className="w-px h-4 bg-slate-700 mx-1"></div>
          <Link 
            to="/profile" 
            className={`px-4 py-1.5 rounded-full transition-all ${isActive("/profile") ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
          >
            Profile
          </Link>
        </div>

        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
          className="group flex items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm text-slate-300 transition-all hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-950">
      <AnimatePresence>
        {(isLoading || !loadingComplete) && (
          <motion.div
            key="loading-screen-container"
            className="absolute inset-0 z-50 w-full min-h-screen flex flex-col"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <LoadingScreen
              title="Verifying account access"
              subtitle="Checking session security and permissions..."
              progress={progress}
              setProgress={setProgress}
              onLoadingComplete={handleLoadingComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {(!isLoading && loadingComplete) && (
        <motion.div
          key="core-app-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800"
        >
          <NavBar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/dashboard" replace /> : <Home />}
              />

              {/* Public route */}
              <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <Login />}
              />

              {/* All authenticated routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Officer-only routes */}
              <Route
                path="/cases"
                element={
                  <ProtectedRoute roles={["officer"]}>
                    <Cases />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/criminals"
                element={
                  <ProtectedRoute roles={["officer"]}>
                    <Criminals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/victims"
                element={
                  <ProtectedRoute roles={["officer"]}>
                    <Victims />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/evidence"
                element={
                  <ProtectedRoute roles={["officer"]}>
                    <Evidence />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/arrests"
                element={
                  <ProtectedRoute roles={["officer"]}>
                    <Arrests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/firs"
                element={
                  <ProtectedRoute roles={["officer"]}>
                    <FIRs />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route
                path="*"
                element={<Navigate to={user ? "/dashboard" : "/"} replace />}
              />
            </Routes>
          </div>
        </motion.div>
      )}
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
