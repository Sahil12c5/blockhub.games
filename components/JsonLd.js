export function GameJsonLd({ game, baseUrl = "https://blockhub.games" }) {
  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    url: `${baseUrl}/game/${game.slug}`,
    image: `${baseUrl}${game.thumbnail}`,
    genre: [game.category, "Online Game", "HTML5", "Browser Game"],
    gamePlatform: ["Web Browser", "PC", "Mac", "Chromebook"],
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
      ratingValue: game.rating,
      bestRating: "5",
      worstRating: "1",
      ratingCount: "1250",
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
    name: "BlockHub Games",
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
