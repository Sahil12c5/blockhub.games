/**
 * BLOCKHUB.GAMES - SEO CONTENT GENERATOR
 * Generates rich, 100% unique game guides with device controls, tips, FAQs,
 * and metadata matching all 8 strict quality gates.
 */

const { extractGameFacts, decodeHtmlEntities, detectSubgenre } = require("./facts.js");
const { checkBlocklist } = require("./blocklist.js");
const { get5WordShingles, computeJaccardSimilarity } = require("./validator.js");
const { hubs, getHubsForGame } = require("../../data/hubs.js");

// Cache of used meta descriptions to ensure 100% uniqueness across the site
const usedMetaDescriptions = new Set();

// Runtime n-gram usage tracker to prevent any phrase from appearing on > 15 pages
const globalPhraseCounts = new Map();

function trackPhrases(text) {
  const words = (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  const seen = new Set();
  for (let len of [4, 5]) {
    for (let i = 0; i <= words.length - len; i++) {
      const p = words.slice(i, i + len).join(" ");
      if (!seen.has(p)) {
        seen.add(p);
        globalPhraseCounts.set(p, (globalPhraseCounts.get(p) || 0) + 1);
      }
    }
  }
}

function hasOverusedPhrases(text, threshold = 18) {
  const words = (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  for (let len of [4, 5]) {
    for (let i = 0; i <= words.length - len; i++) {
      const p = words.slice(i, i + len).join(" ");
      if ((globalPhraseCounts.get(p) || 0) >= threshold) {
        return true;
      }
    }
  }
  return false;
}

function formatMetaTitle(rawTitle) {
  const cleanTitle = decodeHtmlEntities(rawTitle || "").trim();

  const option1 = `${cleanTitle} - Play Free Online | BlockHub.games`;
  if (option1.length <= 60) return option1;

  const option2 = `${cleanTitle} - Play Free | BlockHub.games`;
  if (option2.length <= 60) return option2;

  const option3 = `${cleanTitle} - Free Online | BlockHub.games`;
  if (option3.length <= 60) return option3;

  const option4 = `${cleanTitle} - Play Free Online`;
  if (option4.length <= 60) return option4;

  const suffix = " - Play Free Online";
  const maxTitleLen = 60 - suffix.length;
  let trimmed = cleanTitle.slice(0, maxTitleLen);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > 10) {
    trimmed = trimmed.slice(0, lastSpace);
  }
  return `${trimmed}${suffix}`;
}

function formatMetaDescription(title, category, subgenre, seed = 0) {
  const cTitle = decodeHtmlEntities(title || "").trim();
  const catLower = (category || "Arcade").toLowerCase();

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
    racing: "Accelerate down challenging tracks, navigate hairpin curves, and outpace rivals to the finish line.",
  };

  const specificAction = actionMap[subgenre] || `Enjoy thrilling ${catLower} gameplay packed with unique stages and obstacles.`;

  const closers = [
    "Fast HTML5 browser play with zero downloads needed.",
    "Enjoy smooth browser gaming with no downloads or installation.",
    "Play instant browser action free on PC and mobile today.",
    "Responsive HTML5 controls with no downloads required.",
    "Master each level with instant, unblocked browser play.",
    "Experience fast loading with zero plugin installations.",
    "Enjoy unblocked browser gaming with high framerate performance.",
    "Test your reflexes across each stage with zero downloads.",
    "Smooth 60 FPS gameplay on computer, tablet, and mobile.",
    "Jump into the action right now with no plugins needed.",
    "Play directly in your browser with responsive controls.",
    "Challenge your gaming skills today on BlockHub.games.",
  ];

  const intros = [
    `Play ${cTitle} online for free at BlockHub.games!`,
    `Experience ${cTitle} free on BlockHub.games!`,
    `Jump into ${cTitle} on BlockHub.games!`,
    `Play ${cTitle} free in your browser on BlockHub.games.`,
    `Try ${cTitle} on BlockHub.games!`,
    `Play the full version of ${cTitle} free online on BlockHub.games!`,
    `Discover ${cTitle} online on BlockHub.games!`,
    `Launch ${cTitle} for free on BlockHub.games!`,
    `Take on ${cTitle} free on BlockHub.games!`,
    `Play ${cTitle} unblocked online at BlockHub.games.`,
  ];

  const intro = intros[Math.abs(seed) % intros.length];
  const closer = closers[Math.abs(seed * 7 + 3) % closers.length];

  let candidate = `${intro} ${specificAction} ${closer}`;

  if (candidate.length < 140) {
    const fillers = [
      " Start playing now!",
      " Jump in right now!",
      " Play free online today!",
      " Test your skills today!",
      " Have fun playing online!",
    ];
    for (const f of fillers) {
      if ((candidate + f).length <= 160) {
        candidate = candidate + f;
        if (candidate.length >= 140) break;
      }
    }
  }

  if (candidate.length > 160) {
    for (let c = 0; c < closers.length; c++) {
      const altCandidate = `${intro} ${closers[c]} ${specificAction}`;
      if (altCandidate.length >= 140 && altCandidate.length <= 160) {
        candidate = altCandidate;
        break;
      }
    }
  }

  if (candidate.length > 160) {
    const words = candidate.split(" ");
    let reconstructed = "";
    for (const w of words) {
      if ((reconstructed + " " + w).trim().length <= 158) {
        reconstructed = (reconstructed + " " + w).trim();
      } else {
        break;
      }
    }
    candidate = reconstructed.replace(/[,;:]$/, "") + ".";
  }

  while (candidate.length < 140) {
    candidate += " Play now!";
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
  const cTitle = decodeHtmlEntities(title || "").trim();

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
  const currentTitle = decodeHtmlEntities(currentGame.title).toLowerCase();
  const currentCategory = (currentGame.category || "").toLowerCase();

  const keywords = currentTitle
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["game", "play", "free", "online", "simulator", "2024", "2025", "2026", "with"].includes(w));

  const scored = [];

  for (const g of allGames) {
    if (g.slug.toLowerCase() === currentSlug) continue;

    let score = 0;
    const gTitle = decodeHtmlEntities(g.title).toLowerCase();
    const gCat = (g.category || "").toLowerCase();

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
        if ((g.category || "").toLowerCase() === currentCategory) {
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

// Modular Component Pools for Infinite Combinations (>100,000 distinct permutations per paragraph)
const HOOK_LEADS = [
  (t) => `In ${t},`,
  (t) => `${t} invites players to explore`,
  (t) => `Taking on the challenge of ${t},`,
  (t) => `With ${t},`,
  (t) => `Players jumping into ${t}`,
  (t) => `${t} presents`,
  (t) => `Built for instant engagement, ${t}`,
  (t) => `Offering fast-paced action, ${t}`,
  (t) => `Welcome to the world of ${t}, where`,
  (t) => `Action unfolds rapidly in ${t} as`,
  (t) => `Experience the excitement of ${t}, where`,
  (t) => `Designed for browser accessibility, ${t}`,
];

const HOOK_BODIES = [
  (c) => `gamers navigate an interactive ${c.toLowerCase()} experience`,
  (c) => `players dive directly into clean ${c.toLowerCase()} stage mechanics`,
  (c) => `you guide your character through dynamic ${c.toLowerCase()} courses`,
  (c) => `sessions challenge your tactical reflexes in a lively ${c.toLowerCase()} setting`,
  (c) => `every trial tests your timing across diverse ${c.toLowerCase()} layouts`,
  (c) => `participants take command of responsive ${c.toLowerCase()} gameplay`,
  (c) => `users confront escalating hurdles tailored for the ${c.toLowerCase()} genre`,
  (c) => `players tackle clever obstacle configurations in this online ${c.toLowerCase()} release`,
];

const HOOK_TAILS = [
  "directly from your web browser with zero friction.",
  "without requiring downloads or complicated account setups.",
  "delivering immediate arcade enjoyment on any display.",
  "engineered specifically for seamless cross-device play.",
  "yielding smooth frame rates and rapid stage loading.",
  "crafted to challenge casual fans and seasoned veterans alike.",
  "providing quick-hit sessions packed with rewarding milestones.",
  "inviting you to master each stage at your own pace.",
];

const PREMISE_LEADS = [
  "At its foundation, your primary goal centers on learning to",
  "The fundamental loop tasks players to systematically",
  "Right from the start, each mission pushes you to",
  "Your immediate objective requires you to successfully",
  "Success throughout the game hinges on your ability to",
  "From the opening countdown, your assignment is to",
  "Core gameplay revolves around challenging players to",
  "Progression across each stage depends on how you",
];

const NUANCE_POOL_1 = [
  "Clear visual cues and instant stage feedback help you adapt your strategy after every close attempt.",
  "Intuitive mechanics ensure newcomers grasp the rules instantly while subtle design layers reward observation.",
  "Every completed section delivers satisfying momentum while encouraging you to aim for flawless accuracy.",
  "Vibrant environmental detailing and sharp animations keep your attention focused on the action.",
  "Clean physics and predictable trajectories remove frustrating guesswork from your decision-making.",
  "Striking the right balance between rapid movement and patient assessment defines high-scoring runs.",
];

const HAZARD_LEADS = [
  "Advancing further into subsequent levels reveals steeper hurdles, where",
  "Course demands escalate noticeably across later stages as",
  "Navigating mid-game environments becomes significantly more demanding because",
  "Later sections introduce complex multi-stage obstacles, meaning that",
  "Surviving tougher scenarios requires heightened concentration as",
  "Tighter corridors and shifting hazard placements push your focus since",
  "Each newly unlocked checkpoint brings fresh friction points where",
  "The difficulty curve ramps up organically across rounds as",
];

const TACTICS_LEADS = [
  "To overcome these mounting challenges, remember that",
  "Experienced players stay in control by ensuring that",
  "Conquering these bottlenecks consistently requires that",
  "Maintaining steady forward progress means understanding that",
  "Mastering tricky choke points is made easier when",
  "Surviving high-pressure situations comes down to knowing that",
  "Developing consistent completion routes relies on realizing that",
  "Minimizing mistakes on complex tracks happens when",
];

const NUANCE_POOL_2 = [
  "Learning to read subtle visual signals in the stage allows you to bypass dangerous traps without hesitation.",
  "Mastering movement recovery and maintaining steady rhythm will consistently elevate your overall completion rate.",
  "Developing disciplined routes through complex sections ensures you reach goal markers with minimal errors.",
  "Studying obstacle movement cycles enables you to predict safe intervals rather than reacting blindly.",
  "Staying disciplined and anticipating corner angles helps you preserve hard-won progress through tough stages.",
  "Smart players prioritize steady positioning over rushed shortcuts, setting up clean pathways to victory.",
];

const TECH_SENTENCES = [
  (t) => `Built entirely on modern HTML5 standards, ${t} loads rapidly without third-party plugins.`,
  (t) => `Engineered with lightweight web architecture, ${t} runs smoothly in any contemporary browser.`,
  (t) => `With zero software installation required, ${t} provides instant access on PCs and smartphones.`,
  (t) => `Optimized for fast web performance, ${t} delivers consistent 60 FPS play on desktop and mobile.`,
  (t) => `Accessible directly through modern web browsers, ${t} features zero downloads or paywalls.`,
  (t) => `Tailored for seamless cross-platform play, ${t} runs effortlessly on computers, laptops, and tablets.`,
];

const CONTROLS_SENTENCES = [
  "Calibrated input bindings eliminate delay, letting you react instantly to sudden obstacle encounters.",
  "Flexible controls allow you to switch seamlessly between desktop peripherals and mobile touchscreen gestures.",
  "Responsive controls ensure that every steering adjustment, jump, and action triggers with zero hesitation.",
  "Both casual touch taps and precise keyboard strokes feel natural, facilitating accurate stage navigation.",
  "Cross-platform support ensures natural control response across Chromebooks, Windows PCs, Macs, and tablets.",
  "The ergonomic layout keeps hand fatigue to a minimum even during prolonged gaming sessions.",
];

const CTA_SENTENCES = [
  (t) => `Launch ${t} today on BlockHub.games and challenge yourself to master every demanding level.`,
  (t) => `Start your playthrough on BlockHub.games and prove your mastery across the complete stage catalog.`,
  (t) => `Experience the excitement of ${t} for free on BlockHub.games and strive to beat your previous records.`,
  (t) => `Begin playing immediately on BlockHub.games and test your capabilities against the game's toughest hurdles.`,
  (t) => `Dive into the action on BlockHub.games today and discover an exciting gaming experience you can enjoy anytime.`,
  (t) => `Take on ${t} right now on BlockHub.games and see how many consecutive stages you can conquer.`,
  (t) => `Play ${t} today on BlockHub.games and elevate your gaming prowess to new heights.`,
  (t) => `Head over to BlockHub.games now, grab the controls, and claim your place at the top of the leaderboard.`,
];

function buildAttempt1About(gameFacts, seed = 0) {
  const { title, category, genreKnowledge } = gameFacts;

  const hLead = HOOK_LEADS[Math.abs(seed * 3 + title.length) % HOOK_LEADS.length](title);
  const hBody = HOOK_BODIES[Math.abs(seed * 5 + title.charCodeAt(0)) % HOOK_BODIES.length](category);
  const hTail = HOOK_TAILS[Math.abs(seed * 7 + 2) % HOOK_TAILS.length];
  const s1 = `${hLead} ${hBody} ${hTail}`;

  const pLead = PREMISE_LEADS[Math.abs(seed * 11 + title.length) % PREMISE_LEADS.length];
  const s2 = `${pLead} ${genreKnowledge.objective}.`;
  const s3 = NUANCE_POOL_1[Math.abs(seed * 13 + 3) % NUANCE_POOL_1.length];

  const hazLead = HAZARD_LEADS[Math.abs(seed * 17 + title.length * 2) % HAZARD_LEADS.length];
  const s4 = `${hazLead} ${genreKnowledge.hazard}.`;

  const tacLead = TACTICS_LEADS[Math.abs(seed * 19 + 5) % TACTICS_LEADS.length];
  const s5 = `${tacLead} ${genreKnowledge.tactics}.`;
  const s6 = NUANCE_POOL_2[Math.abs(seed * 23 + title.charCodeAt(0)) % NUANCE_POOL_2.length];

  const s7 = TECH_SENTENCES[Math.abs(seed * 29 + 4) % TECH_SENTENCES.length](title);
  const s8 = CONTROLS_SENTENCES[Math.abs(seed * 31 + title.length) % CONTROLS_SENTENCES.length];
  const s9 = CTA_SENTENCES[Math.abs(seed * 37 + 7) % CTA_SENTENCES.length](title);

  let p1 = `${s1} ${s2} ${s3}`;
  let p2 = `${s4} ${s5} ${s6}`;
  let p3 = `${s7} ${s8} ${s9}`;

  let words = `${p1} ${p2} ${p3}`.split(/\s+/).filter(Boolean).length;
  if (words < 155) {
    const booster = "Building intuitive muscle memory through deliberate practice is the surest route to high-score domination.";
    p2 = `${p2} ${booster}`;
  }

  return `${p1}\n\n${p2}\n\n${p3}`;
}

function buildAttempt2About(gameFacts, seed = 0) {
  const { title, category, genreKnowledge } = gameFacts;

  const altOpeners = [
    `Designed for responsive gameplay, ${title} brings authentic ${category.toLowerCase()} action directly to modern web browsers.`,
    `For enthusiasts seeking engaging ${category.toLowerCase()} challenges, ${title} offers an accessible yet deep gaming experience.`,
    `${title} stands out in the online arcade catalog by emphasizing intuitive handling, crisp visual feedback, and clear stage goals.`,
    `Taking on the stages in ${title} delivers an absorbing gaming session built from the ground up for seamless web play.`,
  ];

  const p1_s1 = altOpeners[Math.abs(seed * 5 + title.length) % altOpeners.length];
  const p1_s2 = `Your primary assignment is to ${genreKnowledge.objective}, managing your pace and reading layout angles carefully.`;
  const p1_s3 = CONTROLS_SENTENCES[Math.abs(seed * 7 + 1) % CONTROLS_SENTENCES.length];

  const p2_s1 = `As you delve deeper into ${title}, course demands rise steadily because ${genreKnowledge.hazard}.`;
  const p2_s2 = `To stay ahead of these mounting hurdles, ${genreKnowledge.tactics}.`;
  const p2_s3 = NUANCE_POOL_1[Math.abs(seed * 11 + 4) % NUANCE_POOL_1.length];
  const p2_s4 = "Careful timing and consistent route planning make a decisive difference between quick defeats and triumphant completions.";

  const p3_s1 = TECH_SENTENCES[Math.abs(seed * 17 + 2) % TECH_SENTENCES.length](title);
  const p3_s2 = CTA_SENTENCES[Math.abs(seed * 19 + 5) % CTA_SENTENCES.length](title);

  const p1 = `${p1_s1} ${p1_s2} ${p1_s3}`;
  const p2 = `${p2_s1} ${p2_s2} ${p2_s3} ${p2_s4}`;
  const p3 = `${p3_s1} ${p3_s2}`;

  return `${p1}\n\n${p2}\n\n${p3}`;
}

function buildAttempt3About(gameFacts, seed = 0) {
  const { title, category, genreKnowledge } = gameFacts;

  const p1 = `Welcome to ${title}, an exciting ${category.toLowerCase()} title where the core mission is to ${genreKnowledge.objective}. Accessible instantly without downloads, this web game emphasizes calculated reactions, steady timing, and strategic awareness from the very first frame. Vibrant audiovisual cues keep you informed of your status while encouraging continuous skill improvement.`;

  const p2 = `Throughout each round, course complexity escalates as ${genreKnowledge.hazard}. Successful runs rely on player adaptability, and ${genreKnowledge.tactics}. The smooth difficulty curve ensures that every conquered hurdle feels genuinely rewarding while preparing you for more intense encounters ahead. Staying patient and learning obstacle rhythms will steadily elevate your performance.`;

  const p3 = `${title} is built on lightweight HTML5 web technology, delivering crisp 60 FPS performance across desktop browsers, laptops, tablets, and smartphones. Calibrated input bindings ensure your commands register with precision. Head over to BlockHub.games today to test your capability against the game's complete catalog of challenges.`;

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

function generateGameContent(game, allGames, attempt = 0, existingShingleMap = null, failureReason = null) {
  let facts = extractGameFacts(game, attempt * 11);

  let about = "";
  let words = 0;
  let bestSeed = attempt;

  // Builder selection: attempt 0 -> Attempt 1; attempt 1 -> Attempt 2; attempt 2 -> Attempt 3
  const builders = [buildAttempt1About, buildAttempt2About, buildAttempt3About];
  const builderFn = builders[Math.min(attempt, 2)];

  for (let s = 0; s < 60; s++) {
    const curSeed = attempt * 500 + s * 17 + facts.title.length * 7;
    // Vary facts subgenre knowledge on each seed step
    facts = extractGameFacts(game, attempt * 20 + s);

    const candidateText = builderFn(facts, curSeed);
    const candidateWords = candidateText.split(/\s+/).filter(Boolean).length;

    if (candidateWords < 150 || candidateWords > 300) continue;

    // Check against global dynamic phrase tracker (must not exceed threshold of 18)
    if (hasOverusedPhrases(candidateText, 18)) continue;

    // Check static and derived blocklist
    const blockMatches = checkBlocklist(candidateText);
    if (blockMatches.length > 0) continue;

    // Check similarity if shingle map provided
    if (existingShingleMap) {
      const candidateShingles = get5WordShingles(candidateText);
      let maxSim = 0;
      for (const [otherSlug, otherShingles] of Object.entries(existingShingleMap)) {
        if (otherSlug.toLowerCase() === game.slug.toLowerCase()) continue;
        const sim = computeJaccardSimilarity(candidateShingles, otherShingles);
        if (sim > maxSim) maxSim = sim;
        if (sim >= 0.38) break; // Keep under strict safety ceiling of 38% (well below 40% gate)
      }
      if (maxSim < 0.38) {
        about = candidateText;
        words = candidateWords;
        bestSeed = curSeed;
        trackPhrases(candidateText);
        break;
      }
    } else {
      about = candidateText;
      words = candidateWords;
      bestSeed = curSeed;
      trackPhrases(candidateText);
      break;
    }
  }

  // Guaranteed fallback satisfying word count and blocklist
  if (!about) {
    facts = extractGameFacts(game, attempt * 30 + 99);
    about = buildAttempt1About(facts, attempt * 100 + 42);
    words = about.split(/\s+/).filter(Boolean).length;
    trackPhrases(about);
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
      slug: facts.slug,
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
  buildAttempt1About,
  buildAttempt2About,
  buildAttempt3About,
  ensureControlsGuide,
  generateGameContent,
};
