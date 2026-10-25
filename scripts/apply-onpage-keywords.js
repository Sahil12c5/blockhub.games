/**
 * scripts/apply-onpage-keywords.js
 * 
 * Applies refined visible SEO keyword text and meta descriptions strictly according to user rules:
 * 1. Zero unsupported claims (no leaderboard, achievement, boss, multi-level, diesel, tuning, zero lag, co-op, family-friendly, account, tournament)
 * 2. 9 Hubs & 8 Categories: 1 intro paragraph (60-90 words, 2-3 keywords, exact real game count) + meta description (120-160 chars)
 * 3. 2-Player Hub: rewritten as "five 2 player games"
 * 4. Homepage: 1 intro paragraph (50-80 words, 2-3 broad keywords)
 * 5. 400 Game Pages:
 *    - Meta description: restore brand ending "on BlockHub.games", use best-fit hub, change only where natural in 120-160 chars, leave others alone.
 *    - Related heading: keyword heading ("More free car games online") only if >= 60% of related list matches that hub/cat. Otherwise "More {category} games".
 * 6. Generates /reports/onpage-keywords-diff.csv
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. Curated Data for 9 Hubs (Zero banned claims, 100% grounded in real games)
const hubData = {
  'car-parking': {
    games: 37,
    kws: ['car parking games', 'car simulator online', 'precision driving games'],
    text: 'Sharpen your steering judgment across our collection of 37 car parking games. Whether maneuvering sedans into narrow parking spaces or clearing crowded jams, these titles demand patience, smooth throttle control, and accurate reverse alignment. Experience responsive vehicle handling in each car simulator online while avoiding traffic pylons and high curbs. Jump directly into these precision driving games on your screen and dock every vehicle cleanly.',
    meta: 'Play 37 free car parking games online at BlockHub.games. Master tight garage maneuvers, reverse steering, and parallel parking with zero downloads.'
  },
  'truck-driving': {
    games: 40,
    kws: ['truck driving games', 'heavy cargo simulator', 'semi truck games'],
    text: 'Take the wheel of commercial rigs across our collection of 40 truck driving games. Transporting heavy cargo containers and fuel tanks requires wide turns and careful braking before steep inclines. Step into each challenging heavy cargo simulator to maneuver loaded flatbeds across rugged dirt paths and highway corridors. Fans of semi truck games can test their road navigation skills directly in their browser.',
    meta: 'Explore 40 realistic truck driving games on BlockHub.games. Command massive commercial haulers and transport heavy cargo with instant browser loading.'
  },
  'stickman': {
    games: 25,
    kws: ['stickman games online', 'stickman fighting games', 'free stickman games'],
    text: 'Experience rapid motion and chaotic physics across our lineup of 25 stickman games online. Featuring iconic dark silhouettes, these adventures focus on acrobatic swinging, weapon duels, and running trials. Jump into fast stickman fighting games to clash with rival runners or dodge hazardous obstacles on elevated platforms. Dive into these free stickman games and test your timing on every run.',
    meta: 'Play 25 free stickman games online at BlockHub.games. Enjoy dynamic ragdoll brawls, archery duels, and acrobatic obstacle courses with zero downloads.'
  },
  'bubble-shooter': {
    games: 12,
    kws: ['bubble shooter online', 'free bubble shooter games', 'bubble pop games'],
    text: 'Match colorful spheres and clear descending boards across our selection of 12 bubble shooter online titles. Plan your shots carefully by bouncing projectiles off side walls to reach high cluster anchors before the ceiling drops. Players looking for relaxing free bubble shooter games will enjoy smooth trajectory lines and chain bursts. Enjoy these vibrant bubble pop games on your screen and keep the board clear.',
    meta: 'Enjoy 12 classic bubble shooter online games on BlockHub.games. Aim matching spheres, trigger cascading combos, and clear puzzle boards free online.'
  },
  '2-player': {
    games: 5,
    kws: ['2 player games', 'shared keyboard games', 'two player games'],
    text: 'Challenge a friend to head-to-head competition across our collection of five 2 player games. Built for local shared-screen duels, these shared keyboard games let you race up staircases, shoot basketball hoops, and test your reaction speeds on a single device. Whether jumping across floating platforms or balancing bicycles side by side, these two player games deliver instant competitive action without downloads.',
    meta: 'Challenge friends across 5 exciting 2 player games free on BlockHub.games. Compete on a shared keyboard in 1v1 racing and athletic duels with no setup.'
  },
  'obby': {
    games: 24,
    kws: ['obby games online', 'parkour games online', 'obstacle course games'],
    text: 'Master precision jumping and vertical climbs across 24 obby games online. Leap across vanishing stepping stones, avoid rotating beams, and maintain steady momentum over steep drops. These parkour games online challenge your spatial awareness as you time each landing between floating platforms. Guide your character through these obstacle course games and touch each checkpoint to reach safety.',
    meta: 'Conquer 24 challenging obby games online on BlockHub.games. Leap across floating platforms, dodge moving traps, and master sky parkour courses free.'
  },
  'zombie': {
    games: 49,
    kws: ['zombie games online', 'zombie survival games', 'undead defense games'],
    text: 'Hold defensive barricades against undead hordes in our collection of 49 zombie games online. Arm yourself with rifles and projectile cannons to stop advancing walkers across desolate highways and fortified camps. Fans of tactical zombie survival games must ration munitions and choose effective defensive choke points. Stand firm in these gripping undead defense games and clear the streets.',
    meta: 'Battle through 49 intense zombie games online at BlockHub.games. Fortify defensive barricades, manage ammo, and survive endless undead waves free.'
  },
  'football-soccer': {
    games: 46,
    kws: ['soccer games online free', 'free kick simulator', 'penalty shootout online'],
    text: 'Step onto the pitch and practice your shooting accuracy across 46 soccer games online free to play. Bend curved strikes around defensive walls in a realistic free kick simulator, or outsmart goalkeepers in sudden-death shootout rounds. Whether timing one-touch volleys or winning high-pressure penalty shootout online duels, these athletic challenges deliver instant sports action in your browser.',
    meta: 'Score winning goals across 46 soccer games online free at BlockHub.games. Master curving free kicks, penalty shootouts, and quick match duels today.'
  },
  'halloween': {
    games: 14,
    kws: ['halloween games online', 'pumpkin games online', 'spooky games free'],
    text: 'Explore eerie dungeons and midnight ruins in our curated collection of 14 halloween games online. Guide masked heroes past creeping skeletons, solve haunted chamber puzzles, and collect autumn treats along dark corridors. From carving glowing faces in pumpkin games online to outrunning graveyard traps, these spooky games free offer atmospheric entertainment without downloads.',
    meta: 'Celebrate the season with 14 atmospheric halloween games online at BlockHub.games. Explore haunted mazes, carve pumpkins, and solve spooky puzzles free.'
  }
};

// 2. Curated Data for 8 Categories (Zero banned claims, 100% grounded in real games)
const categoryData = {
  'action': {
    games: 50,
    kws: ['action games online free', 'combat games', 'arcade action games'],
    text: 'Unleash rapid hand strikes and tactical moves across our roster of 50 action games online free on BlockHub.games. From one-on-one martial arts brawls to crowded stickman runs, these combat games demand sharp reflex timing and keen spacing. Dodge incoming hazards, execute fluid attack combinations, and clear hostile arenas in fast arcade action games that launch instantly in your web browser.',
    meta: 'Play 50 top action games online free at BlockHub.games. Master martial arts brawlers, arena battles, and reflex challenges with zero installations.'
  },
  'racing': {
    games: 49,
    kws: ['car games online', 'driving games online', 'online car racing games'],
    text: 'Hit full throttle across our diverse lineup of 49 car games online. Whether sliding through tight city corners in sports cars or steering heavy trucks over rough mountain roads, these driving games online test your vehicle control. Overtake rivals, dodge roadside obstacles, and post rapid lap times in competitive online car racing games built for instant browser play.',
    meta: 'Race full throttle across 49 car games online on BlockHub.games. Master high-speed corners, highway tracks, and obstacle courses with zero downloads.'
  },
  'shooting': {
    games: 50,
    kws: ['shooting games online for free', 'fps games online', 'gun games online'],
    text: 'Test your aim and crosshair discipline across 50 shooting games online for free. Whether lining up long-distance targets in fps games online or clearing indoor hallways with shotguns, steady mouse control is crucial. Manage ammunition, take cover from return fire, and defeat advancing enemies in tactical gun games online that stream smoothly without extra files.',
    meta: 'Engage hostile targets in 50 shooting games online for free on BlockHub.games. Master tactical crosshairs, sniper rifles, and combat arenas free.'
  },
  'puzzle': {
    games: 50,
    kws: ['puzzle games online for free', 'free online puzzle games no download', 'logic games online'],
    text: 'Challenge your analytical thinking and pattern recognition across 50 puzzle games online for free. Sort matching color tiles, clear jammed vehicle depots, and connect intricate line paths across varied brain teaser stages. These free online puzzle games no download demand methodical reasoning and patience to solve every puzzle layout. Sharpen your spatial awareness and clear tricky boards in these engaging logic games online.',
    meta: 'Exercise your mind with 50 puzzle games online for free at BlockHub.games. Solve mechanical brain-teasers, tile matches, and spatial logic challenges.'
  },
  'sports': {
    games: 50,
    kws: ['sports games online', 'soccer games online free', 'sports video games'],
    text: 'Step onto the athletic field across our dynamic collection of 50 sports games online. Curve free-kick shots past defensive walls in soccer games online free, sink clean basketball jumpshots, or sprint down snowy ski slopes. Sharpen your reaction timing, outplay computerized opponents, and score decisive points in these responsive sports video games playable directly in your browser.',
    meta: 'Compete for high scores in 50 sports games online at BlockHub.games. Enjoy realistic soccer shootouts, basketball hoops, and winter downhill runs.'
  },
  'multiplayer': {
    games: 51,
    kws: ['online multiplayer games for free', 'multiplayer games fun', 'multiplayer games online'],
    text: 'Compete with friends or challenge rivals across our collection of 51 online multiplayer games for free. Play side by side in shared-keyboard duels, race across obstacle tracks, and defend mining drills against advancing zombie waves. These interactive titles make multiplayer games fun and accessible on any device. Jump straight into active multiplayer games online and test your skills in fast-paced head-to-head matches.',
    meta: 'Play 51 online multiplayer games for free on BlockHub.games. Challenge friends in shared keyboard battles, runner races, and head-to-head arena duels.'
  },
  'adventure': {
    games: 50,
    kws: ['adventure games online for free', 'platform games online', 'free adventure games online'],
    text: 'Embark on daring journeys across uncharted landscapes in our collection of 50 adventure games online for free. Navigate brave characters past spike traps, leap between suspended platforms, and dodge rolling hazards in classic platform games online. Collect keys, unlock distant gateways, and explore expansive voxel realms in these free adventure games online that run directly in your browser.',
    meta: 'Explore uncharted worlds in 50 adventure games online for free at BlockHub.games. Master platforming trails, dodge traps, and unlock voxel realms free.'
  },
  'arcade': {
    games: 50,
    kws: ['classic arcade games online free', 'play arcade games online', 'free arcade games to play online'],
    text: 'Rediscover pure reflex entertainment across our curated catalog of 50 classic arcade games online free. Dodge falling obstacles, pop colorful balloons, and shatter descending blocks with responsive controls and fast restarts. Players wanting to play arcade games online will appreciate the quick loading times and intuitive inputs across every title. Jump into these free arcade games to play online and chase your personal best scores directly in your browser.',
    meta: 'Enjoy 50 classic arcade games online free on BlockHub.games. Relive timeless reflex challenges, high score chasers, and obstacle runs in your browser.'
  }
};

const homeParagraph = {
  kws: ['free online games', 'browser games', 'no download'],
  text: 'Welcome to our gaming catalog where you can discover hundreds of free online games across racing, shooting, puzzle, and sports genres. Our lightweight browser games load directly on your desktop or mobile screen with no download required, ensuring seamless entertainment anytime you want a quick play session. Browse our curated library and jump straight into your next favorite title.'
};

const diffRows = [];

function csvEscape(str) {
  if (str === null || str === undefined) return '""';
  const s = String(str);
  if (s.includes('"') || s.includes(',') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return `"${s}"`;
}

console.log('=== Step 1: Update data/hubs.js ===');
let hubsJs = fs.readFileSync(path.join(ROOT, 'data/hubs.js'), 'utf8');
const { hubs } = require('../data/hubs.js');

hubs.forEach((hub) => {
  const data = hubData[hub.slug];
  if (!data) return;

  diffRows.push({
    page: `/tag/${hub.slug}`,
    element: 'intro_paragraph',
    before: '',
    after: data.text,
    keywords_added: data.kws.join(' | ')
  });

  diffRows.push({
    page: `/tag/${hub.slug}`,
    element: 'meta_description',
    before: hub.metaDescription,
    after: data.meta,
    keywords_added: data.kws[0]
  });
});

Object.entries(hubData).forEach(([slug, data]) => {
  const slugRegex = new RegExp(`slug:\\s*["']${slug}["'],[\\s\\S]*?metaDescription:\\s*["'][\\s\\S]*?["'],`, 'm');
  const match = hubsJs.match(slugRegex);
  if (match) {
    let block = match[0];
    if (block.includes('introParagraph:')) {
      block = block.replace(/introParagraph:\s*["'][\s\S]*?["'],/, '');
    }
    const updated = block.replace(
      /metaDescription:\s*["'][\s\S]*?["'],/,
      `metaDescription:\n      "${data.meta}",\n    introParagraph:\n      "${data.text}",`
    );
    hubsJs = hubsJs.replace(match[0], updated);
  }
});
fs.writeFileSync(path.join(ROOT, 'data/hubs.js'), hubsJs, 'utf8');
console.log('Updated data/hubs.js with cleaned introParagraph and metaDescription for 9 hubs.');

console.log('=== Step 2: Update data/categories.js ===');
let categoriesJs = fs.readFileSync(path.join(ROOT, 'data/categories.js'), 'utf8');
const { categories } = require('../data/categories.js');

categories.forEach((cat) => {
  const data = categoryData[cat.slug];
  if (!data) return;

  diffRows.push({
    page: `/category/${cat.slug}`,
    element: 'intro_paragraph',
    before: '',
    after: data.text,
    keywords_added: data.kws.join(' | ')
  });

  const oldMeta = `Play the best free ${cat.name} games unblocked in your browser. Fast HTML5 web games with zero downloads.`;
  diffRows.push({
    page: `/category/${cat.slug}`,
    element: 'meta_description',
    before: oldMeta,
    after: data.meta,
    keywords_added: data.kws[0]
  });
});

Object.entries(categoryData).forEach(([slug, data]) => {
  const slugRegex = new RegExp(`slug:\\s*["']${slug}["'],[\\s\\S]*?description:\\s*["'][\\s\\S]*?["'],`, 'm');
  const match = categoriesJs.match(slugRegex);
  if (match) {
    let block = match[0];
    if (block.includes('metaDescription:')) {
      block = block.replace(/metaDescription:\s*["'][\s\S]*?["'],\s*/, '');
    }
    if (block.includes('introParagraph:')) {
      block = block.replace(/introParagraph:\s*["'][\s\S]*?["'],\s*/, '');
    }
    const descMatch = block.match(/description:\s*([\s\S]*?),/);
    const originalDesc = descMatch[1].trim().replace(/^["']|["']$/g, '');
    const updated = block.replace(
      /description:\s*["'][\s\S]*?["'],/,
      `description:\n      ${JSON.stringify(originalDesc)},\n    metaDescription:\n      "${data.meta}",\n    introParagraph:\n      "${data.text}",`
    );
    categoriesJs = categoriesJs.replace(match[0], updated);
  }
});
fs.writeFileSync(path.join(ROOT, 'data/categories.js'), categoriesJs, 'utf8');
console.log('Updated data/categories.js with cleaned metaDescription and introParagraph for 8 categories.');

console.log('=== Step 3: Update app/category/[name]/page.js ===');
let categoryPageJs = fs.readFileSync(path.join(ROOT, 'app/category/[name]/page.js'), 'utf8');
if (!categoryPageJs.includes('category.introParagraph')) {
  categoryPageJs = categoryPageJs.replace(
    '{/* Games Grid for This Category with Crawlable Pagination */}\n      <section className="space-y-4">',
    `{/* Games Grid for This Category with Crawlable Pagination */}\n      <section className="space-y-4">\n        {category.introParagraph && (\n          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">\n            {category.introParagraph}\n          </p>\n        )}`
  );
  fs.writeFileSync(path.join(ROOT, 'app/category/[name]/page.js'), categoryPageJs, 'utf8');
}

console.log('=== Step 4: Update app/tag/[tag]/page.js ===');
let tagPageJs = fs.readFileSync(path.join(ROOT, 'app/tag/[tag]/page.js'), 'utf8');
if (!tagPageJs.includes('hub.introParagraph')) {
  tagPageJs = tagPageJs.replace(
    '{/* Games Grid for This Topic Hub */}\n      <section className="space-y-4">',
    `{/* Games Grid for This Topic Hub */}\n      <section className="space-y-4">\n        {hub.introParagraph && (\n          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">\n            {hub.introParagraph}\n          </p>\n        )}`
  );
  fs.writeFileSync(path.join(ROOT, 'app/tag/[tag]/page.js'), tagPageJs, 'utf8');
}

console.log('=== Step 5: Update app/page.js ===');
let homePageJs = fs.readFileSync(path.join(ROOT, 'app/page.js'), 'utf8');
diffRows.push({
  page: '/',
  element: 'intro_paragraph',
  before: '',
  after: homeParagraph.text,
  keywords_added: homeParagraph.kws.join(' | ')
});
if (!homePageJs.includes(homeParagraph.text)) {
  homePageJs = homePageJs.replace(
    '{/* Category Chips & Filterable Paginated Game Grid */}\n      <HomeGameExplorer',
    `{/* Visible Curated SEO Keyword Intro */}\n      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">\n        ${homeParagraph.text}\n      </p>\n\n      {/* Category Chips & Filterable Paginated Game Grid */}\n      <HomeGameExplorer`
  );
  fs.writeFileSync(path.join(ROOT, 'app/page.js'), homePageJs, 'utf8');
}

console.log('=== Step 6 & 7: Update Game Pages (400) ===');
const { topGamesContent } = require('../data/top-games-content.js');
const { getAllGames, getGameBySlug, getRelatedGames } = require('../data/games.js');
const allGames = getAllGames();

function getBestFitHub(game) {
  if (!game) return 'cat:action';
  const title = (game.title || '').toLowerCase();
  const subgenre = (game.subgenre || '').toLowerCase();
  const desc = (game.description || '').toLowerCase();

  // Rule 3: a game with "2 Players" in its title uses the 2-player keyword, not stickman
  if (/\b(2\s*player|2\s*players|two\s*player|two\s*players|for\s*2\s*players|for\s*two\s*players|2-player)\b/i.test(title)) return '2-player';
  if (/\b(tanker|tankers|truck|trucks|hauler|haulers|semi|18\s*wheeler)\b/i.test(title)) return 'truck-driving';
  if (/\b(parking|park\b)/i.test(title)) return 'car-parking';
  if (/\b(stickman|stickmen|stick\s+)\b/i.test(title)) return 'stickman';
  if (/\b(bubble|bubbles)\b/i.test(title)) return 'bubble-shooter';
  if (/\b(obby|parkour)\b/i.test(title)) return 'obby';
  if (/\b(zombie|zombies|undead)\b/i.test(title)) return 'zombie';
  if (/\b(soccer|football|penalty|free\s*kick)\b/i.test(title)) return 'football-soccer';
  if (/\b(halloween|spooky|pumpkin|pumpkins)\b/i.test(title)) return 'halloween';

  if (['2-player', 'truck-driving', 'car-parking', 'stickman', 'bubble-shooter', 'obby', 'zombie', 'football-soccer', 'halloween'].includes(subgenre)) {
    return subgenre;
  }

  if (/\b(2\s*player|two\s*player|shared\s*keyboard)\b/i.test(desc)) return '2-player';
  if (/\b(tanker|truck|hauler|semi\s*truck)\b/i.test(desc)) return 'truck-driving';
  if (/\b(parking|park\s+car)\b/i.test(desc)) return 'car-parking';
  if (/\b(stickman|stickmen)\b/i.test(desc)) return 'stickman';
  if (/\b(bubble\s*shooter)\b/i.test(desc)) return 'bubble-shooter';
  if (/\b(parkour|obstacle\s*course|obby)\b/i.test(desc)) return 'obby';
  if (/\b(zombie|undead)\b/i.test(desc)) return 'zombie';
  if (/\b(soccer|football|penalty)\b/i.test(desc)) return 'football-soccer';
  if (/\b(halloween|spooky)\b/i.test(desc)) return 'halloween';

  return 'cat:' + (game.category || '').toLowerCase();
}

function getHubKeywords(hub) {
  switch (hub) {
    case '2-player': return ['2 player games online', '2 player games'];
    case 'truck-driving': return ['truck driving games', 'truck games online', 'semi truck games'];
    case 'car-parking': return ['car games online', 'car parking games'];
    case 'stickman': return ['stickman games online', 'stickman games', 'free stickman games'];
    case 'bubble-shooter': return ['bubble shooter online', 'bubble pop games'];
    case 'obby': return ['obby games online', 'parkour games online', 'obby games'];
    case 'zombie': return ['zombie games online', 'zombie games'];
    case 'football-soccer': return ['soccer games online', 'soccer games'];
    case 'halloween': return ['halloween games online', 'spooky games'];
    case 'cat:action': return ['action games online', 'combat games'];
    case 'cat:racing': return ['car games online', 'driving games online'];
    case 'cat:shooting': return ['shooting games online', 'gun games online'];
    case 'cat:puzzle': return ['puzzle games online', 'puzzle games'];
    case 'cat:sports': return ['sports games online', 'sports games'];
    case 'cat:multiplayer': return ['multiplayer games online', 'multiplayer games'];
    case 'cat:adventure': return ['adventure games online', 'platform games online'];
    case 'cat:arcade': return ['arcade games online', 'classic arcade games'];
    default: return ['free online games'];
  }
}

function getHubKeywordHeading(hub, category) {
  switch (hub) {
    case 'car-parking': return { heading: 'More free car games online', kw: 'car games online' };
    case 'truck-driving': return { heading: 'More free truck driving games online', kw: 'truck driving games' };
    case 'stickman': return { heading: 'More free stickman games online', kw: 'stickman games online' };
    case 'bubble-shooter': return { heading: 'More free bubble shooter games online', kw: 'bubble shooter online' };
    case '2-player': return { heading: 'More free 2 player games online', kw: '2 player games online' };
    case 'obby': return { heading: 'More free obby games online', kw: 'obby games online' };
    case 'zombie': return { heading: 'More free zombie games online', kw: 'zombie games online' };
    case 'football-soccer': return { heading: 'More free soccer games online', kw: 'soccer games online' };
    case 'halloween': return { heading: 'More free halloween games online', kw: 'halloween games online' };
    case 'cat:action': return { heading: 'More free action games online', kw: 'action games online' };
    case 'cat:racing': return { heading: 'More free car games online', kw: 'car games online' };
    case 'cat:shooting': return { heading: 'More free shooting games online', kw: 'shooting games online' };
    case 'cat:puzzle': return { heading: 'More free puzzle games online', kw: 'puzzle games online' };
    case 'cat:sports': return { heading: 'More free sports games online', kw: 'sports games online' };
    case 'cat:multiplayer': return { heading: 'More free multiplayer games online', kw: 'multiplayer games online' };
    case 'cat:adventure': return { heading: 'More free adventure games online', kw: 'adventure games online' };
    case 'cat:arcade': return { heading: 'More free arcade games online', kw: 'arcade games online' };
    default: return { heading: `More ${category} games`, kw: `${category.toLowerCase()} games` };
  }
}

let topGamesJs = fs.readFileSync(path.join(ROOT, 'data/top-games-content.js'), 'utf8');
let gameMetaChangedCount = 0;
let gameMetaUnchangedCount = 0;

let keywordHeadingCount = 0;
let categoryFallbackCount = 0;

allGames.forEach((game) => {
  const origMeta = (topGamesContent[game.slug] && topGamesContent[game.slug].meta_description) || game.meta_description || '';
  const hub = getBestFitHub(game);
  const kws = getHubKeywords(hub);
  let nextMeta = null;

  // Rule 3: Restore brand ending "on BlockHub.games"
  // Only add keyword where it fits as a natural phrase
  // Pattern 1: 'Play free online (at|on) BlockHub.games.' -> 'Play free [kw] on BlockHub.games.'
  if (/Play free online (?:at|on) BlockHub\.games\.?/i.test(origMeta)) {
    for (const kw of kws) {
      const cand = origMeta.replace(/Play free online (?:at|on) BlockHub\.games\.?/i, 'Play free ' + kw + ' on BlockHub.games.');
      if (cand.length >= 120 && cand.length <= 160) {
        nextMeta = cand;
        break;
      }
    }
  }

  // Pattern 2: 'Play free in your browser on BlockHub.games.' -> 'Play free [kw] on BlockHub.games.'
  if (!nextMeta && /Play free in your browser on BlockHub\.games\.?/i.test(origMeta)) {
    for (const kw of kws) {
      const cand = origMeta.replace(/Play free in your browser on BlockHub\.games\.?/i, 'Play free ' + kw + ' on BlockHub.games.');
      if (cand.length >= 120 && cand.length <= 160) {
        nextMeta = cand;
        break;
      }
    }
  }

  // Pattern 3: 'Challenge friends free on BlockHub.games.' -> 'Challenge friends in [kw] on BlockHub.games.'
  if (!nextMeta && /Challenge friends free on BlockHub\.games\.?/i.test(origMeta)) {
    for (const kw of kws) {
      const cand = origMeta.replace(/Challenge friends free on BlockHub\.games\.?/i, 'Challenge friends in ' + kw + ' on BlockHub.games.');
      if (cand.length >= 120 && cand.length <= 160) {
        nextMeta = cand;
        break;
      }
    }
  }

  // Pattern 4: Truncated Play endings restored with brand ending 'on BlockHub.games.'
  if (!nextMeta && /Play(\s+directly(\s+in(\s+your)?)?)?\.?$/i.test(origMeta)) {
    let clean = origMeta.replace(/\s*Play(\s+directly(\s+in(\s+your)?)?)?\.?$/i, '').trim().replace(/[.,!]+$/, '');
    clean = clean.replace(/\s*and dynamic obstacle\.?$/i, '').trim().replace(/[.,!]+$/, '');
    for (const kw of kws) {
      const cand1 = clean + ' in ' + kw + ' on BlockHub.games.';
      if (cand1.length >= 120 && cand1.length <= 160) {
        nextMeta = cand1;
        break;
      }
      const cand2 = clean + ' with ' + kw + ' on BlockHub.games.';
      if (cand2.length >= 120 && cand2.length <= 160) {
        nextMeta = cand2;
        break;
      }
    }
  }

  // Pattern 5: 'free on BlockHub.games' at end of sentence
  if (!nextMeta && /free (?:on|at) BlockHub\.games\.?$/i.test(origMeta)) {
    const clean = origMeta.replace(/\s*free (?:on|at) BlockHub\.games\.?$/i, '').trim().replace(/[.,!]+$/, '');
    for (const kw of kws) {
      const cand = clean + ' in ' + kw + ' on BlockHub.games.';
      if (cand.length >= 120 && cand.length <= 160) {
        nextMeta = cand;
        break;
      }
    }
  }

  if (nextMeta && nextMeta !== origMeta) {
    gameMetaChangedCount++;
    const slugKey = `"${game.slug}": {`;
    const slugIdx = topGamesJs.indexOf(slugKey);
    if (slugIdx !== -1) {
      const closingKey = '\n  },';
      const endIdx = topGamesJs.indexOf(closingKey, slugIdx);
      const searchEnd = endIdx !== -1 ? endIdx + closingKey.length : slugIdx + 4000;
      const gameBlock = topGamesJs.slice(slugIdx, searchEnd);
      const metaMatch = gameBlock.match(/"meta_description":\s*"([^"]*)"/);
      if (metaMatch) {
        const oldEntry = metaMatch[0];
        const newEntry = `"meta_description": ${JSON.stringify(nextMeta)}`;
        const updatedBlock = gameBlock.replace(oldEntry, newEntry);
        topGamesJs = topGamesJs.slice(0, slugIdx) + updatedBlock + topGamesJs.slice(searchEnd);
      }
    }

    diffRows.push({
      page: `/game/${game.slug}`,
      element: 'meta_description',
      before: origMeta,
      after: nextMeta,
      keywords_added: kws[0]
    });
  } else {
    gameMetaUnchangedCount++;
  }

  // Rule 4: Related Games Heading with 60% threshold
  const candidateRelated = (game.related || []).map((s) => getGameBySlug(s)).filter(Boolean);
  const relatedGames = candidateRelated.length >= 8
    ? candidateRelated.slice(0, 8)
    : getRelatedGames(game.slug, game.category, 8);

  const total = relatedGames.length || 1;
  const matchCount = relatedGames.filter(r => getBestFitHub(r) === hub).length;
  const ratio = matchCount / total;

  let headingText = '';
  let headingKw = '';

  if (ratio >= 0.6) {
    const res = getHubKeywordHeading(hub, game.category);
    headingText = res.heading;
    headingKw = res.kw;
    keywordHeadingCount++;
  } else {
    headingText = `More ${game.category} games`;
    headingKw = `${game.category.toLowerCase()} games`;
    categoryFallbackCount++;
  }

  const oldHeading = `Related ${game.category} Games`;
  diffRows.push({
    page: `/game/${game.slug}`,
    element: 'related_games_heading',
    before: oldHeading,
    after: headingText,
    keywords_added: headingKw
  });
});

fs.writeFileSync(path.join(ROOT, 'data/top-games-content.js'), topGamesJs, 'utf8');
console.log(`Updated data/top-games-content.js: ${gameMetaChangedCount} changed, ${gameMetaUnchangedCount} left alone.`);

// Update app/game/[slug]/page.js with the exact 60% threshold function
let gamePageJs = fs.readFileSync(path.join(ROOT, 'app/game/[slug]/page.js'), 'utf8');

const helperCode = `function getBestFitHub(game) {
  if (!game) return "cat:action";
  const title = (game.title || "").toLowerCase();
  const subgenre = (game.subgenre || "").toLowerCase();
  const desc = (game.description || "").toLowerCase();

  if (/\\b(2\\s*player|2\\s*players|two\\s*player|two\\s*players|for\\s*2\\s*players|for\\s*two\\s*players|2-player)\\b/i.test(title)) return "2-player";
  if (/\\b(tanker|tankers|truck|trucks|hauler|haulers|semi|18\\s*wheeler)\\b/i.test(title)) return "truck-driving";
  if (/\\b(parking|park\\b)/i.test(title)) return "car-parking";
  if (/\\b(stickman|stickmen|stick\\s+)\\b/i.test(title)) return "stickman";
  if (/\\b(bubble|bubbles)\\b/i.test(title)) return "bubble-shooter";
  if (/\\b(obby|parkour)\\b/i.test(title)) return "obby";
  if (/\\b(zombie|zombies|undead)\\b/i.test(title)) return "zombie";
  if (/\\b(soccer|football|penalty|free\\s*kick)\\b/i.test(title)) return "football-soccer";
  if (/\\b(halloween|spooky|pumpkin|pumpkins)\\b/i.test(title)) return "halloween";

  if (["2-player", "truck-driving", "car-parking", "stickman", "bubble-shooter", "obby", "zombie", "football-soccer", "halloween"].includes(subgenre)) {
    return subgenre;
  }

  if (/\\b(2\\s*player|two\\s*player|shared\\s*keyboard)\\b/i.test(desc)) return "2-player";
  if (/\\b(tanker|truck|hauler|semi\\s*truck)\\b/i.test(desc)) return "truck-driving";
  if (/\\b(parking|park\\s+car)\\b/i.test(desc)) return "car-parking";
  if (/\\b(stickman|stickmen)\\b/i.test(desc)) return "stickman";
  if (/\\b(bubble\\s*shooter)\\b/i.test(desc)) return "bubble-shooter";
  if (/\\b(parkour|obstacle\\s*course|obby)\\b/i.test(desc)) return "obby";
  if (/\\b(zombie|undead)\\b/i.test(desc)) return "zombie";
  if (/\\b(soccer|football|penalty)\\b/i.test(desc)) return "football-soccer";
  if (/\\b(halloween|spooky)\\b/i.test(desc)) return "halloween";

  return "cat:" + (game.category || "").toLowerCase();
}

function getRelatedGamesHeading(game, relatedGames = []) {
  const hub = getBestFitHub(game);
  const total = relatedGames.length || 1;
  const matchCount = relatedGames.filter((r) => getBestFitHub(r) === hub).length;
  const ratio = matchCount / total;

  if (ratio >= 0.6) {
    switch (hub) {
      case "car-parking": return "More free car games online";
      case "truck-driving": return "More free truck driving games online";
      case "stickman": return "More free stickman games online";
      case "bubble-shooter": return "More free bubble shooter games online";
      case "2-player": return "More free 2 player games online";
      case "obby": return "More free obby games online";
      case "zombie": return "More free zombie games online";
      case "football-soccer": return "More free soccer games online";
      case "halloween": return "More free halloween games online";
      case "cat:action": return "More free action games online";
      case "cat:racing": return "More free car games online";
      case "cat:shooting": return "More free shooting games online";
      case "cat:puzzle": return "More free puzzle games online";
      case "cat:sports": return "More free sports games online";
      case "cat:multiplayer": return "More free multiplayer games online";
      case "cat:adventure": return "More free adventure games online";
      case "cat:arcade": return "More free arcade games online";
    }
  }

  return \`More \${game.category} games\`;
}
`;

// Replace previous helper or add new
if (gamePageJs.includes('function getBestFitHub')) {
  gamePageJs = gamePageJs.replace(/function getBestFitHub[\s\S]*?\n(?=export default)/m, helperCode);
} else if (gamePageJs.includes('function getRelatedGamesHeading')) {
  gamePageJs = gamePageJs.replace(/function getRelatedGamesHeading[\s\S]*?\n(?=export default)/m, helperCode);
} else {
  gamePageJs = gamePageJs.replace('export default async function GamePage', `${helperCode}\nexport default async function GamePage`);
}

// Pass relatedGames to getRelatedGamesHeading
gamePageJs = gamePageJs.replace(
  '{getRelatedGamesHeading(game)}',
  '{getRelatedGamesHeading(game, relatedGames)}'
);

fs.writeFileSync(path.join(ROOT, 'app/game/[slug]/page.js'), gamePageJs, 'utf8');
console.log('Updated app/game/[slug]/page.js with 60% threshold related heading logic');

console.log('=== Step 8: Write /reports/onpage-keywords-diff.csv ===');
const csvHeader = 'page,element,before,after,keywords added\n';
const csvContent = csvHeader + diffRows.map(r => 
  `${csvEscape(r.page)},${csvEscape(r.element)},${csvEscape(r.before)},${csvEscape(r.after)},${csvEscape(r.keywords_added)}`
).join('\n') + '\n';

const reportsDir = path.join(ROOT, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
fs.writeFileSync(path.join(reportsDir, 'onpage-keywords-diff.csv'), csvContent, 'utf8');
console.log(`Generated /reports/onpage-keywords-diff.csv with ${diffRows.length} diff entries.`);
console.log(`Related heading breakdown: ${keywordHeadingCount} keyword headings, ${categoryFallbackCount} category fallback headings.`);
