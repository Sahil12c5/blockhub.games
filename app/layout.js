import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-XXXXXXXXXXXXXXXX";

export const metadata = {
  metadataBase: new URL("https://blockhub.games"),
  title: {
    default: "BlockHub.games - Free Online HTML5 Browser Games (Poki & CrazyGames Style)",
    template: "%s | BlockHub.games",
  },
  description:
    "Play thousands of free online games unblocked at BlockHub.games. Featuring 3D car racing, tactical FPS shooting, sports, brain puzzles, action battles, and adventure games. Zero downloads.",
  keywords: [
    "free online games",
    "html5 games",
    "browser games",
    "car racing games",
    "fps shooting games",
    "sports games online",
    "puzzle games",
    "unblocked games",
    "poki games",
    "crazy games",
    "blockhub games",
  ],
  authors: [{ name: "BlockHub Games" }],
  creator: "BlockHub Games",
  publisher: "BlockHub Games",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://blockhub.games",
    siteName: "BlockHub.games",
    title: "BlockHub.games - Play Free Online HTML5 Browser Games",
    description:
      "Play popular online games across Racing, Shooting, Action, Puzzle, Sports, and Adventure for free. Instant play, ad-friendly, zero downloads.",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "BlockHub.games Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlockHub.games - Free Online Browser Games",
    description:
      "Play popular online games across Racing, Shooting, Action, Puzzle, Sports, and Adventure for free.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        {/* Google AdSense Script (only injected when real publisher ID is registered) */}
        {ADSENSE_CLIENT_ID && ADSENSE_CLIENT_ID !== "ca-pub-XXXXXXXXXXXXXXXX" && (
          <Script
            id="adsense-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
