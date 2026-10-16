import Link from "next/link";
import { Gamepad2, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10">
        <Gamepad2 className="h-10 w-10 animate-pulse" />
      </div>

      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full mb-3">
        404 ERROR - VOXEL NOT FOUND
      </span>

      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
        Lost in the Void?
      </h1>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The block or stage you were looking for doesn&apos;t exist or has been moved to another coordinate.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Home className="h-4 w-4" />
          Back to Homepage
        </Link>
        <Link
          href="/category/survival"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          <Compass className="h-4 w-4 text-emerald-400" />
          Explore Survival
        </Link>
      </div>
    </div>
  );
}
