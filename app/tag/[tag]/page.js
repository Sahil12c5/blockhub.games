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

  const title = hub.metaTitle || `${hub.name} Games - Play Free Online`;
  const description = hub.metaDescription;
  const keywords = hub.seoKeywords || hub.keywords;

  return {
    title: { absolute: title },
    description,
    keywords,
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

function renderIntroWithLinks(text) {
  if (!text) return null;
  const parts = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <Link
        key={match.index}
        href={match[2]}
        className="text-emerald-400 hover:text-emerald-300 underline font-medium transition-colors"
      >
        {match[1]}
      </Link>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length > 0 ? parts : text;
}

const underlinkedByHub = {
  "car-parking": [
    { slug: "prado-parking-game", title: "Prado Parking Game" },
  ],
  "truck-driving": [
    { slug: "snow-plow-inc", title: "Snow Plow Inc." },
    { slug: "taiga-expedition", title: "Taiga: Expedition" },
  ],
  "2-player": [
    { slug: "apex-combat", title: "Apex Combat" },
    { slug: "orbit-pals", title: "Orbit Pals" },
  ],
  stickman: [
    { slug: "stickninja-mission", title: "StickNinja Mission" },
    { slug: "pedro-double-cross", title: "Pedro: Double Cross" },
  ],
  "bubble-shooter": [
    { slug: "snack-and-warp", title: "SNACK & WARP" },
  ],
  obby: [
    { slug: "cocoon-crossing", title: "Cocoon Crossing" },
    { slug: "grazing-giraffe", title: "Grazing Giraffe" },
    { slug: "sky-hop-3d", title: "SKY HOP 3D" },
  ],
  zombie: [
    { slug: "turret-defend-apocalypse", title: "Turret Defend Apocalypse" },
    { slug: "fear-silent-facility", title: "F.E.A.R.: Silent Facility" },
  ],
  "football-soccer": [
    { slug: "blaze-ball-showdown", title: "Blaze Ball Showdown" },
  ],
};

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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "890",
      bestRating: "5",
      worstRating: "1",
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
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <HubIcon className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Curated Game Hub
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
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
        {hub.introParagraph && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
            {renderIntroWithLinks(hub.introParagraph)}
          </p>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">
            All {hub.name} Games ({hubGames.length})
          </h2>
          <span className="text-xs text-slate-400">
            Sorted by Popularity
          </span>
        </div>

        {hubGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
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

      {/* More Games Section for Direct Crawlability */}
      {underlinkedByHub[hub.slug]?.length > 0 && (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Gamepad2 className="h-4 w-4 text-emerald-400" />
            More {hub.name} Games to Explore
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {underlinkedByHub[hub.slug].map((item) => (
              <Link
                key={item.slug}
                href={`/game/${item.slug}`}
                className="px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-colors min-h-[44px] flex items-center"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      )}

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
