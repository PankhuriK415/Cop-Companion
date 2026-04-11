import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Navigation Bar */}
        <nav className="bg-slate-950 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-white hover:text-slate-200">
              Case Companion
            </Link>
            <div className="flex gap-6">
              <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
              <Link to="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
              <Link to="/cases" className="text-slate-300 hover:text-white transition">Cases</Link>
              <Link to="/profile" className="text-slate-300 hover:text-white transition">Profile</Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
