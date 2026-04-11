import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-white mb-6">Case Companion</h1>
        <p className="text-xl text-slate-300 mb-8">
          Your comprehensive case management solution for organizing, tracking,
          and managing legal cases efficiently.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/cases"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
          >
            View Cases
          </Link>
        </div>
      </div>
    </div>
  );
}
