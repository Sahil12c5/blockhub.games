import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";
import { Sparkles, Gamepad2, ShieldCheck, Zap, Heart, Trophy } from "lucide-react";

export const metadata = {
  title: "About Us - The Home of Free Voxel Browser Games | BlockHub.games",
  description:
    "Learn about BlockHub.games, our mission, curation standards, and dedication to providing fast, safe, and free voxel and sandbox browser entertainment.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-sm space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Our Mission
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            About BlockHub.games
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Pioneering frictionless, unblocked browser gaming for millions of players across the globe.
          </p>
        </div>

        <section className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-emerald-400" />
            Who We Are
          </h2>
          <p>
            BlockHub.games was established by an independent collective of passionate gamers and web engineers. We observed that finding fast-loading, virus-free, and high-framerate web games without intrusive paywalls or redirects was unnecessarily difficult.
          </p>
          <p>
            We created BlockHub to solve that problem: a clean, lightning-fast game portal featuring the finest 3D car racing, tactical shooters, puzzle challenges, sports showdowns, and multiplayer arenas—optimized for 60 FPS in modern browsers and completely free to play on PC, Mac, and Chromebooks.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Installation</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Every title runs directly inside your browser canvas using WebGL and HTML5 without taking up hard drive space.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Curated Safety</h3>
            <p className="text-xs text-slate-400 leading-normal">
              We rigorously vet all iframe embeds from verified publishers to ensure no malware, intrusive popups, or redirects.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Pure Gameplay</h3>
            <p className="text-xs text-slate-400 leading-normal">
              We reject forced countdown redirect screens, focus-stealing ads, and pay-to-win barriers.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed pt-4 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white">Our Curation Standards</h2>
          <p>
            Not every game makes it onto BlockHub. Every single submission passes through our quality control checklist:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong>Smooth 60 FPS:</strong> Verified performance on standard laptops and educational Chromebooks.
            </li>
            <li>
              <strong>Keyboard Precision:</strong> Responsive WASD controls and accurate first-person mouse look aiming.
            </li>
            <li>
              <strong>Authentic Gameplay:</strong> Rich sandbox depth, creative potential, and engaging progression mechanics.
            </li>
          </ul>
        </section>

        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
          >
            ← Back to All Games
          </Link>
          <Link
            href="/contact"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Have a question? Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}
