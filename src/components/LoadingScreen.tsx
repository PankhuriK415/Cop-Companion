interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
}

export default function LoadingScreen({
  title = "Preparing secure workspace",
  subtitle = "Loading records, role access, and dashboard context...",
}: LoadingScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1a2d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(43,108,176,0.28),transparent_46%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.18),transparent_45%)]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_31px,rgba(148,163,184,0.25)_32px),linear-gradient(90deg,transparent_31px,rgba(148,163,184,0.2)_32px)] bg-[size:32px_32px]" />

      <img
        src="/judge.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 w-[28rem] max-w-[70vw] opacity-20"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900/70 p-8 backdrop-blur">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-12 w-12">
              <span className="absolute inset-0 rounded-full border-2 border-cyan-300/40" />
              <span className="absolute inset-1 rounded-full border-2 border-transparent border-t-cyan-300 animate-spin" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-wide">
                Case Companion
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">
                Justice Data Platform
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-700/80">
            <div className="loading-bar h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
