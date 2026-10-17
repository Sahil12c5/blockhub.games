import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-9415893623013266";

export const metadata = {
  metadataBase: new URL("https://blockhub.games"),
  title: {
    default: "BlockHub.games - Play Free Online Browser Games",
    template: "%s | BlockHub.games",
  },
  description:
    "Play thousands of free online browser games at BlockHub.games. Enjoy instant action, 3D car racing, tactical FPS shooting, and puzzles with zero downloads.",
  keywords: [
    "free online games",
    "html5 games",
    "browser games",
    "car racing games",
    "fps shooting games",
    "sports games online",
    "puzzle games",
    "unblocked games",
    "online games free",
    "action games",
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
    title: "BlockHub.games - Play Free Online Browser Games",
    description:
      "Play thousands of free online browser games at BlockHub.games. Enjoy instant action, 3D car racing, tactical FPS shooting, and puzzles with zero downloads.",
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
    title: "BlockHub.games - Play Free Online Browser Games",
    description:
      "Play thousands of free online browser games at BlockHub.games. Enjoy instant action, 3D car racing, tactical FPS shooting, and puzzles with zero downloads.",
    images: ["/logo.svg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48 32x32 16x16", type: "image/x-icon" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        {/* Resource Preconnects for CDN & Game Iframes to improve LCP & Core Web Vitals */}
        <link rel="preconnect" href="https://img.gamemonetize.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://html5.gamemonetize.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.gamemonetize.com" />
        <link rel="dns-prefetch" href="https://html5.gamemonetize.co" />

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
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
