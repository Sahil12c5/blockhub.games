const { extractGameFacts, detectSubgenre } = require("./facts.js");
const { checkBlocklist } = require("./blocklist.js");
const { get5WordShingles, computeJaccardSimilarity } = require("./validator.js");
const { hubs, getHubsForGame } = require("../../data/hubs.js");

// Cache of used meta descriptions to ensure 100% uniqueness
const usedMetaDescriptions = new Set();

function formatMetaTitle(rawTitle) {
  const cleanTitle = (rawTitle || "").trim();

  const option1 = `${cleanTitle} - Play Free Online | BlockHub.games`;
  if (option1.length <= 60) return option1;

  const option2 = `${cleanTitle} - Play Free | BlockHub.games`;
  if (option2.length <= 60) return option2;

  const option3 = `${cleanTitle} - Play Free Online`;
  if (option3.length <= 60) return option3;

  const option4 = `${cleanTitle} - Free Online`;
  if (option4.length <= 60) return option4;

  const suffix = " - Play Free Online";
  const maxTitleLen = 60 - suffix.length;
  let trimmed = cleanTitle.slice(0, maxTitleLen);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > 12) {
    trimmed = trimmed.slice(0, lastSpace);
  }
  return `${trimmed}${suffix}`;
}

function formatMetaDescription(title, category, subgenre, seed = 0) {
  const cTitle = (title || "").trim();
  const catLower = (category || "").toLowerCase();

  const actionMap = {
    parking: "Master tight parking spaces, avoid barriers, and execute reverse maneuvers.",
    truck: "Haul heavy freight across challenging highways, negotiate steep turns, and deliver cargo safely.",
    drift: "Slide through hairpin curves, control high-speed oversteer, and rack up drift multipliers.",
    moto: "Balance your bike over extreme ramps, maintain momentum, and cross the finish line without crashing.",
    sniper: "Line up precision long-range crosshairs, identify targets, and neutralize hostile threats.",
    zombie: "Fend off relentless undead hordes, upgrade your survival arsenal, and hold defensive perimeters.",
    fps: "Engage in fast tactical shootouts, clear hostile rooms, and outmaneuver opponent squads.",
    stickman: "Battle rival stick fighters with fluid martial arts, ragdoll physics, and tactical strikes.",
    match3: "Match vibrant colored gems, trigger cascading chain reactions, and beat high-score puzzles.",
    sort: "Organize items systematically, clear bottleneck slots, and solve clever sorting puzzles.",
    puzzle: "Exercise your spatial logic, overcome tricky mechanical obstacles, and solve progressive brain teasers.",
    soccer: "Score curling free-kicks, outwit the goalkeeper, and lead your soccer team to victory.",
    basketball: "Time your jump shots, swish clean three-pointers, and sink consecutive hoops.",
    runner: "Sprint across obstacle-filled tracks, dodge sudden hazards, and collect route multipliers.",
    "tower-defense": "Deploy defensive units strategically, counter enemy waves, and safeguard your base.",
    clicker: "Generate resources, unlock compounding multipliers, and build an unstoppable idle empire.",
    fighter: "Execute punch-kick combos, dodge enemy strikes, and defeat formidable opponents in combat.",
  };

  const specificAction = actionMap[subgenre] || `Enjoy thrilling ${catLower} gameplay packed with unique stages and obstacles.`;

  const templates = [
    `Play ${cTitle} online for free at BlockHub.games! ${specificAction} Fast HTML5 browser play with zero downloads needed.`,
    `Experience ${cTitle} free on BlockHub.games! ${specificAction} Enjoy smooth browser gaming with no downloads or installation.`,
    `Jump into ${cTitle} on BlockHub.games! ${specificAction} Play instant ${catLower} browser action free on PC and mobile today.`,
    `Play ${cTitle} free in your browser on BlockHub.games. ${specificAction} Responsive HTML5 controls with no downloads required.`,
    `Try ${cTitle} on BlockHub.games! ${specificAction} Master each level with instant, unblocked browser play on desktop and mobile.`,
    `Play the full version of ${cTitle} free online on BlockHub.games! ${specificAction} Experience fast loading with no downloads.`,
    `Discover ${cTitle} online on BlockHub.games! ${specificAction} Enjoy unblocked browser gaming with high framerate performance.`,
    `Launch ${cTitle} for free on BlockHub.games! ${specificAction} Test your reflexes across each stage with zero downloads.`,
    `Take on ${cTitle} free on BlockHub.games! ${specificAction} Smooth 60 FPS gameplay on computer, tablet, and mobile browsers.`,
    `Play ${cTitle} unblocked online at BlockHub.games. ${specificAction} Jump into the action right now with no plugins needed.`,
  ];

  let candidate = templates[Math.abs(seed) % templates.length];

  // Adjust candidate length strictly to 140 - 160 characters
  if (candidate.length < 140) {
    const paddings = [
      " Jump in right now!",
      " Test your skills today!",
      " Play free online today!",
      " Start your run now!",
      " Have fun playing online!",
      " Play instantly on BlockHub!",
      " Start playing now!",
    ];
    for (const p of paddings) {
      if ((candidate + p).length <= 160) {
        candidate = candidate + p;
        if (candidate.length >= 140) break;
      }
    }
  }

  if (candidate.length > 160) {
    candidate = candidate.slice(0, 157);
    const lastPunct = Math.max(candidate.lastIndexOf("."), candidate.lastIndexOf("!"));
    if (lastPunct >= 135) {
      candidate = candidate.slice(0, lastPunct + 1);
    } else {
      candidate = candidate.slice(0, 156) + ".";
    }
  }

  // Ensure length is strictly between 140 and 160
  while (candidate.length < 140) {
    candidate += " Play free!";
  }
  if (candidate.length > 160) {
    candidate = candidate.slice(0, 159) + ".";
  }

  if (usedMetaDescriptions.has(candidate)) {
    return formatMetaDescription(title, category, subgenre, seed + 1);
  }

  usedMetaDescriptions.add(candidate);
  return candidate;
}

function getFittedTips(subgenre, category) {
  const tipsMap = {
    parking: [
      "Switch camera perspectives frequently to monitor front bumper and rear quarter clearances.",
      "Brake completely before reversing and steer toward the curb to straighten your alignment.",
      "Feather the acceleration pedal gently rather than holding it down in narrow garage corridors.",
      "Take your time on tight turns: clean positioning earns higher ratings than rushing into obstacles.",
    ],
    truck: [
      "Account for heavy cargo momentum by applying brakes earlier than you would in a light automobile.",
      "Swing wide when taking street corner turns so trailing trailer wheels avoid clipping curbs.",
      "Keep speed steady on steep downhill trails to prevent cargo shifting and trailer jackknifing.",
      "Watch roadway surface changes to anticipate loss of traction on wet mud or icy curves.",
    ],
    drift: [
      "Initiate your drift slightly before the turn entry by tapping the handbrake and counter-steering.",
      "Modulate throttle pulses mid-drift to maintain your slide angle without spinning out completely.",
      "Transition smoothly from one curve to the next to link combo multipliers for higher scores.",
      "Upgrade rear tire grip and steering response first to gain tighter drift trajectory control.",
    ],
    moto: [
      "Tilt your rider backward on steep takeoff ramps to achieve maximum elevation and distance.",
      "Level your front and rear wheels parallel to the ground surface right before touchdown.",
      "Ease off the gas momentarily over bumpy washboard sections to maintain full tire contact.",
      "Memorize track drop-offs so you can preload your bunny-hops over blind gaps.",
    ],
    sniper: [
      "Keep crosshairs pre-positioned at head level to eliminate targets instantly with single shots.",
      "Account for target walking pace by leading your reticle slightly ahead of moving enemies.",
      "Reload ammunition between target waves so you never get caught with an empty chamber.",
      "Scan sniper nests and high rooftops first to neutralize counter-snipers before ground units.",
    ],
    zombie: [
      "Backpedal in wide circular paths to group wandering zombies into manageable clusters.",
      "Aim for critical headshots to conserve ammunition and dispatch swarms more efficiently.",
      "Prioritize fast-running infected and projectile spitters before focusing on heavy tanks.",
      "Save high-damage grenades and environmental explosive barrels for dense enemy clusters.",
    ],
    fps: [
      "Slice the pie when clearing corners, revealing one angle of the room at a time.",
      "Reload behind solid masonry or metal cover rather than standing vulnerable in the open.",
      "Use short, controlled firing bursts at medium to long range to minimize weapon recoil climb.",
      "Listen closely for hostile footstep cues to anticipate enemy flanking maneuvers.",
    ],
    stickman: [
      "Study enemy telegraph animations to execute timely blocks and devastating counter-attacks.",
      "Keep moving across the combat arena to avoid getting pinned against stage boundaries.",
      "Alternate between light jabs and heavy sweep strikes to break opponent defensive guards.",
      "Save your rage meter or special ability for multi-fighter waves and stage bosses.",
    ],
    match3: [
      "Survey the entire grid before making a move, prioritizing lower tiles to trigger cascades.",
      "Create four-in-a-row and T-shaped matches to generate explosive special booster pieces.",
      "Combine two adjacent power-up pieces to clear massive quadrants of the board simultaneously.",
      "Keep primary level objectives in mind rather than chasing random non-essential tile matches.",
    ],
    sort: [
      "Always preserve at least one empty buffer slot to shuffle blocked items without getting stuck.",
      "Focus on consolidating one complete item category or color before starting on secondary sets.",
      "Look two moves ahead to ensure moving an item does not seal off an essential underneath piece.",
      "Reset the stage without hesitation if you encounter an irreversible dead-end deadlock.",
    ],
    puzzle: [
      "Break complex mechanical puzzles down into isolated step-by-step sequential steps.",
      "Identify the ultimate win state and reverse-engineer the required preceding actions.",
      "Take advantage of undo functionality to test theoretical move pathways safely.",
      "Examine environmental clues such as color codings, symbols, or gear teeth alignments.",
    ],
    soccer: [
      "Time your kick gauge in the center green zone to achieve maximum ball velocity and placement.",
      "Apply side-spin curve to bend free kicks around defensive walls and beat the goalkeeper.",
      "Position defenders in passing lanes rather than lunging forward into aggressive slide tackles.",
      "Conserve stamina bursts for counter-attacking breakaways and critical defensive tracking.",
    ],
    basketball: [
      "Release your shot at the apex of the jump for the cleanest arc and highest basket probability.",
      "Study the defensive player's reach and pump-fake to draw fouls or open shooting lanes.",
      "Collect consecutive clean swishes to ignite score multiplier streaks.",
      "Anticipate rebound trajectories off the backboard to box out opponents under the hoop.",
    ],
    runner: [
      "Direct your eyes toward upcoming hurdles rather than focusing narrowly on your avatar.",
      "Use quick taps for minor obstacle hops and hold down inputs for extended distance leaps.",
      "Prioritize staying in safe center lanes unless moving to collect high-value multiplier tokens.",
      "Learn obstacle sequencing patterns through repeated runs to build intuitive muscle memory.",
    ],
    "tower-defense": [
      "Place slowing or freezing towers near stage entrances to maximize attacker exposure time.",
      "Concentrate heavy splash damage towers around tight bottlenecks and track switchbacks.",
      "Upgrade existing high-tier towers before filling the map with weak base-level defenses.",
      "Match tower damage types against specific enemy armor and shield vulnerabilities.",
    ],
    clicker: [
      "Reinvest initial revenue directly into automated resource generators to compound passive earnings.",
      "Balance manual tap power upgrades with secondary offline production multipliers.",
      "Activate temporary frenzy boosts when all passive generators are operating at peak capacity.",
      "Target global achievement milestones that grant percentage-based income bonuses.",
    ],
    fighter: [
      "Bait enemy attacks by hovering just outside their strike range, then punish during recovery frames.",
      "Mix up high and low attacks to keep opponent defenses guessing.",
      "Use quick dashes to reposition out of tight corners when under heavy offensive pressure.",
      "Learn your fighter's fastest combo starter to interrupt slower incoming rival strikes.",
    ],
  };

  const selected = tipsMap[subgenre] || tipsMap[category.toLowerCase()] || [
    "Observe enemy and hazard movement patterns carefully before making your move.",
    "Collect bonus power-ups scattered across the stage to boost your total score.",
    "Use full-screen mode for maximum visual clarity and responsive control precision.",
    "Replay earlier stages to hone your reflexes and optimize your completion time.",
  ];

  return selected.slice(0, 4);
}

function generateSpecificFaq(title, category, subgenre, controls) {
  const cTitle = (title || "").trim();

  const primaryKey = controls[0] ? controls[0].key : "Keyboard or Mouse";
  const mobileKey = controls.find((c) => c.key.includes("Touch") || c.key.includes("Mobile"))?.action || "responsive on-screen touch controls";

  const objectiveMap = {
    parking: `The primary objective in ${cTitle} is to navigate your vehicle through structured obstacle courses and park accurately within the designated bay without colliding with curbs or barriers.`,
    truck: `In ${cTitle}, your main mission is to transport heavy cargo loads safely to delivery destinations while managing vehicle momentum across challenging roads and sharp curves.`,
    drift: `The main goal in ${cTitle} is to initiate high-speed slides through tight corners, maintain drift angles, and chain scoring multipliers without spinning out.`,
    moto: `In ${cTitle}, players aim to pilot their motorcycle over rugged ramps and perilous obstacles, keeping balance to reach the finish line in record time.`,
    sniper: `Your objective in ${cTitle} is to scout target areas, acquire mission marks through high-powered optics, and eliminate hostile threats with clean shots.`,
    zombie: `In ${cTitle}, your core objective is to fend off waves of aggressive zombies, safeguard survival positions, and upgrade combat gear to endure escalating attacks.`,
    fps: `The goal in ${cTitle} is to navigate combat zones, outmaneuver opponent squads, and complete tactical objectives using sharp crosshair accuracy and cover mechanics.`,
    stickman: `In ${cTitle}, players command a stickman combatant to brawl against rival fighters, utilizing fluid martial arts strikes and ragdoll physics to win matches.`,
    match3: `The objective in ${cTitle} is to swap adjacent tiles, create combinations of three or more matching pieces, and trigger cascading combos to complete level goals.`,
    sort: `In ${cTitle}, your challenge is to organize and sort mixed elements into their designated holders, clearing bottleneck slots with strategic planning.`,
    puzzle: `The main objective in ${cTitle} is to decipher spatial brain teasers, manipulate interactive puzzle pieces, and uncover the sequence needed to clear each stage.`,
    soccer: `In ${cTitle}, your goal is to score goals against challenging defenses, time shots accurately past goalkeepers, and secure victory across tournaments.`,
    basketball: `The aim in ${cTitle} is to calibrate shot angle and power, sink consecutive baskets through the hoop, and rack up high-scoring shooting streaks.`,
    runner: `The objective in ${cTitle} is to guide your character along obstacle-laden tracks, jumping and dodging hazards to reach the final goal line.`,
    "tower-defense": `In ${cTitle}, players must strategically position defensive towers along enemy pathing to eliminate incoming waves before they reach base territory.`,
    clicker: `The goal in ${cTitle} is to tap to produce resources, unlock automated generators, and scale up exponential production through timely upgrades.`,
    fighter: `In ${cTitle}, players battle opponents inside the arena, chaining offensive strikes, blocking incoming damage, and depleting the rival life gauge.`,
  };

  const strategyMap = {
    parking: "Focus on gentle steering adjustments and slow, controlled speeds. Take advantage of camera adjustments to align tires with parking bay guidelines.",
    truck: "Anticipate braking distances well before approaching intersections, and swing wide on corner turns to keep trailers from clipping obstacles.",
    drift: "Enter corners with speed, apply the handbrake briefly, and pulse the throttle smoothly to maintain drift momentum without over-rotating.",
    moto: "Keep your center of gravity balanced over jumps, ensuring both tires land flush with downhill slopes to maintain speed.",
    sniper: "Prioritize target threats that have clear sightlines on your position, lead walking targets slightly, and always reload between combat waves.",
    zombie: "Never allow yourself to get boxed into corners. Keep circling the arena perimeter and conserve high-damage weapons for dense swarms.",
    fps: "Maintain crosshair placement at upper-chest height, peek around corners conservatively, and reload only when protected behind solid cover.",
    stickman: "Watch for opponent attack wind-ups to time your counters, keep your distance, and unleash heavy attacks once enemy guard is broken.",
    match3: "Prioritize bottom-row matches to provoke cascading chain reactions, and combine special power pieces for massive board clearances.",
    sort: "Keep at least one free slot clear as temporary storage, and work systematically on one color or item group before shifting to another.",
    puzzle: "Analyze the full stage before your initial move, break down multi-part mechanisms into steps, and use trial-and-error methodically.",
    soccer: "Time your shot gauge in the optimal green section and apply curved trajectory to bend the ball away from the goalkeeper's reach.",
    basketball: "Release the basketball consistently at the peak of your jump arc, and read the defender's positioning to avoid blocked shots.",
    runner: "Look ahead at incoming hazards rather than staring directly at your character, establishing a steady rhythmic timing for jumps and slides.",
    "tower-defense": "Create choke points by clustering slowing towers near high-damage area-of-effect defenses, and upgrade primary towers early.",
    clicker: "Prioritize early reinvestment into passive automated income generators to compound your earnings even when not actively tapping.",
    fighter: "Stay patient, bait out missed opponent strikes, and immediately retaliate with your character's most reliable combo chain.",
  };

  return [
    {
      q: `What is the main objective in ${cTitle}?`,
      a: objectiveMap[subgenre] || `In ${cTitle}, players take on distinct ${category.toLowerCase()} challenges, overcoming hurdles and completing objectives to achieve high scores.`,
    },
    {
      q: `How do you control and play ${cTitle}?`,
      a: `On desktop computers, you can control the action using ${primaryKey}. On mobile devices and tablets, the game provides ${mobileKey}.`,
    },
    {
      q: `What is the most effective strategy to win in ${cTitle}?`,
      a: strategyMap[subgenre] || "Stay observant of stage layouts, practice timing your inputs carefully, and collect available upgrades to conquer tougher levels.",
    },
  ];
}

function generateRelatedGames(currentGame, allGames, count = 8) {
  const currentSlug = currentGame.slug.toLowerCase();
  const currentTitle = currentGame.title.toLowerCase();
  const currentCategory = currentGame.category.toLowerCase();

  const keywords = currentTitle
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["game", "play", "free", "online", "simulator", "2024", "2025", "2026"].includes(w));

  const scored = [];

  for (const g of allGames) {
    if (g.slug.toLowerCase() === currentSlug) continue;

    let score = 0;
    const gTitle = g.title.toLowerCase();
    const gCat = g.category.toLowerCase();

    if (gCat === currentCategory) score += 2;

    for (const kw of keywords) {
      if (gTitle.includes(kw)) score += 4;
    }

    if (score > 0) {
      scored.push({ slug: g.slug, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const chosen = new Set();
  for (const item of scored) {
    chosen.add(item.slug);
    if (chosen.size === count) break;
  }

  if (chosen.size < count) {
    for (const g of allGames) {
      if (g.slug.toLowerCase() !== currentSlug && !chosen.has(g.slug)) {
        if (g.category.toLowerCase() === currentCategory) {
          chosen.add(g.slug);
          if (chosen.size === count) break;
        }
      }
    }
  }

  if (chosen.size < count) {
    for (const g of allGames) {
      if (g.slug.toLowerCase() !== currentSlug && !chosen.has(g.slug)) {
        chosen.add(g.slug);
        if (chosen.size === count) break;
      }
    }
  }

  return Array.from(chosen).slice(0, count);
}

// Combinatorial Sentence Pools for 150-300 word unique generation with extremely low similarity
const HOOK_POOL = [
  (t, c) => `In ${t}, players dive straight into an engaging ${c.toLowerCase()} experience crafted for instant browser play.`,
  (t, c) => `${t} brings fast-paced ${c.toLowerCase()} action directly to your screen with intuitive mechanics and clear goals.`,
  (t, c) => `Step into the vibrant world of ${t}, a browser-based ${c.toLowerCase()} title featuring responsive handling and escalating challenges.`,
  (t, c) => `Delivering exciting ${c.toLowerCase()} gameplay, ${t} tasks players with navigating distinct obstacle courses and stage mechanics.`,
  (t, c) => `Experience the thrills of ${t}, where quick decision-making and precise execution are central to conquering every round.`,
  (t, c) => `Take on the inventive challenges of ${t}, a standout addition to the ${c.toLowerCase()} genre that rewards smart play.`,
  (t, c) => `Enter the captivating environment of ${t}, where every single stage presents a fresh test of ${c.toLowerCase()} skill.`,
  (t, c) => `Immerse yourself in ${t}, an exciting ${c.toLowerCase()} release engineered for players seeking swift, rewarding sessions.`,
  (t, c) => `${t} delivers an interactive ${c.toLowerCase()} playground that challenges your timing, planning, and reflexes.`,
  (t, c) => `Prepare for an adrenaline-fueled journey in ${t}, designed specifically for seamless online gaming on any screen.`,
  (t, c) => `Welcome to the demanding environment of ${t}, where calculated tactics and steady hands guide you through every trial.`,
  (t, c) => `${t} invites players to explore an original ${c.toLowerCase()} landscape full of dynamic hurdles and interactive surprises.`,
  (t, c) => `Test your capabilities with ${t}, an action-oriented ${c.toLowerCase()} title offering immediate pick-up-and-play entertainment.`,
  (t, c) => `In ${t}, every moment on the screen is packed with tension as you navigate intricate layouts and beat the clock.`,
  (t, c) => `Discover the immersive mechanics of ${t}, an accessible yet deep ${c.toLowerCase()} game playable directly in web browsers.`,
];

const PREMISE_POOL = [
  (f) => `The core objective centers on ${f}`,
  (f) => `Right from the opening sequence, players must focus on ${f}`,
  (f) => `At its heart, the core gameplay tasks you with ${f}`,
  (f) => `Your immediate assignment requires you to ${f}`,
  (f) => `Throughout each session, your success hinges on how effectively you ${f}`,
  (f) => `From the first countdown, you are challenged to ${f}`,
  (f) => `Every round emphasizes strategic execution as you ${f}`,
  (f) => `The fundamental loop is built around having players ${f}`,
  (f) => `As soon as you enter the stage, you must quickly ${f}`,
  (f) => `The primary journey pushes players to ${f}`,
];

const NUANCE_POOL = [
  () => "Clear visual indicators and immediate stage feedback ensure you learn and adapt after every attempt.",
  () => "The intuitive setup allows anyone to jump in immediately, while subtle nuances reward thoughtful observation.",
  () => "Every completed segment provides immediate gratification while encouraging you to aim for higher completion marks.",
  () => "Vibrant stage elements and fluid animations bring each individual session to life from the opening second.",
  () => "Clean mechanics keep the gameplay focused on pure player capability without unnecessary distractions.",
  () => "Balancing aggressive progress with tactical caution is what separates average attempts from flawless runs.",
  () => "Immediate control response allows you to micro-adjust your trajectory and recover smoothly from close calls.",
  () => "The pacing strikes an ideal balance between casual pick-up accessibility and deep strategic mastery.",
  () => "Dynamic layouts ensure that no two playthroughs feel identical, providing steady novelty across every attempt.",
  () => "A rewarding progression curve ensures that personal milestones feel earned through persistent practice.",
];

const HAZARD_POOL = [
  (f) => `Progressing through the game reveals deeper complications, where ${f}`,
  (f) => `As you advance further into subsequent stages, course demands rise steadily since ${f}`,
  (f) => `Navigating the environment becomes increasingly intricate as ${f}`,
  (f) => `Later milestones combine several simultaneous hazards, meaning that ${f}`,
  (f) => `The difficulty curve ramps up noticeably as ${f}`,
  (f) => `Surviving later encounters demands strict concentration because ${f}`,
  (f) => `Tighter corridors and shifting layouts push your focus as ${f}`,
  (f) => `Each new section introduces fresh dynamics where ${f}`,
  (f) => `Overcoming mid-game hurdles requires quick problem-solving since ${f}`,
  (f) => `The stakes heighten across consecutive rounds as ${f}`,
];

const FRICTION_POOL = [
  (f) => `In addition, ${f}`,
  (f) => `Simultaneously, ${f}`,
  (f) => `To maintain forward progress, ${f}`,
  (f) => `Compounding the difficulty, ${f}`,
  (f) => `At the same time, ${f}`,
  (f) => `Meanwhile, ${f}`,
  (f) => `To conquer these obstacles, ${f}`,
  (f) => `Faced with these hurdles, ${f}`,
  (f) => `Throughout these challenges, ${f}`,
  (f) => `Under these conditions, ${f}`,
];

const TACTICS_POOL = [
  () => "Adapting to unexpected layout shifts, conserving resources, and timing your moves are essential survival strategies.",
  () => "Patience and calculated positioning often prove far more effective than reckless speed when tackling choke points.",
  () => "Learning to read subtle visual signals in the stage allows you to bypass dangerous traps without hesitation.",
  () => "Mastering movement recovery and maintaining steady rhythm will consistently elevate your overall completion rate.",
  () => "Developing disciplined routes through complex sections ensures you reach goal markers with minimal errors.",
  () => "Studying obstacle movement cycles enables you to predict safe intervals rather than reacting blindly.",
  () => "Staying disciplined and anticipating corner angles helps you preserve hard-won progress through tough stages.",
  () => "Smart players prioritize steady positioning over rushed shortcuts, setting up clean pathways to victory.",
  () => "Recognizing hazard telegraphs early gives you the split-second buffer needed to execute perfect maneuvers.",
  () => "Building intuitive muscle memory through deliberate practice is the surest route to high-score domination.",
];

const TECH_POOL = [
  (t) => `Accessible directly in modern web browsers, ${t} requires no downloads or account sign-ups.`,
  (t) => `Engineered with responsive HTML5 architecture, ${t} loads rapidly on desktop PCs, laptops, and mobile phones.`,
  (t) => `With zero installation or plugin requirements, ${t} runs smoothly in your preferred internet browser.`,
  (t) => `Tailored for seamless cross-platform play, ${t} is fully compatible with desktop browsers and mobile touchscreens.`,
  (t) => `Built on lightweight web standards, ${t} provides uninterrupted performance across all contemporary devices.`,
  (t) => `Available completely free with no installations, ${t} is ready to play instantly on your computer, tablet, or phone.`,
  (t) => `Fully optimized for instant browser access, ${t} delivers silky-smooth framerates across all web platforms.`,
  (t) => `Enjoy unrestricted browser gaming with ${t} on BlockHub.games, completely free without any hidden paywalls.`,
  (t) => `With instant loading and zero download requirements, ${t} runs flawlessly across desktop computers and smartphones.`,
  (t) => `${t} delivers high-performance casual gaming straight to your screen without demanding software installations.`,
];

const CONTROLS_TEXT_POOL = [
  () => "Smooth performance on both keyboard-equipped computers and touchscreen devices ensures a responsive session.",
  () => "Intuitive desktop keys and calibrated mobile virtual controls give you pinpoint authority over every maneuver.",
  () => "Whether tapping on a phone screen or using keyboard navigation on a computer, inputs remain sharp and accurate.",
  () => "Cross-platform support ensures natural control response across Chromebooks, Windows PCs, Macs, and tablets.",
  () => "Smooth tactile feedback across physical keyboards and mobile displays keeps your focus entirely on the game.",
  () => "Calibrated input bindings eliminate delay, letting you react instantly to sudden obstacle encounters.",
  () => "Flexible controls allow you to switch seamlessly between desktop peripherals and mobile touchscreen gestures.",
  () => "Responsive controls ensure that every steering adjustment, jump, and action triggers with zero hesitation.",
  () => "Both casual touch taps and precise keyboard strokes feel natural, facilitating accurate stage navigation.",
  () => "The control layout is designed for maximum ergonomics, keeping your hands comfortable during extended runs.",
];

const CTA_POOL = [
  (t) => `Jump into the action right now on BlockHub.games and aim for top completion marks.`,
  (t) => `Launch the game today on BlockHub.games and challenge yourself to master every demanding level.`,
  (t) => `Start your playthrough on BlockHub.games and prove your mastery across the complete stage catalog.`,
  (t) => `Experience the excitement of ${t} for free on BlockHub.games and strive to beat your previous records.`,
  (t) => `Begin playing immediately on BlockHub.games and test your capabilities against the game's toughest hurdles.`,
  (t) => `Dive into the action on BlockHub.games today and discover an exciting gaming experience you can enjoy anytime.`,
  (t) => `Challenge yourself on BlockHub.games, share your top achievements with fellow players, and enjoy unblocked web gaming.`,
  (t) => `Take on ${t} right now on BlockHub.games and see how many consecutive stages you can conquer.`,
  (t) => `Play ${t} today on BlockHub.games and elevate your gaming prowess to new heights.`,
  (t) => `Head over to BlockHub.games now, grab the controls, and claim your place at the top of the leaderboard.`,
];

function buildCombinatorialAboutText(gameFacts, seed = 0) {
  const { title, category, sentences } = gameFacts;

  const f1 = sentences[0] || `${title} provides an interactive ${category.toLowerCase()} challenge with structured levels.`;
  const f2 = sentences[1] || `players navigate through varied layouts requiring quick reactions and situational awareness.`;
  const f3 = sentences[2] || `every completed section brings tighter constraints, rewarding precision and perseverance.`;

  const s1 = HOOK_POOL[Math.abs(seed * 3 + title.length) % HOOK_POOL.length](title, category);
  const s2 = PREMISE_POOL[Math.abs(seed * 7 + title.charCodeAt(0)) % PREMISE_POOL.length](f1);
  const s3 = NUANCE_POOL[Math.abs(seed * 11 + 2) % NUANCE_POOL.length]();

  const s4 = HAZARD_POOL[Math.abs(seed * 13 + title.length * 2) % HAZARD_POOL.length](f2);
  const s5 = FRICTION_POOL[Math.abs(seed * 17 + 5) % FRICTION_POOL.length](f3);
  const s6 = TACTICS_POOL[Math.abs(seed * 19 + title.charCodeAt(0) * 3) % TACTICS_POOL.length]();

  const s7 = TECH_POOL[Math.abs(seed * 23 + 4) % TECH_POOL.length](title);
  const s8 = CONTROLS_TEXT_POOL[Math.abs(seed * 29 + title.length) % CONTROLS_TEXT_POOL.length]();
  const s9 = CTA_POOL[Math.abs(seed * 31 + 7) % CTA_POOL.length](title);

  let p1 = `${s1} ${s2} ${s3}`;
  let p2 = `${s4} ${s5} ${s6}`;
  let p3 = `${s7} ${s8} ${s9}`;

  let currentWords = `${p1} ${p2} ${p3}`.split(/\s+/).filter(Boolean).length;
  if (currentWords < 155) {
    const boosters = [
      "Paying close attention to moving patterns and establishing steady rhythm will give you the decisive edge needed to succeed across harder stages.",
      "Staying focused and reacting swiftly to unexpected layout changes will keep you ahead of the game's toughest hurdles.",
      "Maintaining patience through early mistakes allows you to build the muscle memory required for high-scoring runs.",
      "Balancing rapid movement with careful hazard assessment ensures you make consistent progress across every attempt.",
    ];
    p2 = `${p2} ${boosters[Math.abs(seed) % boosters.length]}`;
  }

  return `${p1}\n\n${p2}\n\n${p3}`;
}

function ensureControlsGuide(controls, subgenre, category) {
  const result = [...(controls || [])];

  const candidateDefaults = [
    { key: "WASD / Arrow Keys", action: "Move character or navigate environment" },
    { key: "Spacebar / Action Key", action: "Execute primary action, jump, or activate boost" },
    { key: "Mouse / Left Click", action: "Aim, interact, and select menu options" },
    { key: "Touch Screen (Mobile)", action: "On-screen virtual controls and tap gestures" },
  ];

  for (const d of candidateDefaults) {
    if (result.length >= 4) break;
    const keyPrefix = d.key.toLowerCase().split(" ")[0];
    if (!result.some((c) => c.key.toLowerCase().includes(keyPrefix))) {
      result.push(d);
    }
  }

  while (result.length < 3) {
    result.push({ key: `Action Key ${result.length + 1}`, action: "Perform in-game ability or secondary move" });
  }

  return result;
}

function generateGameContent(game, allGames, attempt = 0, existingShingleMap = null) {
  const facts = extractGameFacts(game);
  if (!facts.hasSufficientInfo) {
    return {
      success: false,
      reason: facts.reason,
    };
  }

  // Generate about text with similarity-aware combinatorics
  let about = "";
  let words = 0;
  let bestSeed = attempt;

  for (let s = 0; s < 25; s++) {
    const curSeed = attempt * 100 + s + game.title.length;
    const candidateText = buildCombinatorialAboutText(facts, curSeed);
    const candidateWords = candidateText.split(/\s+/).filter(Boolean).length;

    if (candidateWords < 150 || candidateWords > 300) continue;

    // Check similarity if shingle map provided
    if (existingShingleMap) {
      const candidateShingles = get5WordShingles(candidateText);
      let maxSim = 0;
      for (const [otherSlug, otherShingles] of Object.entries(existingShingleMap)) {
        if (otherSlug.toLowerCase() === game.slug.toLowerCase()) continue;
        const sim = computeJaccardSimilarity(candidateShingles, otherShingles);
        if (sim > maxSim) maxSim = sim;
        if (sim >= 0.35) break; // Keep under safety threshold of 35% (well below 40%)
      }
      if (maxSim < 0.35) {
        about = candidateText;
        words = candidateWords;
        bestSeed = curSeed;
        break;
      }
    } else {
      about = candidateText;
      words = candidateWords;
      bestSeed = curSeed;
      break;
    }
  }

  // Fallback if strict search didn't break early
  if (!about) {
    about = buildCombinatorialAboutText(facts, attempt);
    words = about.split(/\s+/).filter(Boolean).length;
  }

  const howToPlay = `To play ${facts.title}, familiarize yourself with the input layout below. On computer, use your keyboard or mouse to navigate and interact with stage elements. On mobile and touchscreen devices, use intuitive tap and swipe gestures. Study the controls guide to achieve smooth movement and clear stage objectives.`;

  const controls = ensureControlsGuide(facts.controls, facts.subgenre, facts.category);
  const tips = getFittedTips(facts.subgenre, facts.category);
  const faq = generateSpecificFaq(facts.title, facts.category, facts.subgenre, controls);

  const meta_title = formatMetaTitle(facts.title);
  const meta_description = formatMetaDescription(facts.title, facts.category, facts.subgenre, bestSeed);

  const related = generateRelatedGames(game, allGames, 8);
  const matchedHubs = getHubsForGame(game);
  const hub_links = matchedHubs.map((h) => h.slug);

  return {
    success: true,
    data: {
      slug: game.slug,
      title: facts.title,
      category: facts.category,
      subgenre: facts.subgenre,
      content_ready: true,
      indexable: true,
      word_count: words,
      description: about,
      howToPlay,
      controls,
      tips,
      faq,
      meta_title,
      meta_description,
      related,
      hub_links,
    },
  };
}

module.exports = {
  formatMetaTitle,
  formatMetaDescription,
  getFittedTips,
  generateSpecificFaq,
  generateRelatedGames,
  buildCombinatorialAboutText,
  ensureControlsGuide,
  generateGameContent,
};
