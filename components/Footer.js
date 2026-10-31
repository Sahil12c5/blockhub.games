"use client";

import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, Gamepad2 } from "lucide-react";
import { hubs } from "@/data/hubs";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">

          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 group min-h-[44px]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black text-sm">
                B
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                BLOCK<span className="text-emerald-400">HUB</span>
                <span className="text-xs text-slate-400 font-normal">.GAMES</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier online destination for instant action, car racing, shooting, sports, and puzzle browser games. Play directly in your browser with zero downloads.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400/90 font-medium pt-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>100% Free & Safe Web Games</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Game Categories
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-xs">
              <li>
                <Link href="/category/action" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Action & Combat Games
                </Link>
              </li>
              <li>
                <Link href="/category/racing" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  3D Car Racing & Drifting
                </Link>
              </li>
              <li>
                <Link href="/category/shooting" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Tactical FPS & Shooting
                </Link>
              </li>
              <li>
                <Link href="/category/puzzle" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Brain-Teasers & Logic Puzzles
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Soccer, Basketball & Sports
                </Link>
              </li>
              <li>
                <Link href="/category/multiplayer" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Online Multiplayer & .io
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Game Hubs & Topics */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <Gamepad2 className="h-3.5 w-3.5 text-emerald-400" />
              Popular Game Hubs
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-xs">
              {hubs.map((hub) => (
                <li key={hub.slug}>
                  <Link
                    href={`/tag/${hub.slug}`}
                    className="py-1.5 sm:py-0.5 hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <span>{hub.name} Games</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance (AdSense Critical) */}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Legal & Trust
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-xs">
              <li>
                <Link href="/privacy-policy" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Privacy Policy & Cookies
                </Link>
              </li>
              <li>
                <Link href="/terms" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  DMCA Copyright Notice
                </Link>
              </li>
              <li>
                <Link href="/about" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  About BlockHub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="py-1.5 sm:py-0.5 inline-block hover:text-emerald-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* AdSense & Platform Disclaimer */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Disclaimer
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BlockHub.games is an independent gaming aggregator and portal. &ldquo;Minecraft&rdquo; is a registered trademark of Mojang Synergies AB / Microsoft Corporation. BlockHub.games is not affiliated with, endorsed by, or associated with Mojang or Microsoft.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All hosted HTML5 web games are embedded via authorized publisher distribution licenses (GameMonetize, GameDistribution).
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} BlockHub.games. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500 inline" />
            <span>for voxel and block gaming fans worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
