/**
 * BLOCKHUB.GAMES - V2 NATURAL PROSE GENERATOR
 * Generates custom, factual, 2-paragraph editorial content for catalog games.
 * Adheres strictly to all 20 Quality Gates and catalog pattern distribution rules.
 */

const { normalizeTitle } = require('../normalize-all-titles.js');
const { decodeHtmlEntities, cleanText, detectSubgenre, parseControlsFromHowTo } = require('./facts.js');
const {
  validateQualityGates,
  get5WordShingles,
  computeJaccardSimilarity,
  UNVERIFIABLE_CHECKS,
  DRIVING_TERMS,
  SHOOTING_TERMS
} = require('./validator.js');
const { checkTrademark } = require('./trademark.js');
const { isNearDuplicate } = require('./near-duplicates.js');
const { getHubsForGame } = require('../../data/hubs.js');

// 9 Recognized P1 Opener Templates
const P1_OPENER_TEMPLATES = [
  // 0: Drops into premise
  (t, premise) => `${t} drops players directly into ${premise}.`,
  // 1: Step into the arena
  (t, premise) => `Step into the arena of ${t}, where ${premise}.`,
  // 2: In [Title], you explore/command
  (t, premise, verb = 'command') => `In ${t}, players ${verb} ${premise}.`,
  // 3: Tests your reflexes
  (t, premise) => `${t} tests your reflexes across ${premise}.`,
  // 4: Delivers fast-paced
  (t, premise, adj = 'fast-paced') => `${t} delivers ${adj} action centered on ${premise}.`,
  // 5: Built around challenges
  (t, premise, mechanic = 'responsive mechanics') => `Built around ${mechanic}, ${t} challenges you to ${premise}.`,
  // 6: Set across environments
  (t, premise, setting = 'dynamic environments') => `Set across ${setting}, ${t} places players in charge of ${premise}.`,
  // 7: Is a dynamic title
  (t, premise, noun = 'game') => `${t} is an engaging ${noun} where ${premise}.`,
  // 8: Commanding the action
  (t, premise, verb = 'Guiding the action') => `${verb} in ${t} requires ${premise}.`,
];

// 9 Recognized P2 Opener Templates
const P2_OPENER_TEMPLATES = [
  // 0: Precision timing
  (action) => `Precision timing and disciplined execution keep you ahead when ${action}.`,
  // 1: Disciplined balance
  (aspectA, aspectB) => `Success demands a disciplined balance between ${aspectA} and ${aspectB}.`,
  // 2: Hazards throughout
  (hazard) => `Hazards throughout each stage test your composure as ${hazard}.`,
  // 3: Studying obstacle layouts
  (focus) => `Studying obstacle layouts and reading cues allows players to ${focus}.`,
  // 4: Maintaining forward momentum
  (pitfall) => `Maintaining steady forward momentum prevents ${pitfall}.`,
  // 5: Smooth keyboard controls
  (controlAction) => `Smooth keyboard controls and responsive touch inputs allow players to ${controlAction}.`,
  // 6: Keep a sharp eye
  (cue, outcome) => `Keep a sharp eye on ${cue} to ${outcome}.`,
  // 7: Later challenges introduce
  (escalation) => `Later challenges introduce tighter margins and ${escalation}.`,
  // 8: [Gerund phrase] requires
  (gerund, demand) => `${gerund} requires careful observation and ${demand}.`,
];

// Ensure valid meta title (<= 60 chars)
function formatMetaTitle(title) {
  const clean = decodeHtmlEntities(title || '').trim();
  const candidates = [
    `${clean} - Play Free Online | BlockHub.games`,
    `${clean} - Play Free | BlockHub.games`,
    `${clean} - Free Online | BlockHub.games`,
    `${clean} - Play Free Online`,
    `${clean} Online | BlockHub.games`,
  ];
  for (const c of candidates) {
    if (c.length <= 60) return c;
  }
  const suffix = ' - Play Free Online';
  return clean.slice(0, 60 - suffix.length) + suffix;
}

// Ensure valid meta description (140 - 160 chars)
function formatMetaDescription(title, category, subgenre, seed = 0) {
  const cTitle = decodeHtmlEntities(title || '').trim();
  const cat = (category || 'Arcade').toLowerCase();

  const intents = [
    `Play ${cTitle} free online at BlockHub.games! Experience exciting ${cat} challenges, responsive controls, and unblocked browser gameplay today.`,
    `Jump into ${cTitle} online at BlockHub.games! Enjoy thrilling ${cat} action, master tricky levels, and play free in your browser with zero downloads.`,
    `Master ${cTitle} online for free on BlockHub.games. Test your skills across dynamic ${cat} stages with smooth HTML5 controls on desktop and mobile.`,
    `Play the full version of ${cTitle} free at BlockHub.games. Tackle challenging ${cat} obstacles, set high scores, and enjoy instant browser fun today.`,
  ];

  let desc = intents[Math.abs(seed) % intents.length];
  if (desc.length < 140) {
    desc += ' Play now!';
  }
  if (desc.length > 160) {
    desc = desc.slice(0, 156) + '...';
  }
  return desc;
}

// Generate strategic tips
function generateTips(title, category, subgenre, feedText = '') {
  const cat = (category || 'Arcade').toLowerCase();
  const sub = (subgenre || '').toLowerCase();
  const tips = [];

  if (['racing', 'truck', 'drift', 'parking', 'moto'].includes(sub) || cat === 'racing') {
    tips.push('Ease off the accelerator before sharp bends to maintain complete steering control.');
    tips.push('Anticipate braking zones early when approaching narrow chokepoints and obstacles.');
    tips.push('Straighten your wheels completely before applying full throttle out of turns.');
  } else if (['fps', 'sniper', 'shooter', 'zombie'].includes(sub) || cat === 'shooting') {
    tips.push('Reload your primary weapon during quiet moments between enemy engagements.');
    tips.push('Keep moving continuously to prevent advancing hostiles from flanking your position.');
    tips.push('Aim for high-impact zones to neutralize aggressive targets with minimal ammunition.');
  } else if (['puzzle', 'match3', 'sort', 'mahjong'].includes(sub) || cat === 'puzzle') {
    tips.push('Scan the entire board before making your first move to uncover multi-tier chain opportunities.');
    tips.push('Prioritize clearing bottleneck slots early to maximize available working space.');
    tips.push('Plan several steps in advance rather than reacting impulsively to immediate tile options.');
  } else if (['soccer', 'basketball', 'sports'].includes(sub) || cat === 'sports') {
    tips.push('Time your shot releases cleanly at the peak of your athlete movement arc.');
    tips.push('Watch opponent defensive spacing to identify open passing lanes and scoring angles.');
    tips.push('Balance aggressive offensive drives with disciplined positioning along defensive lines.');
  } else if (['runner', 'platformer'].includes(sub)) {
    tips.push('Focus your gaze several steps ahead of your character to spot incoming hazards early.');
    tips.push('Reserve high leaps for wide chasms while relying on short hops over low ground hurdles.');
    tips.push('Maintain steady rhythm and avoid sudden hesitation when traversing crumbling platforms.');
  } else if (['fighter', 'stickman'].includes(sub)) {
    tips.push('Observe opponent wind-up animations to time your defensive blocks and evasive retreats.');
    tips.push('Counter immediately after an opponent misses a heavy strike to capitalize on vulnerability.');
    tips.push('Manage combat spacing to keep aggressive adversaries at the outer edge of your strike range.');
  } else if (sub === 'clicker') {
    tips.push('Reinvest initial earnings promptly into automated generators to scale passive resource gain.');
    tips.push('Target production multiplier upgrades before buying lower-tier raw output boosts.');
    tips.push('Balance manual click bonuses with long-term compounding efficiency milestones.');
  } else {
    tips.push('Learn stage layout patterns during initial runs to navigate tricky hazard corridors with ease.');
    tips.push('Avoid rushing through congested sectors; patient timing consistently produces higher scores.');
    tips.push('Utilize available power-ups strategically to clear difficult obstacles and extend your session.');
  }

  return tips;
}

// Generate FAQ
function generateFaq(title, category, subgenre, controls) {
  const cTitle = decodeHtmlEntities(title || '').trim();
  const cat = (category || 'Arcade').toLowerCase();

  return [
    {
      q: `What is the main objective in ${cTitle}?`,
      a: `In ${cTitle}, players navigate challenging ${cat} stages, overcome environmental obstacles, and achieve target goals across progressive levels.`
    },
    {
      q: `How do you control and play ${cTitle}?`,
      a: `You can play ${cTitle} using keyboard controls, mouse clicks, or responsive touch screen gestures on mobile devices.`
    },
    {
      q: `Is ${cTitle} free to play online?`,
      a: `Yes, ${cTitle} is completely free to play directly in modern web browsers on BlockHub.games with zero downloads or installation required.`
    }
  ];
}

// Generate 8 related games
function generateRelatedGames(slug, category, subgenre, allGames) {
  const currentSlug = (slug || '').toLowerCase();
  const currentTitle = (slug || '').replace(/[-_]+/g, ' ');
  const catLower = (category || '').toLowerCase();
  const subLower = (subgenre || '').toLowerCase();

  const candidates = allGames.filter(g => {
    if (!g || !g.slug) return false;
    const otherSlug = g.slug.toLowerCase();
    if (otherSlug === currentSlug) return false;
    // Exclude near duplicates
    if (isNearDuplicate({ slug: currentSlug, title: currentTitle }, { slug: otherSlug, title: g.title || otherSlug })) {
      return false;
    }
    return true;
  });

  // Score candidates: same subgenre (+3), same category (+2)
  const scored = candidates.map(g => {
    let score = 0;
    const gCat = (g.category || '').toLowerCase();
    const gSub = (g.subgenre || '').toLowerCase();
    if (subLower && gSub === subLower) score += 3;
    if (catLower && gCat === catLower) score += 2;
    return { slug: g.slug, score };
  });

  scored.sort((a, b) => b.score - a.score || a.slug.localeCompare(b.slug));

  const picked = [];
  const pickedSet = new Set();
  for (const c of scored) {
    if (picked.length >= 8) break;
    // Ensure candidate is not a near duplicate of any already picked game
    const candidateTitle = c.slug.replace(/[-_]+/g, ' ');
    const isDupeOfPicked = picked.some(p => isNearDuplicate({ slug: p, title: p.replace(/[-_]+/g, ' ') }, { slug: c.slug, title: candidateTitle }));
    if (!isDupeOfPicked && !pickedSet.has(c.slug)) {
      picked.push(c.slug);
      pickedSet.add(c.slug);
    }
  }

  // If still under 8, fill with safe fallbacks
  if (picked.length < 8) {
    for (const g of allGames) {
      if (picked.length >= 8) break;
      const s = g.slug;
      if (s !== currentSlug && !pickedSet.has(s)) {
        picked.push(s);
        pickedSet.add(s);
      }
    }
  }

  return picked.slice(0, 8);
}

module.exports = {
  P1_OPENER_TEMPLATES,
  P2_OPENER_TEMPLATES,
  formatMetaTitle,
  formatMetaDescription,
  generateTips,
  generateFaq,
  generateRelatedGames,
};
