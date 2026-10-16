const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'thumbnails');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const games = [
  { slug: 'cyber-drift-city-3d', title: 'Cyber Drift City 3D', cat: 'Racing', bg1: '#312e81', bg2: '#0f172a', accent: '#6366f1', symbol: '🏎️' },
  { slug: 'shadow-strike-ops-fps', title: 'Shadow Strike Ops FPS', cat: 'Shooting', bg1: '#7f1d1d', bg2: '#18181b', accent: '#ef4444', symbol: '🎯' },
  { slug: 'block-craft-survival', title: 'Block Craft Survival 3D', cat: 'Adventure', bg1: '#064e3b', bg2: '#022c22', accent: '#10b981', symbol: '⛏️' },
  { slug: 'super-kick-soccer-champions', title: 'Super Kick Soccer Champions', cat: 'Sports', bg1: '#065f46', bg2: '#022c22', accent: '#34d399', symbol: '⚽' },
  { slug: 'neon-puzzle-block-master', title: 'Neon Puzzle Block Master', cat: 'Puzzle', bg1: '#581c87', bg2: '#1e1b4b', accent: '#a855f7', symbol: '🧩' },
  { slug: 'pixel-arena-multiplayer', title: 'Pixel Arena Multiplayer', cat: 'Multiplayer', bg1: '#1e3a8a', bg2: '#0f172a', accent: '#3b82f6', symbol: '⚔️' },
  { slug: 'parkour-block-3d', title: 'Parkour Block 3D', cat: 'Arcade', bg1: '#78350f', bg2: '#451a03', accent: '#f59e0b', symbol: '🏃' },
  { slug: 'voxel-bedwars-championship', title: 'Bedwars Sky Arena', cat: 'Action', bg1: '#881337', bg2: '#4c0519', accent: '#f43f5e', symbol: '🛏️' },
  { slug: 'mega-city-builder-3d', title: 'Mega City Builder 3D', cat: 'Adventure', bg1: '#164e63', bg2: '#083344', accent: '#06b6d4', symbol: '🏙️' },
  { slug: 'pixel-zombie-survival', title: 'Pixel Zombie Apocalypse', cat: 'Action', bg1: '#365314', bg2: '#1a2e05', accent: '#84cc16', symbol: '🧟' },
  { slug: 'highway-traffic-racer-pro', title: 'Highway Traffic Racer Pro', cat: 'Racing', bg1: '#9a3412', bg2: '#431407', accent: '#ea580c', symbol: '🚗' },
  { slug: 'sniper-elite-target-hunt', title: 'Sniper Elite: Target Hunt', cat: 'Shooting', bg1: '#334155', bg2: '#090d16', accent: '#94a3b8', symbol: '🔭' },
  { slug: 'bubble-pop-galaxy-quest', title: 'Bubble Pop: Galaxy Quest', cat: 'Arcade', bg1: '#831843', bg2: '#2e1065', accent: '#ec4899', symbol: '🫧' },
  { slug: 'dunk-hoops-basketball-3d', title: 'Dunk Hoops: Basketball 3D', cat: 'Sports', bg1: '#c2410c', bg2: '#1e1b4b', accent: '#fb923c', symbol: '🏀' },
  { slug: 'temple-quest-tomb-runner', title: 'Temple Quest: Tomb Runner', cat: 'Adventure', bg1: '#854d0e', bg2: '#292524', accent: '#eab308', symbol: '🗿' },
  { slug: 'galaxy-conquest-io', title: 'Galaxy Conquest .io', cat: 'Multiplayer', bg1: '#1e1b4b', bg2: '#030712', accent: '#818cf8', symbol: '🚀' }
];

games.forEach(g => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
  <defs>
    <linearGradient id="bg_${g.slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${g.bg1}" />
      <stop offset="100%" stop-color="${g.bg2}" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="640" height="360" fill="url(#bg_${g.slug})" />

  <!-- Dynamic Arcade Pattern -->
  <g opacity="0.12" stroke="#ffffff" stroke-width="1">
    <path d="M0,60 L640,60 M0,120 L640,120 M0,180 L640,180 M0,240 L640,240 M0,300 L640,300" />
    <path d="M60,0 L60,360 M120,0 L120,360 M180,0 L180,360 M240,0 L240,360 M300,0 L300,360 M360,0 L360,360 M420,0 L420,360 M480,0 L480,360 M540,0 L540,360 M600,0 L600,360" />
  </g>

  <!-- Center Decorative Graphics -->
  <circle cx="320" cy="140" r="60" fill="${g.accent}" fill-opacity="0.2" stroke="${g.accent}" stroke-width="2" />
  <circle cx="320" cy="140" r="44" fill="${g.accent}" fill-opacity="0.35" />

  <!-- Big Category Emoji Icon -->
  <text x="320" y="152" font-size="54" text-anchor="middle" dominant-baseline="central">${g.symbol}</text>

  <!-- Category Badge at Top Left -->
  <rect x="24" y="24" width="130" height="30" rx="6" fill="#090d16" fill-opacity="0.85" stroke="${g.accent}" stroke-width="1.5" />
  <text x="89" y="44" fill="${g.accent}" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">${g.cat.toUpperCase()}</text>

  <!-- Rating Badge at Top Right -->
  <rect x="546" y="24" width="70" height="30" rx="6" fill="#090d16" fill-opacity="0.85" stroke="#eab308" stroke-width="1" />
  <text x="581" y="44" fill="#facc15" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">★ 4.8</text>

  <!-- Lower Title Bar Overlay -->
  <rect x="0" y="250" width="640" height="110" fill="#090d16" fill-opacity="0.9" />
  <line x1="0" y1="250" x2="640" y2="250" stroke="${g.accent}" stroke-width="2" />

  <!-- Title Text -->
  <text x="32" y="290" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="800">${g.title}</text>
  <text x="32" y="322" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="13" font-weight="500">Free HTML5 Browser Game • Instant Play</text>

  <!-- Play Arrow Prompt on Right -->
  <circle cx="586" cy="305" r="22" fill="${g.accent}" />
  <polygon points="580,295 596,305 580,315" fill="#090d16" />
</svg>`;

  fs.writeFileSync(path.join(dir, g.slug + '.svg'), svg, 'utf8');
});

console.log('Successfully regenerated all 16 multi-genre SVG thumbnails!');
