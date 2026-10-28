export function GameJsonLd({ game, baseUrl = "https://blockhub.games" }) {
  const imageUrl = game.thumbnail?.startsWith("http")
    ? game.thumbnail
    : `${baseUrl}${game.thumbnail}`;

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    url: `${baseUrl}/game/${game.slug}`,
    image: imageUrl,
    genre: [game.category, "Online Game", "HTML5", "Browser Game"],
    gamePlatform: ["Web browser", "PC", "Mac", "Chromebook", "Mobile"],
    applicationCategory: "Game",
    operatingSystem: "Any",
    playMode: "MultiPlayer, SinglePlayer",
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "380",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema =
    game.faq && game.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: game.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

export function WebsiteJsonLd({ baseUrl = "https://blockhub.games" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BlockHub",
    alternateName: ["Block Hub", "BlockHub Games", "BlockHub.games"],
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd({ baseUrl = "https://blockhub.games" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BlockHub",
    alternateName: ["Block Hub", "BlockHub Games"],
    url: baseUrl,
    logo: `${baseUrl}/logo.svg`,
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items = [], baseUrl = "https://blockhub.games" }) {
  if (!items || items.length === 0) return null;

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
    ...items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: item.label,
      item: item.href ? (item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`) : undefined,
    })),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CategoryJsonLd({ category, baseUrl = "https://blockhub.games" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Free ${category.name} Games Online - BlockHub.games`,
    description: category.description,
    url: `${baseUrl}/category/${category.slug}`,
    inLanguage: "en",
    about: {
      "@type": "Thing",
      name: `${category.name} Games`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1450",
      bestRating: "5",
      worstRating: "1",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

