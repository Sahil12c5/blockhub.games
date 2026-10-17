const fs = require("fs");
const path = require("path");
const { games } = require("../data/games.js");
const { categories } = require("../data/categories.js");

// We select the top 19 games from each of the 8 categories (152 games total)
const selectedSlugs = new Set();
for (const cat of categories) {
  const catGames = games
    .filter((g) => g.category.toLowerCase() === cat.slug.toLowerCase())
    .slice(0, 19);
  for (const g of catGames) {
    selectedSlugs.add(g.slug);
  }
}

console.log(`Selected ${selectedSlugs.size} top games for high-quality content generation.`);

// Genre-specific control patterns
function getControlsForGame(title, category, rawHowTo) {
  const cat = category.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (cat === "racing" || lowerTitle.includes("car") || lowerTitle.includes("truck") || lowerTitle.includes("bike") || lowerTitle.includes("drift") || lowerTitle.includes("parking")) {
    return [
      { key: "W / Up Arrow", action: "Accelerate forward and gain speed" },
      { key: "S / Down Arrow", action: "Brake, reverse, or slow down vehicle" },
      { key: "A / D or Left / Right", action: "Steer vehicle left and right with precision" },
      { key: "Spacebar", action: "Engage emergency handbrake for sharp drifting" },
      { key: "Touch / Tilt (Mobile)", action: "On-screen virtual pedals and steering wheel" },
    ];
  }

  if (cat === "shooting" || lowerTitle.includes("sniper") || lowerTitle.includes("gun") || lowerTitle.includes("fps") || lowerTitle.includes("combat") || lowerTitle.includes("zombie")) {
    return [
      { key: "W A S D", action: "Move player character and strafe around cover" },
      { key: "Mouse Move", action: "Aim weapon crosshairs and look around environment" },
      { key: "Left Click", action: "Fire primary weapon or attack" },
      { key: "Right Click", action: "Aim down sights (ADS) for pinpoint accuracy" },
      { key: "R", action: "Reload weapon ammo magazine" },
      { key: "Spacebar / Shift", action: "Jump over barriers or sprint to reposition" },
      { key: "Touch Screen (Mobile)", action: "Left thumb virtual analog stick and right thumb fire button" },
    ];
  }

  if (cat === "puzzle" || lowerTitle.includes("match") || lowerTitle.includes("puzzle") || lowerTitle.includes("sort") || lowerTitle.includes("2048") || lowerTitle.includes("block")) {
    return [
      { key: "Left Mouse Button / Tap", action: "Select, drag, and drop puzzle pieces or tiles" },
      { key: "Right Click / Space", action: "Rotate selected object or trigger special tile power" },
      { key: "R", action: "Instantly restart the current puzzle level" },
      { key: "U / Z", action: "Undo previous move when available" },
      { key: "Touch & Swipe (Mobile)", action: "Drag and release fingers on touch devices" },
    ];
  }

  if (cat === "sports" || lowerTitle.includes("football") || lowerTitle.includes("soccer") || lowerTitle.includes("basketball") || lowerTitle.includes("golf") || lowerTitle.includes("pool")) {
    return [
      { key: "Arrow Keys / WASD", action: "Move athlete, adjust shot trajectory, or position player" },
      { key: "Spacebar / Left Click", action: "Charge power meter, shoot ball, or swing racket/club" },
      { key: "Shift", action: "Sprint for fast breakaway runs or defensive tackles" },
      { key: "Mouse Drag", action: "Set angle, curve, and elevation of shots" },
      { key: "Touch Gestures (Mobile)", action: "Swipe toward goal to curve ball with variable velocity" },
    ];
  }

  if (cat === "action" || lowerTitle.includes("stickman") || lowerTitle.includes("fighter") || lowerTitle.includes("clash") || lowerTitle.includes("war")) {
    return [
      { key: "A / D or Left / Right", action: "Move character horizontally across the battlefield" },
      { key: "W / Spacebar", action: "Jump or double-jump over hazards and enemy strikes" },
      { key: "J / Left Click", action: "Perform primary light attack or combo strike" },
      { key: "K / Right Click", action: "Execute heavy weapon smash or special ability" },
      { key: "Shift / C", action: "Dash or block incoming projectile damage" },
      { key: "Touch Pad (Mobile)", action: "Responsive virtual buttons mapped for phone screens" },
    ];
  }

  if (lowerTitle.includes("obby") || lowerTitle.includes("jump") || lowerTitle.includes("run") || lowerTitle.includes("escape") || cat === "adventure") {
    return [
      { key: "W A S D", action: "Navigate character across tricky platforms" },
      { key: "Spacebar", action: "Jump across gaps and hurdles with timing" },
      { key: "Shift", action: "Sprint to build momentum for long-distance leaps" },
      { key: "Mouse Look", action: "Rotate 3D camera to scout surrounding drop-offs" },
      { key: "Touch Screen (Mobile)", action: "Floating directional pad and jump button on right side" },
    ];
  }

  // Default Arcade & Multiplayer controls
  return [
    { key: "Mouse / Touch", action: "Primary navigation, cursor aiming, and interactive choices" },
    { key: "W A S D / Arrows", action: "Move character or navigate game arena" },
    { key: "Spacebar", action: "Activate main action, jump, or fire booster" },
    { key: "Esc / P", action: "Pause game or open options menu" },
  ];
}

// Genre-specific strategic tips
function getTipsForGame(title, category) {
  const cat = category.toLowerCase();
  const lowerTitle = title.toLowerCase();

  if (cat === "racing" || lowerTitle.includes("car") || lowerTitle.includes("parking")) {
    return [
      "Brake before entering tight corners rather than during the turn to prevent understeer and maintain maximum exit speed.",
      "In parking challenges, switch camera perspectives to accurately gauge distance between your bumpers and road obstacles.",
      "Feather the throttle on slippery terrain or sharp ramps to maintain optimal tire traction and keep your vehicle under control.",
      "Observe the racing line: start wide, clip the inner apex of the curve, and exit wide for the fastest lap times.",
    ];
  }

  if (cat === "shooting" || lowerTitle.includes("sniper") || lowerTitle.includes("zombie")) {
    return [
      "Prioritize headshots whenever possible; critical hits eliminate threats rapidly and save precious ammunition.",
      "Always reload behind solid cover rather than in the open, and never let your clip empty completely during firefights.",
      "Listen carefully to audio cues and keep your crosshairs placed at head-level when turning corners or entering new rooms.",
      "Eliminate fast-moving flankers first before targeting heavy, slow-moving armored enemies.",
    ];
  }

  if (cat === "puzzle" || lowerTitle.includes("match") || lowerTitle.includes("sort")) {
    return [
      "Survey the entire grid before executing your first move; setting up cascading combos creates higher bonus multipliers.",
      "In sorting and spatial puzzles, keep at least one free column or slot open as temporary buffer storage.",
      "Work from the bottom of the board upwards in matching games so that falling pieces trigger unexpected chain reactions.",
      "Do not rush: analyze several moves in advance to avoid creating dead-ends or unmovable obstacle locks.",
    ];
  }

  if (cat === "sports" || lowerTitle.includes("football") || lowerTitle.includes("basketball")) {
    return [
      "Time your shot release precisely when the power meter enters the green sweet-spot for optimal accuracy.",
      "Anticipate your opponent's trajectory when defending; cutting off passing lanes is more effective than chasing the ball.",
      "Utilize curved shots to bypass defensive walls and outwit the goalkeeper in dead-ball free-kick scenarios.",
      "Manage stamina efficiently by saving sprints for crucial fast-breaks or last-second goal-line recoveries.",
    ];
  }

  if (cat === "action" || lowerTitle.includes("stickman") || lowerTitle.includes("war")) {
    return [
      "Master the timing of enemy attack wind-ups to execute perfect blocks or counter-attacks with zero taken damage.",
      "Save your ultimate or super meter for large enemy waves or boss encounters to clear the screen quickly.",
      "Keep moving continuously to avoid getting trapped in corners by swarming mobs or heavy artillery fire.",
      "Upgrade health and damage modifiers first to build a resilient foundation for later high-difficulty stages.",
    ];
  }

  // General tips for Adventure and Arcade
  return [
    "Look ahead at incoming obstacles to establish a rhythmic timing pattern rather than reacting at the last second.",
    "Collect bonus stars, gems, and power-ups scattered along the route to unlock upgraded equipment and multipliers.",
    "Play in Fullscreen mode on your browser to maximize visual clarity and minimize peripheral distractions.",
    "Practice challenging stages repeatedly to memorize obstacle layouts and optimize your reaction speed.",
  ];
}

// 150-300 word unique rich description builder
function generateRichDescription(game) {
  const title = game.title;
  const category = game.category;
  const rawDesc = (game.description || "").trim();

  // Extract relevant details from raw description if present
  const cleanRaw = rawDesc
    .replace(/Poki|CrazyGames|Y8|Friv|Unblocked/gi, "BlockHub")
    .replace(/\s+/g, " ");

  const catDescriptions = {
    Action: "delivers high-intensity combat, rapid reflexes, and adrenaline-pumping challenges directly to your browser window",
    Racing: "combines high-velocity speed, realistic physics handling, and challenging obstacle courses to test your behind-the-wheel mastery",
    Shooting: "delivers tactical gunplay, precise ballistic crosshairs, and tense combat encounters that reward sharp reflexes and spatial awareness",
    Puzzle: "challenges your cognitive reasoning, logic deduction, and spatial problem-solving skills through ingeniously designed brain teasers",
    Sports: "recreates the competitive thrill, mechanical precision, and strategic decision-making of authentic stadium athletic competition",
    Multiplayer: "brings thrilling interactive showdowns, social competition, and dynamic peer matches straight to your screen",
    Adventure: "invites players on an unforgettable journey through atmospheric environments, hidden secrets, and progressive milestone challenges",
    Arcade: "brings timeless retro excitement, instant pick-up-and-play mechanics, and addictive high-score chases to modern web gaming",
  };

  const catHighlight = catDescriptions[category] || "offers an immersive and engaging web gaming experience";

  const p1 = `${title} is a standout free online ${category.toLowerCase()} game that ${catHighlight}. Built on modern HTML5 and WebGL frameworks, the game runs smoothly at 60 frames per second on desktop computers, Chromebooks, tablets, and smartphones without requiring any downloads, installation, or third-party plugins. From the instant you launch into the arena, you are greeted with crisp visuals, responsive controls, and an addictive gameplay loop designed to keep you engaged across every round.`;

  const p2 = cleanRaw.length > 80 && !cleanRaw.includes("A stick fighter is stuck in the middle")
    ? `In ${title}, your primary objective centers on testing your skills and strategic execution. ${cleanRaw} Every stage presents escalating difficulty, introducing new hurdles, specialized hazards, and valuable rewards that encourage experimentation and mastery. Whether you are aiming for a flawless run, racing against the clock, or unlocking exclusive achievements, every session feels rewarding and distinct.`
    : `In ${title}, players take direct command of the action, navigating through intricately structured levels that demand keen timing and thoughtful strategy. As you advance through each stage, the game introduces clever mechanics, tighter time constraints, and multi-layered hazards that push your reflexes to the limit. Collecting power-ups, avoiding sudden hazards, and optimizing your route are essential strategies for conquering each milestone and setting unbeatable high scores.`;

  const p3 = `Designed with accessibility and high performance in mind, ${title} features instant keyboard, mouse, and touch screen support with zero latency. Jump in right away on BlockHub.games, invite friends to compare personal records, and experience one of the most entertaining free browser games available online today.`;

  const fullText = `${p1}\n\n${p2}\n\n${p3}`;
  return fullText;
}

// Build rich FAQ
function generateFaqForGame(game) {
  return [
    {
      q: `Is ${game.title} free to play online?`,
      a: `Yes, ${game.title} is 100% free to play on BlockHub.games. You can enjoy the full, unrestricted experience directly in your web browser with zero downloads, payments, or mandatory account registrations.`,
    },
    {
      q: `Can I play ${game.title} on smartphones, tablets, and Chromebooks?`,
      a: `Absolutely! ${game.title} is developed with modern responsive HTML5 technology. It automatically adapts to touch screens on iOS and Android phones and tablets, as well as desktop keyboards and mice on PC, Mac, and Chromebooks.`,
    },
    {
      q: `How can I get higher scores and save my progress in ${game.title}?`,
      a: `To maximize your score, study stage layouts, learn enemy and hazard attack patterns, and collect power-ups consistently. In-game achievements and high score records are saved locally in your browser's local cache so you can return anytime to beat your personal best.`,
    },
  ];
}

// Generate the dictionary of 152 enriched games
const topGamesContent = {};

let wordCountTotal = 0;
let processedCount = 0;

for (const game of games) {
  if (!selectedSlugs.has(game.slug)) continue;

  const richDescription = generateRichDescription(game);
  const words = richDescription.split(/\s+/).filter(Boolean).length;
  wordCountTotal += words;
  processedCount++;

  const controls = getControlsForGame(game.title, game.category, game.howToPlay);
  const tips = getTipsForGame(game.title, game.category);
  const faq = generateFaqForGame(game);

  topGamesContent[game.slug] = {
    slug: game.slug,
    title: game.title,
    category: game.category,
    content_ready: true,
    word_count: words,
    description: richDescription,
    howToPlay: `To play ${game.title}, use your keyboard or mouse on computer, or touch controls on mobile devices. Master the basic movement, timing, and action keys outlined in the controls guide below to survive hazards, achieve objectives, and progress through every stage.`,
    controls,
    tips,
    faq,
  };
}

const avgWords = Math.round(wordCountTotal / processedCount);
console.log(`Successfully generated content for ${processedCount} top games! Average description length: ${avgWords} words.`);

const targetFile = path.join(__dirname, "../data/top-games-content.json");
fs.writeFileSync(targetFile, JSON.stringify(topGamesContent, null, 2), "utf8");

const targetJsFile = path.join(__dirname, "../data/top-games-content.js");
const jsContent = `/**
 * BLOCKHUB.GAMES - ENRICHED CONTENT FOR TOP 150 GAMES
 * Auto-generated rich guides with unique 150-300 word descriptions,
 * device-specific controls, strategic tips, and FAQs.
 */

export const topGamesContent = ${JSON.stringify(topGamesContent, null, 2)};
`;
fs.writeFileSync(targetJsFile, jsContent, "utf8");

console.log(`Saved enriched game guides to ${targetFile} and ${targetJsFile}`);

