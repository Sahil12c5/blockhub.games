import { notFound } from "next/navigation";
import Link from "next/link";
import { hubs, getAllHubs, getHubBySlug, getGamesForHub } from "@/data/hubs";
import { getAllGames } from "@/data/games";
import GameCard from "@/components/GameCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdSlot from "@/components/AdSlot";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import {
  Car,
  Truck,
  Users,
  CircleDot,
  Gamepad2,
  Compass,
  Target,
  Trophy,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export function generateStaticParams() {
  const allHubs = getAllHubs();
  return allHubs.map((hub) => ({
    tag: hub.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const hub = getHubBySlug(tag);

  if (!hub) {
    return {
      title: "Tag Not Found",
    };
  }

  const title = `${hub.name} Games - Play Free Online`;
  const description = hub.metaDescription;

  return {
    title,
    description,
    keywords: hub.seoKeywords || [
      `${hub.name.toLowerCase()} games`,
      `free ${hub.name.toLowerCase()} games`,
      `play ${hub.name.toLowerCase()} games online`,
    ],
    alternates: {
      canonical: `https://blockhub.games/tag/${hub.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://blockhub.games/tag/${hub.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TagHubPage({ params }) {
  const { tag } = await params;
  const hub = getHubBySlug(tag);

  if (!hub) {
    notFound();
  }

  const allGames = getAllGames();
  const hubGames = getGamesForHub(hub.slug, allGames, 60);

  const iconMap = {
    "car-parking": Car,
    "truck-driving": Truck,
    stickman: Users,
    "bubble-shooter": CircleDot,
    "2-player": Gamepad2,
    obby: Compass,
    zombie: Target,
    "football-soccer": Trophy,
    halloween: Sparkles,
    christmas: Sparkles,
  };
  const HubIcon = iconMap[hub.slug] || Gamepad2;

  // JSON-LD CollectionPage & FAQPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${hub.name} Games - Play Free Online`,
    description: hub.metaDescription,
    url: `https://blockhub.games/tag/${hub.slug}`,
    inLanguage: "en",
    about: {
      "@type": "Thing",
      name: `${hub.name} Games`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="space-y-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BreadcrumbJsonLd
        items={[
          {
            label: `${hub.name} Games`,
            href: `/tag/${hub.slug}`,
          },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: `${hub.name} Games` }]} />

      {/* Top Banner AdSense Slot */}
      <AdSlot
        slotId="4000000001"
        format="horizontal"
        className="w-full max-w-5xl mx-auto"
        label="Top Topic Advertisement"
      />

      {/* Hero Header & 150+ Words Original SEO Content */}
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <HubIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Curated Game Hub
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {hub.name} Games - Play Free Online
          </h1>

          {/* 150+ Words Original SEO Content */}
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line pt-1">
            {hub.intro}
          </div>

          <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
            <span>
              Showing <strong className="text-white">{hubGames.length}</strong> games
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">100% Free to Play</span>
            <span>•</span>
            <span>No Downloads Needed</span>
          </div>
        </div>
      </section>

      {/* Mid-Page AdSlot */}
      <AdSlot
        slotId="4000000002"
        format="horizontal"
        className="w-full max-w-4xl mx-auto my-6"
        label="Sponsored Placement"
      />

      {/* Games Grid for This Topic Hub */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">
            All {hub.name} Games ({hubGames.length})
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by Popularity
          </span>
        </div>

        {hubGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {hubGames.map((game) => (
              <GameCard key={game.slug} game={game} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
            No games found in this topic yet. Check back soon!
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm space-y-4">
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-cyan-400" />
          {hub.name} Games FAQ
        </h2>
        <div className="space-y-4">
          {hub.faq.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
            >
              <h3 className="text-sm font-bold text-white mb-1.5 flex items-start gap-2">
                <span className="text-emerald-400 font-mono">Q:</span>
                <span>{item.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Other Topic Hubs Chips */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Explore Other Popular Game Hubs
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {hubs
            .filter((h) => h.slug !== hub.slug)
            .map((h) => (
              <Link
                key={h.slug}
                href={`/tag/${h.slug}`}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
              >
                {h.name} Games →
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
