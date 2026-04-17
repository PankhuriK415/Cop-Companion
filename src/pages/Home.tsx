import { Link } from "react-router-dom";
import { ArrowRight, Shield, Activity, Lock, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />
      
      {/* Animated glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-12 lg:px-12">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          
          {/* Left Column: Copy & Actions */}
          <section className="animate-fade-in relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 px-4 text-sm font-medium text-emerald-300 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors shadow-lg shadow-emerald-900/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next-Gen Police Workspace
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mb-6 drop-shadow-sm font-['Outfit']">
              Solve Cases <br />
              <span className="text-gradient font-black">With Precision.</span>
            </h1>

            <p className="max-w-xl text-lg lg:text-xl text-slate-400 leading-relaxed font-light mb-10">
              The central nervous system for modern law enforcement. Track FIRs, manage evidence, and connect criminal profiles in one intelligent command center. 
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] active:scale-[0.98]"
              >
                <span>Enter Secure Portal</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-4 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all hover:bg-slate-700/50 hover:text-white"
              >
                <span>Preview Dashboard</span>
                <ChevronRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Activity, label: "Live Tracking", desc: "Real-time updates" },
                { icon: Shield, label: "Encrypted", desc: "Military-grade data" },
                { icon: Lock, label: "Role Based", desc: "Hierarchical access" },
              ].map((item) => (
                <div key={item.label} className="group flex flex-col gap-2 rounded-2xl glass-dark p-5 transition-all hover:bg-white/10 hover:-translate-y-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 mb-2 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-200">{item.label}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Right Column: Visuals */}
          <section className="relative hidden w-full lg:flex justify-center items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="relative w-full aspect-square max-w-lg">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-tr from-white/5 to-transparent backdrop-blur-3xl shadow-2xl animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-blue-500/20 animate-[spin_40s_linear_infinite_reverse]" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 glass-dark rounded-[2.5rem] p-8 m-8 overflow-hidden transform transition-transform hover:scale-105 duration-500 border-t-white/20 border-l-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                 <img
                  src="/undraw_judge_hyqv.svg"
                  alt="Law and Order Illustration"
                  className="w-full max-w-[280px] drop-shadow-2xl z-10 relative object-contain hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating UI Elements */}
                <div className="absolute top-10 -right-4 glass px-4 py-2 rounded-lg text-xs font-medium text-emerald-400 shadow-xl flex items-center gap-2 animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Record Matched
                </div>
                
                 <div className="absolute bottom-12 -left-6 glass px-4 py-3 rounded-lg text-xs font-medium text-blue-300 shadow-xl animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                  <div className="text-slate-400 mb-1">Active Warrants</div>
                  <div className="text-lg font-bold text-white">24 Updates</div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
