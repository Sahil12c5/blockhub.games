# 🟩 BlockHub.games - HTML5 Voxel & Block Game Portal

**BlockHub.games** is a high-performance, AdSense-ready browser gaming portal built with **Next.js (App Router)** and **Tailwind CSS**. Focused on voxel, Minecraft-style survival, parkour obbies, competitive bedwars, and creative building sandboxes, the portal delivers an unblocked, 60 FPS arcade experience with zero downloads.

---

## 🌟 Key Features

- **⚡ Next.js App Router (SSG / Static Pre-rendering)**: All 16 game pages and category routes are statically generated (`generateStaticParams`) for instant load times and optimal SEO.
- **🛡️ Google AdSense-Ready Architecture**:
  - Reusable `<AdSlot />` component with responsive horizontal, vertical, and rectangle placements.
  - Sidebar ad placements with **>150px safety margins** from the game canvas (hidden on mobile to prevent accidental clicks).
  - Valid `/public/ads.txt` and crawler directives in `/robots.txt` allowing `Mediapartners-Google`.
  - Comprehensive Cookie & AdSense compliance disclosures on `/privacy-policy`.
- **🎮 Responsive 16:9 Game Player Canvas**:
  - HTML5 Fullscreen API integration.
  - Interactive "Reload Game" control.
  - Theater mode toggle.
  - Smooth preview fallback when placeholder embed links are active.
- **🔍 Client-Side Instant Game Search & Filter**:
  - Live header search bar with dropdown preview.
  - Category chips: *All, Survival, Parkour, Bedwars, Building, Multiplayer*.
- **📈 Advanced SEO & Structured Data**:
  - Automatic `sitemap.xml` and `robots.txt` generation.
  - Open Graph and Twitter Card dynamic tags per game.
  - JSON-LD structured schemas: `WebSite`, `VideoGame`, and `FAQPage`.
  - 300 to 500 words of **original written content** per game (About, How to Play, Keyboard Controls table, Tips, Features, FAQs).

---

## 📁 Project File Structure

```
BlockHubGames.com/
├── app/
│   ├── layout.js                 # Global layout, AdSense next/script, SEO metadata, Header/Footer
│   ├── page.js                   # Homepage (Featured hero, category chips, 16-game grid, SEO intro)
│   ├── globals.css               # Dark voxel theme, emerald glows, custom scrollbars
│   ├── sitemap.js                # Auto-generates /sitemap.xml for all routes
│   ├── robots.js                 # Auto-generates /robots.txt with Mediapartners-Google rule
│   ├── not-found.js              # Custom voxel 404 page
│   ├── game/
│   │   └── [slug]/
│   │       └── page.js           # Dynamic game page with player, controls table, FAQ, ads & related games
│   ├── category/
│   │   └── [name]/
│   │       └── page.js           # Category filtered landing pages with 100+ words SEO copy
│   ├── about/
│   │   └── page.js               # Mission, team, and curation standards
│   ├── contact/
│   │   └── page.js               # Inquiry form, developer submissions, and support info
│   ├── privacy-policy/
│   │   └── page.js               # AdSense, DART cookies, GDPR, CCPA, and COPPA disclosures
│   ├── terms/
│   │   └── page.js               # Terms of Service & trademark disclaimers
│   └── dmca/
│       └── page.js               # DMCA notice & copyright takedown procedure
├── components/
│   ├── Header.js                 # Sticky glassmorphic navbar with live search and mobile drawer
│   ├── Footer.js                 # Footer with legal links, category links, and disclaimers
│   ├── GameCard.js               # Rounded card with thumbnail, category pill, rating, and hover play icon
│   ├── HomeGameExplorer.js       # Client-side category chips, search filter, and 16-game grid
│   ├── GamePlayer.js             # 16:9 iframe container, Fullscreen API, reload, and theater mode
│   ├── HeroFeatured.js           # Hero spotlight banner and selector pills
│   ├── AdSlot.js                 # Reusable AdSense slot component with dev preview
│   ├── Breadcrumbs.js            # Semantic breadcrumb navigation
│   └── JsonLd.js                 # Structured JSON-LD schema (VideoGame, FAQPage, WebSite)
├── data/
│   ├── games.js                  # Master games database with 16 voxel games & full content
│   └── categories.js             # Categories list with SEO headlines and descriptions
├── public/
│   ├── ads.txt                   # Authorized AdSense digital sellers file
│   ├── logo.svg                  # Brand logo
│   └── thumbnails/               # 16 crisp voxel SVG game thumbnails
├── scripts/
│   └── generate-thumbnails.js    # Utility script to generate SVG thumbnails
├── package.json
├── next.config.mjs
└── README.md
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### 3. Build for Production (SSG)
```bash
npm run build
```
This pre-renders all 32 static pages (homepage, static pages, categories, and 16 game pages) into fast HTML/CSS.

---

## 🕹️ How to Add a New Game or Swap Embed URLs

All game data is centralized in **`data/games.js`**.

### 1. Swapping Placeholder Embed URLs with Real GameMonetize / GameDistribution Links
Open `data/games.js` and locate the game you want to activate. Replace `"PASTE_GAMEMONETIZE_EMBED_URL_HERE"` with your actual game embed URL:

```javascript
{
  slug: "block-craft-survival",
  title: "Block Craft Survival 3D",
  category: "Survival",
  featured: true,
  rating: 4.8,
  plays: "142.5K",
  thumbnail: "/thumbnails/block-craft-survival.svg",
  // SWAP THIS LINE:
  iframeUrl: "https://html5.gamemonetize.com/abcdef123456/",
  ...
}
```

### 2. Adding a New Game
Simply append a new game object to the `games` array in `data/games.js`:

```javascript
{
  slug: "my-new-voxel-game",
  title: "My New Voxel Game",
  category: "Parkour", // "Survival" | "Parkour" | "Bedwars" | "Building" | "Multiplayer"
  featured: false,
  rating: 4.8,
  plays: "25.0K",
  thumbnail: "/thumbnails/my-new-voxel-game.svg", // place file in /public/thumbnails/
  iframeUrl: "https://html5.gamemonetize.com/your-game-id/",
  description: "Detailed 100+ words description of the game...",
  howToPlay: "Clear instructions explaining core mechanics...",
  controls: [
    { key: "W, A, S, D", action: "Move player" },
    { key: "Spacebar", action: "Jump" },
    { key: "Left Click", action: "Mine / Attack" }
  ],
  tips: [
    "Tip 1...",
    "Tip 2..."
  ],
  features: [
    "Feature 1...",
    "Feature 2..."
  ],
  faq: [
    { q: "Is this game free?", a: "Yes, 100% free in your browser." }
  ]
}
```

---

## 💰 How to Configure Google AdSense

### 1. Replace the AdSense Client ID
Open `app/layout.js` or set an environment variable `NEXT_PUBLIC_ADSENSE_CLIENT_ID`:

```env
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
```
Or directly edit line 6 in `app/layout.js`:
```javascript
const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1234567890123456";
```

### 2. Update `public/ads.txt`
Open `public/ads.txt` and replace `pub-XXXXXXXXXXXXXXXX` with your publisher ID:
```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

### 3. Customize Slot IDs in Components
Open `app/game/[slug]/page.js` or `app/page.js` and assign your created ad unit slot IDs to each `<AdSlot slotId="..." />`:
- Top Banner Slot: `slotId="1234567890"`
- Left/Right Sidebar Slots: `slotId="1234567891"`
- In-Content Mid Slot: `slotId="1234567892"`

---

## ☁️ Deploying to Vercel with a Custom Domain

1. Push your repository to **GitHub / GitLab / Bitbucket**.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository. Vercel automatically detects Next.js.
4. *(Optional)* Add the environment variable:
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXXXXXXXXXX`
5. Click **"Deploy"**. The build will complete in ~30 seconds.
6. **Assign your custom domain (`BlockHub.games`)**:
   - Go to **Project Settings > Domains**.
   - Enter `blockhub.games` and `www.blockhub.games`.
   - Update your domain registrar&apos;s DNS records (A record pointing to `76.76.21.21` or CNAME for www).
   - Vercel will automatically provision a free SSL certificate.

---

## ✅ AdSense Approval Checklist

Before submitting your website to Google AdSense for review, verify these items:

- [ ] **Replace all placeholder embed URLs**: Ensure games in `data/games.js` have valid GameMonetize or GameDistribution iframe links that load playable games.
- [ ] **Update Publisher ID**: Insert your real `ca-pub-XXXXXXXXXXXXXXXX` in `app/layout.js` and `public/ads.txt`.
- [ ] **Verify Contact Email**: Replace `contact@blockhub.games` in `app/contact/page.js` and `app/dmca/page.js` with your monitored support email.
- [ ] **Verify Privacy Policy Compliance**: Double check that the AdSense and DoubleClick DART cookie disclosure remains active on `/privacy-policy`.
- [ ] **Verify Ad Placement Spacing**: Confirm sidebar ads maintain at least 150px separation from the game canvas (built-in by default on desktop, hidden on mobile).
- [ ] **No Auto-Redirects or Timer Gates**: Keep navigation clean with immediate game access (no forced countdowns or click gates).
- [ ] **Live Custom Domain**: Ensure the site is live on your top-level domain (`BlockHub.games`) with valid HTTPS/SSL.
