import Breadcrumbs from "@/components/Breadcrumbs";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service governing the use of the BlockHub.games web portal and free online browser game library.",
  alternates: {
    canonical: "https://blockhub.games/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-10 backdrop-blur-sm space-y-8">
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Legal Terms
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last modified: October 2026
          </p>
        </div>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing <strong>BlockHub.games</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">2. Free Access & Educational / Entertainment Use</h2>
          <p>
            BlockHub.games provides free, unblocked browser gaming content for entertainment purposes. Access to all public games is granted without charge, subscriptions, or forced account creation. We reserve the right to modify, suspend, or discontinue any game or feature at any time without prior notice.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">3. Third-Party Game Embeds & Intellectual Property</h2>
          <p>
            Games hosted on BlockHub.games are provided via authorized web distribution syndication feeds (including GameMonetize and GameDistribution) or are open-source and freely distributable HTML5 games. All game assets, source code, character likenesses, and intellectual property remain the property of their respective creators and copyright owners.
          </p>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Trademark Notice:</strong> &ldquo;Minecraft&rdquo; is a registered trademark of Mojang Synergies AB / Microsoft Corporation. BlockHub.games is an independent portal and is in no way affiliated with, endorsed by, or sponsored by Mojang or Microsoft.
            </div>
          </div>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">4. User Conduct & Acceptable Use</h2>
          <p>
            When utilizing BlockHub.games, you agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>Attempt to reverse-engineer, exploit, or inject malicious code into site infrastructure.</li>
            <li>Use automated scrapers, bots, or unauthorized crawlers to overload server resources.</li>
            <li>Circumvent or tamper with security measures, ad placements, or site functionality.</li>
          </ul>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">5. Disclaimer of Warranties</h2>
          <p>
            BlockHub.games is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We make no representations or warranties of any kind, express or implied, as to the operation of the site, server uptime, or game content accuracy.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold text-white">6. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with applicable standard international internet commerce regulations and laws.
          </p>
        </section>
      </div>
    </div>
  );
}
