// scripts/test-validation.js
const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));
const { rawGames } = require('../data/games.js');
const rawMap = new Map(rawGames.map(g => [g.slug, g]));

const {
  hashSlug,
  cleanFeedText,
  detectTrueProfile,
  extractControls,
  sanitizeVocabulary
} = require('./lib/individual-engine.js');

const { genreBodies } = require('./lib/verified-catalog-builder.js');
const { validateQualityGates } = require('./lib/validator.js');

const P1_OPENERS = [
  (t, goal, set) => `Centered on ${goal}, ${t} immerses players in ${set} where strategic focus defines every move.`,
  (t, goal, set) => `Throughout ${t}, players take direct command to ${goal} across ${set} under demanding conditions.`,
  (t, goal, set) => `Designed around focused mechanics, ${t} challenges you to ${goal} within ${set} with high precision.`,
  (t, goal, set) => `Designed for energetic sessions, ${t} places you in ${set} with the explicit objective to ${goal}.`,
  (t, goal, set) => `Featuring responsive gameplay, ${t} invites players to navigate ${set} and successfully ${goal}.`,
  (t, goal, set) => `Taking place in ${set}, ${t} tasks players with the critical mission to ${goal}.`,
  (t, goal, set) => `At the heart of ${t} is the challenge to ${goal}, guiding the action through ${set}.`,
  (t, goal, set) => `Set within ${set}, ${t} focuses on tactical execution as you work steadily to ${goal}.`,
  (t, goal, set) => `Combining precision and foresight, ${t} delivers an engaging experience centered on the drive to ${goal}.`,
  (t, goal, set) => `From the opening moments of ${t}, your primary objective is to ${goal} throughout ${set}.`,
  (t, goal, set) => `Stepping into ${t}, players are thrust into ${set} where they must work diligently to ${goal}.`,
  (t, goal, set) => `Offering distinct gameplay, ${t} revolves around core mechanics and the ongoing challenge to ${goal}.`,
  (t, goal, set) => `Guiding your path through ${set}, ${t} demands steady attention and calm focus to ${goal}.`,
  (t, goal, set) => `Every attempt across ${t} tests your ability to ${goal} while adapting to ${set}.`,
  (t, goal, set) => `Developed with accessible depth, ${t} asks players to master fundamental timing in order to ${goal}.`,
  (t, goal, set) => `Entering the world of ${t}, you strive to ${goal} across varied encounters in ${set}.`,
  (t, goal, set) => `With its emphasis on situational awareness, ${t} puts your instincts to the test across ${set}.`,
  (t, goal, set) => `Exploring the environment of ${t}, players must overcome active hazards to successfully ${goal}.`,
  (t, goal, set) => `Crafted for engaging browser action, ${t} requires keen observation to ${goal} in ${set}.`,
  (t, goal, set) => `Across the demanding stages of ${t}, the central mission is to ${goal} within ${set}.`,
  (t, goal, set) => `Navigating through ${set} within ${t}, players prioritize sound decision-making to ${goal}.`,
  (t, goal, set) => `Anchored by intuitive mechanics, ${t} empowers you to ${goal} throughout ${set}.`,
  (t, goal, set) => `Balancing patience with decisive action, ${t} tasks you with navigating ${set} to ${goal}.`,
  (t, goal, set) => `Challenging players to ${goal}, ${t} provides an active and demanding setting across ${set}.`
];

const P2_OPENERS = [
  (t, ctrl, act, haz) => `Mastering controls throughout ${t} is essential, utilizing ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Throughout ${t}, tactical execution relies on responsive inputs, allowing you to use ${ctrl} for ${act}.`,
  (t, ctrl, act, haz) => `Inside ${t}, responsive handling plays a crucial role, with ${ctrl} governing every attempt to ${act}.`,
  (t, ctrl, act, haz) => `Success across ${t} requires disciplined timing when using ${ctrl} to execute ${act}.`,
  (t, ctrl, act, haz) => `When playing ${t}, navigating upcoming hazards demands quick adjustments, managed seamlessly via ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Across ${t}, careful coordination of inputs allows players to effectively use ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Within ${t}, momentum and positioning depend on intuitive inputs, where ${ctrl} dictates your ability to ${act}.`,
  (t, ctrl, act, haz) => `Overcoming difficult obstacles across ${t} hinges on precise inputs, using ${ctrl} to manage ${haz}.`,
  (t, ctrl, act, haz) => `Progressing through ${t} introduces escalating difficulty, requiring steady command of ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Clear visual cues across ${t} signal upcoming obstacles, giving you time to respond with ${ctrl} as you ${act}.`,
  (t, ctrl, act, haz) => `Maintaining consistency throughout ${t} depends on mastering ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Sharpening your input execution across ${t} via ${ctrl} makes the difference when confronting ${haz}.`,
  (t, ctrl, act, haz) => `Adaptive reflexes across ${t} are vital as new challenges emerge, guided directly by ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Fine-tuning your movement and timing across ${t} through ${ctrl} prevents costly errors against ${haz}.`,
  (t, ctrl, act, haz) => `Patience and calculated moves across ${t} prove decisive, especially when operating ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Smooth execution across ${t} ensures steady control as ${haz} tests your precision.`,
  (t, ctrl, act, haz) => `Reading the environment ahead across ${t} allows you to deploy ${ctrl} with greater efficiency to ${act}.`,
  (t, ctrl, act, haz) => `Handling each section of ${t} requires focused awareness, utilizing ${ctrl} to overcome ${haz}.`,
  (t, ctrl, act, haz) => `Rhythmic input delivery across ${t} helps preserve positioning when navigating ${haz}.`,
  (t, ctrl, act, haz) => `Learning the distinct physics across ${t} enables smoother manipulation of ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Split-second decisions across ${t} rely on familiarizing yourself with ${ctrl} to handle ${haz}.`,
  (t, ctrl, act, haz) => `Steering clear of dangerous mistakes across ${t} demands disciplined use of ${ctrl} as you ${act}.`,
  (t, ctrl, act, haz) => `Consistent performance across ${t} rewards players who methodically practice using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Balancing speed and caution across ${t} through ${ctrl} creates the safest path as you ${act} against ${haz}.`
];

function sanitizeClaims(text, feedText = '', category = '') {
  let res = text;
  const feedLower = (feedText || '').toLowerCase();
  const catLower = (category || '').toLowerCase();

  if (!/\bunlock(?:able|ing|ed|s)?\b/i.test(feedLower)) {
    res = res.replace(/\bunlocks\b/gi, 'reveals')
             .replace(/\bunlocking\b/gi, 'revealing')
             .replace(/\bunlocked\b/gi, 'revealed')
             .replace(/\bunlock\b/gi, 'reveal');
  }
  if (!/\bleaderboards?\b/i.test(feedLower)) {
    res = res.replace(/\bleaderboards?\b/gi, 'rankings');
  }
  if (!/\bupgrades?\b/i.test(feedLower)) {
    res = res.replace(/\bupgrades?\b/gi, 'skills');
  }
  if (!/\blevels?\b/i.test(feedLower)) {
    res = res.replace(/\blevels?\b/gi, 'stages');
  }
  if (!/\bachievements?\b/i.test(feedLower)) {
    res = res.replace(/\bachievements?\b/gi, 'victories');
  }
  if (!/\bsave(?:d)?\s+progress\b/i.test(feedLower)) {
    res = res.replace(/\bsave(?:d)?\s+progress\b/gi, 'preserve progress');
  }
  if (catLower !== 'multiplayer' && !/\bmultiplayer\b/i.test(feedLower)) {
    res = res.replace(/\bmultiplayer\b/gi, 'competitive');
  }
  return res;
}

function sanitizeRacingTerms(text, category = '', subgenre = '') {
  const catLower = (category || '').toLowerCase();
  const subLower = (subgenre || '').toLowerCase();
  if (catLower !== 'racing' || subLower === 'parking') {
    return text
      .replace(/\bracing lines?\b/gi, 'driving path')
      .replace(/\blap times?\b/gi, 'course times')
      .replace(/\bundersteer\b/gi, 'turning scrub')
      .replace(/\boversteer\b/gi, 'rear slide')
      .replace(/\bapex of the curve\b/gi, 'curve crest')
      .replace(/\bdrifting around corners\b/gi, 'gliding around corners')
      .replace(/\bbraking into tight corners\b/gi, 'decelerating into tight corners')
      .replace(/\bhandbrake drifting\b/gi, 'handbrake turning')
      .replace(/\bhigh-velocity speed\b/gi, 'high velocity')
      .replace(/\btop speed records\b/gi, 'top velocity marks')
      .replace(/\bdrag coefficient\b/gi, 'air resistance')
      .replace(/\btire grip compounds\b/gi, 'tire grip')
      .replace(/\baerodynamic downforce\b/gi, 'aerodynamic balance');
  }
  return text;
}

const STARTER_ALTERNATIVES = {
  anticipating: ['Keenly anticipating', 'Early anticipation of', 'Observantly anticipating'],
  coordinating: ['Carefully coordinating', 'Synchronizing', 'Smoothly coordinating'],
  executing: ['Methodically executing', 'Deliberately executing', 'Skillfully executing'],
  maintaining: ['Steadily maintaining', 'Consistently maintaining', 'Active maintenance of'],
  developing: ['Patiently developing', 'Gradually developing', 'Cultivating'],
  balancing: ['Harmonizing', 'Mindfully balancing', 'Carefully balancing'],
  holding: ['Firmly holding', 'Steadily holding', 'Consistently holding'],
  timing: ['Precisely timing', 'Accurately timing', 'Patient timing of'],
  refining: ['Continually refining', 'Sharpening', 'Progressively refining'],
  navigating: ['Skillfully navigating', 'Expertly navigating', 'Adept traversal through'],
  smooth: ['Fluid', 'Seamless', 'Unbroken'],
  disciplined: ['Rigorous', 'Systematic', 'Measured'],
  deliberate: ['Purposeful', 'Intentional', 'Calculated'],
  patience: ['Steadfast patience', 'Calm patience', 'Disciplined patience'],
  consistent: ['Steady', 'Unwavering', 'Regular'],
  careful: ['Attentive', 'Prudent', 'Mindful'],
  mastering: ['Perfecting', 'Achieving mastery over', 'Fully commanding'],
  prioritizing: ['Emphasizing', 'Actively prioritizing', 'Focusing on'],
  scanning: ['Alertly scanning', 'Continuously surveying', 'Vigilantly scanning'],
  surveying: ['Observantly surveying', 'Broadly scanning', 'Carefully examining'],
  tracking: ['Attentively tracking', 'Closely following', 'Keenly monitoring'],
  evaluating: ['Thoughtfully evaluating', 'Critical assessment of', 'Carefully gauging'],
  identifying: ['Quickly pinpointing', 'Accurately spotting', 'Rapidly recognizing'],
  securing: ['Safely securing', 'Firmly locking down', 'Reliably holding'],
  protecting: ['Safeguarding', 'Defending', 'Vigilantly protecting'],
  reading: ['Perceptively reading', 'Astutely interpreting', 'Observantly reading'],
  controlling: ['Commanding', 'Masterfully controlling', 'Firmly directing'],
  handling: ['Managing', 'Expertly handling', 'Skillfully conducting'],
  observing: ['Noticing', 'Carefully watching', 'Attentively noting'],
  watching: ['Alertly observing', 'Keeping watch on', 'Carefully tracking'],
  listening: ['Heeding', 'Attentively noting', 'Tuning into'],
  practicing: ['Regularly practicing', 'Diligently rehearsing', 'Methodical practice of'],
  focusing: ['Directing attention toward', 'Zeroing in on', 'Concentrating on'],
  tapping: ['Quickly tapping', 'Light taps on', 'Gently pressing'],
  clicking: ['Snappy clicking on', 'Deliberate clicks on', 'Direct selection via'],
  dragging: ['Smoothly dragging', 'Fluidly shifting', 'Carefully sliding'],
  calm: ['Serene', 'Composed', 'Tranquil'],
  feathering: ['Gently feathering', 'Delicate feathering of', 'Soft touch on'],
  applying: ['Steadily applying', 'Carefully applying', 'Judiciously applying'],
  adjusting: ['Smoothly adjusting', 'Continually adjusting', 'Careful adjustments to'],
  approaching: ['Cautiously approaching', 'Steadily approaching', 'Methodical approach to'],
  engaging: ['Actively engaging', 'Directly engaging', 'Carefully engaging'],
  neutralizing: ['Eliminating', 'Systematically neutralizing', 'Safely neutralizing'],
  snapping: ['Crisply snapping', 'Rapidly snapping', 'Quickly snapping']
};

function harmonizeStarters(p1, p2) {
  const p1Sents = p1.split(/(?<=[.!?])\s+/).filter(Boolean);
  const p2Sents = p2.split(/(?<=[.!?])\s+/).filter(Boolean);
  const allSents = [...p1Sents, ...p2Sents];

  const usedStarters = {};
  let prevStarter = '';

  for (let i = 0; i < allSents.length; i++) {
    let s = allSents[i].trim();
    let words = s.split(/\s+/);
    let firstWord = words[0].replace(/^[^a-zA-Z0-9]+/, '').toLowerCase();

    if (firstWord === prevStarter || (usedStarters[firstWord] || 0) >= 2) {
      const alts = STARTER_ALTERNATIVES[firstWord];
      if (alts) {
        for (const alt of alts) {
          const altFirst = alt.split(/\s+/)[0].toLowerCase();
          if (altFirst !== prevStarter && (usedStarters[altFirst] || 0) < 2) {
            words.shift();
            s = `${alt} ${words.join(' ')}`;
            firstWord = altFirst;
            allSents[i] = s;
            break;
          }
        }
      }
    }

    usedStarters[firstWord] = (usedStarters[firstWord] || 0) + 1;
    prevStarter = firstWord;
  }

  return {
    p1: allSents.slice(0, p1Sents.length).join(' '),
    p2: allSents.slice(p1Sents.length).join(' ')
  };
}

function composeMetaTitle(rawTitle) {
  const brand = ' | BlockHub.games';
  const maxLen = 60;
  const maxBase = maxLen - brand.length;
  let title = rawTitle.replace(/\s*\|\s*BlockHub.*$/i, '').trim();

  const c1 = `${title} - Play Free Online`;
  if (c1.length <= maxBase) return `${c1}${brand}`;

  const c2 = `${title} - Play Online`;
  if (c2.length <= maxBase) return `${c2}${brand}`;

  const c3 = `${title} Online`;
  if (c3.length <= maxBase) return `${c3}${brand}`;

  if (title.length <= maxBase) return `${title}${brand}`;

  const words = title.split(/\s+/);
  let shortened = '';
  for (const w of words) {
    const next = shortened ? `${shortened} ${w}` : w;
    if (next.length <= maxBase) shortened = next;
    else break;
  }
  if (!shortened) shortened = title.slice(0, maxBase);
  return `${shortened}${brand}`;
}

function composeMetaDescription(title, coreGoal) {
  const tpls = [
    t => `Play ${t} free online on BlockHub.games! Challenge your skills, ${coreGoal}, and enjoy seamless, instant browser gameplay with zero downloads required today.`,
    t => `Play ${t} online for free on BlockHub.games! Test your reflexes, ${coreGoal}, and experience instant browser action with zero downloads today.`,
    t => `Play ${t} free on BlockHub.games! Challenge your skills, ${coreGoal}, and enjoy smooth browser gameplay with zero downloads required.`,
    t => `Play ${t} free on BlockHub.games! Take on fun challenges, ${coreGoal}, and master each stage directly in your browser.`,
    t => `Play ${t} free on BlockHub.games! Master fun gameplay, ${coreGoal}, and beat every stage in your browser right now.`,
    t => `Play ${t} free on BlockHub.games! Master fun mechanics, ${coreGoal}, and beat every stage directly in your web browser.`,
    t => `Play ${t} online on BlockHub.games! ${coreGoal} and enjoy instant browser fun today.`
  ];

  for (const fn of tpls) {
    const s = fn(title);
    if (s.length >= 140 && s.length <= 160) return s;
  }

  let base = `Play ${title} free on BlockHub.games! Test your reflexes, ${coreGoal}, and experience instant browser action.`;
  if (base.length > 160) {
    base = `Play ${title} on BlockHub.games! ${coreGoal} with instant browser action.`;
  }
  if (base.length > 160) {
    base = base.slice(0, 157).trim();
    if (base.includes(' ')) base = base.slice(0, base.lastIndexOf(' '));
    return base + '...';
  }

  const additions = [
    ' Enjoy zero downloads required.',
    ' Play instantly in any web browser.',
    ' Compatible with desktop and mobile devices.',
    ' Dive in and play free right now!',
    ' Zero downloads needed.'
  ];

  for (const add of additions) {
    const candidate = base + add;
    if (candidate.length >= 140 && candidate.length <= 160) return candidate;
  }

  while (base.length < 140) {
    base = base.replace('action.', 'action today.');
    if (base.length >= 140 && base.length <= 160) return base;
    base = base.replace('BlockHub.games!', 'BlockHub.games directly in your browser!');
  }
  if (base.length > 160) {
    base = base.slice(0, 157).trim();
    if (base.includes(' ')) base = base.slice(0, base.lastIndexOf(' '));
    base += '...';
  }
  return base;
}

const scheduledSlugs = Object.keys(topContent).filter(s => topContent[s].status === 'PASS_SCHEDULED');
console.log('Testing quality gates across', scheduledSlugs.length, 'games...');

const genreCounters = { driving: 0, shooting: 0, puzzle: 0, sports: 0, general: 0 };
let passCount = 0;
let failCount = 0;
const errorMap = {};

for (const slug of scheduledSlugs) {
  const item = topContent[slug];
  const raw = rawMap.get(slug) || {};
  const title = (item.title || raw.title || slug).trim();
  const category = (item.category || raw.category || 'Arcade').trim();
  const subgenre = (item.subgenre || '').trim();
  const rawDesc = cleanFeedText(item.raw_description || raw.description || '');
  const rawHowTo = cleanFeedText(item.raw_how_to || raw.howToPlay || '');

  const catLower = category.toLowerCase();
  const subLower = subgenre.toLowerCase();
  const titleLowerWord = title.toLowerCase();

  // ALIGN EXACTLY WITH VALIDATOR CLASSIFICATION
  const isDriving = catLower === "racing" || ["parking", "truck", "drift", "moto", "racing", "driving", "car", "taxi"].some(k => subLower.includes(k) || titleLowerWord.includes(k));
  const isShooter = catLower === "shooting" || ["fps", "sniper", "shooter", "zombie"].some(k => subLower.includes(k) || titleLowerWord.includes(k));
  const isPuzzle = catLower === "puzzle" || ["puzzle", "sort", "match", "trivia", "merge", "brain", "board"].some(k => subLower.includes(k) || titleLowerWord.includes(k));
  const isSports = catLower === "sports" || ["sports", "soccer", "football", "basketball", "tennis", "golf", "billiards"].some(k => subLower.includes(k) || titleLowerWord.includes(k));

  let genreKey = 'general';
  if (isDriving) genreKey = 'driving';
  else if (isShooter) genreKey = 'shooting';
  else if (isPuzzle) genreKey = 'puzzle';
  else if (isSports) genreKey = 'sports';

  const varIdx = genreCounters[genreKey]++ % 50;

  const hash = hashSlug(slug);
  const p1Idx = hash % P1_OPENERS.length;
  const p2Idx = (Math.floor(hash / P1_OPENERS.length) ^ (hash % 17)) % P2_OPENERS.length;

  let setting = 'distinct stage layouts';
  if (isDriving) setting = subLower.includes('parking') ? 'compact parking structures' : 'demanding roadway courses';
  else if (isShooter) setting = 'hostile combat zones';
  else if (isPuzzle) setting = 'dynamic puzzle grids';
  else if (isSports) setting = 'competitive athletic arenas';

  let coreGoal = 'complete each challenge with high precision';
  if (isDriving) coreGoal = subLower.includes('parking') ? 'park vehicles cleanly within designated bays' : 'reach the finish line without losing control';
  else if (isShooter) coreGoal = 'neutralize incoming hostile threats';
  else if (isPuzzle) coreGoal = 'solve complex logical arrangements';
  else if (isSports) coreGoal = 'outscore opponents and defend your territory';

  let primaryAction = 'navigate through active sections';
  if (isDriving) primaryAction = 'steer through sharp turns and adjust velocity';
  else if (isShooter) primaryAction = 'acquire targets and fire accurately';
  else if (isPuzzle) primaryAction = 'shift and arrange items into correct sequences';
  else if (isSports) primaryAction = 'time kicks, passes, and defensive maneuvers';

  let hazardDesc = 'tight clearance and timed constraints';
  if (isDriving) hazardDesc = subLower.includes('parking') ? 'concrete barriers and tight stalls' : 'sharp road curves and sudden obstacles';
  else if (isShooter) hazardDesc = 'advancing enemies and incoming attacks';
  else if (isPuzzle) hazardDesc = 'crowded grid spaces and limited move counts';
  else if (isSports) hazardDesc = 'aggressive opposing defenders and tight angles';

  const trueProfile = { isDriving, isShooter, isPuzzle, isSports, isMemory: false, isPlatformer: !isDriving && !isShooter && !isPuzzle && !isSports };
  const controls = extractControls(rawHowTo, item.howToPlay, trueProfile);
  const ctrlKeys = controls.map(c => c.key).join(' and ');

  const p1Opener = P1_OPENERS[p1Idx](title, coreGoal, setting);
  const p2Opener = P2_OPENERS[p2Idx](title, ctrlKeys, primaryAction, hazardDesc);

  let p1 = `${p1Opener} ${genreBodies[genreKey].p1[varIdx]}`;
  let p2 = `${p2Opener} ${genreBodies[genreKey].p2[varIdx]}`;

  // Sanitize
  p1 = sanitizeVocabulary(p1, category, subgenre, title);
  p2 = sanitizeVocabulary(p2, category, subgenre, title);
  p1 = sanitizeRacingTerms(p1, category, subgenre);
  p2 = sanitizeRacingTerms(p2, category, subgenre);
  p1 = sanitizeClaims(p1, rawDesc + ' ' + rawHowTo, category);
  p2 = sanitizeClaims(p2, rawDesc + ' ' + rawHowTo, category);

  // Remove adjacent duplicate words unless in title
  const cleanAdjacent = (txt) => txt.replace(/\b([a-zA-Z]{2,})\s+\1\b/gi, (match, word) => {
    if (title && new RegExp(`\\b${word}\\s+${word}\\b`, 'i').test(title)) return match;
    return word;
  });
  p1 = cleanAdjacent(p1);
  p2 = cleanAdjacent(p2);

  // Harmonize starters
  const harmonized = harmonizeStarters(p1, p2);
  p1 = harmonized.p1;
  p2 = harmonized.p2;

  let fullDesc = `${p1}\n\n${p2}`;
  let wordCount = fullDesc.split(/\s+/).filter(Boolean).length;

  const testGame = {
    ...item,
    title,
    category,
    subgenre,
    description: fullDesc,
    word_count: wordCount,
    controls,
    meta_title: composeMetaTitle(title),
    meta_description: composeMetaDescription(title, coreGoal)
  };

  const res = validateQualityGates(testGame);
  if (res.passed) {
    passCount++;
  } else {
    failCount++;
    console.log(`FAIL [${slug}] (${category}/${subgenre}):`, res.errors.join(' | '));
    res.errors.forEach(e => {
      const k = e.split(':')[0];
      errorMap[k] = (errorMap[k] || 0) + 1;
    });
  }
}

console.log('Passed:', passCount, 'Failed:', failCount);
console.log('Error Breakdown:', errorMap);
