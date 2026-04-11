import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0d1a2d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(56,189,248,0.25),transparent_34%),radial-gradient(circle_at_88%_4%,rgba(15,23,42,0.45),transparent_42%),linear-gradient(180deg,#0d1a2d_0%,#111f37_50%,#0f172a_100%)]" />
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(transparent_35px,rgba(148,163,184,0.18)_36px),linear-gradient(90deg,transparent_35px,rgba(148,163,184,0.16)_36px)] bg-[size:36px_36px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 py-12 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <section>
            <p className="inline-block rounded-full border border-cyan-200/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
              Case Intelligence Workspace
            </p>

            <h1 className="mt-5 font-[Merriweather] text-4xl leading-tight text-white md:text-6xl">
              Professional Criminal Case Management for Modern Police Units
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              Track FIRs, evidence, arrests, victims, and criminal records in
              one secure command center built for operational clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/login"
                className="rounded-lg bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Enter Secure Portal
              </Link>
              <Link
                to="/dashboard"
                className="rounded-lg border border-slate-500/70 bg-slate-900/30 px-7 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-300 hover:text-white"
              >
                Open Dashboard
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Case Visibility", value: "End-to-end status views" },
                { label: "Faster Filing", value: "Integrated FIR workflows" },
                { label: "Secure Access", value: "Role-based control" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-slate-700/80 bg-slate-900/45 p-4"
                >
                  <p className="text-sm font-semibold text-slate-100">
                    {item.label}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="relative flex justify-center lg:justify-end">
            <div className="absolute -top-8 right-4 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative w-full max-w-xl rounded-2xl border border-slate-700/80 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-sm">
              <img
                src="/judge.svg"
                alt="Judge illustration representing justice and law"
                className="mx-auto w-full max-w-md object-contain"
              />

              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-cyan-200">
                  Operational Confidence
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Every record is organized for quick review, accurate
                  reporting, and accountable decisions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
