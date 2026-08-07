import { Link } from "react-router-dom";
import { ArrowRight, Shield, Activity, Lock, ChevronRight } from "lucide-react";
import { CopCompanionLogo } from "../components/logo/CopCompanionLogo";

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
          <section className="animate-fade-in relative pt-4 lg:pt-8">
            {/* Logo and COP-COMPANION as main heading */}
            <div className="flex items-center gap-3 mb-4 select-none whitespace-nowrap">
              <CopCompanionLogo
                size={46}
                animated={true}
                glow={true}
                className="flex-shrink-0 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
              />
              <h1
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-[0.12em] uppercase transition-colors duration-500 whitespace-nowrap"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Orbitron', 'Syncopate', sans-serif",
                  textShadow: "0 0 10px rgba(255, 255, 255, 0.08), 0 0 20px var(--accent-custom-glow)",
                }}
              >
                COP-COMPANION
              </h1>
            </div>

            {/* Subheading */}
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-wide text-gradient mb-4 font-['Outfit']">
              Solve Cases With Precision.
            </h2>

            {/* Paragraph */}
            <p className="max-w-xl text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed font-light mb-8">
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

            <div className="mt-20 flex flex-wrap gap-4">
              {[
                { icon: Activity, label: "Live Tracking", desc: "Real-time updates" },
                { icon: Shield, label: "Encrypted", desc: "Military-grade data" },
                { icon: Lock, label: "Role Based", desc: "Hierarchical access" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group flex flex-col gap-1.5 rounded-xl glass-dark p-3.5 sm:p-4 transition-all hover:bg-white/10 hover:-translate-y-1 w-[135px] sm:w-[145px] flex-shrink-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 mb-1 group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-200">{item.label}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">{item.desc}</p>
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
              
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 m-8 overflow-hidden transform transition-transform hover:scale-105 duration-500">
                 <img
                  src="/undraw_judge_hyqv.svg"
                  alt="Law and Order Illustration"
                  className="w-full max-w-[340px] drop-shadow-2xl z-10 relative object-contain hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
