const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const {
  hashSlug,
  cleanFeedText,
  extractControls,
  sanitizeVocabulary
} = require('./lib/individual-engine.js');

const {
  get6WordRuns,
  validateQualityGates
} = require('./lib/validator.js');

// 24 Distinct P1 Openers
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
  (t, goal, set) => `Every attempt in ${t} tests your ability to ${goal} while adapting to ${set}.`,
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

// 24 Distinct P2 Openers
const P2_OPENERS = [
  (ctrl, act, haz) => `Mastering the controls is essential, as players utilize ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Tactical execution relies on responsive inputs, allowing you to use ${ctrl} for ${act}.`,
  (ctrl, act, haz) => `Responsive handling plays a crucial role, with ${ctrl} governing every attempt to ${act}.`,
  (ctrl, act, haz) => `Success requires disciplined timing when using ${ctrl} to execute ${act}.`,
  (ctrl, act, haz) => `Navigating upcoming hazards demands quick adjustments, managed seamlessly via ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Careful coordination of inputs allows players to effectively use ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Momentum and positioning depend on intuitive inputs, where ${ctrl} dictates your ability to ${act}.`,
  (ctrl, act, haz) => `Overcoming difficult obstacles hinges on precise inputs, using ${ctrl} to manage ${haz}.`,
  (ctrl, act, haz) => `Stage progression introduces escalating difficulty, requiring steady command of ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Clear visual cues signal upcoming obstacles, giving you time to respond with ${ctrl} as you ${act}.`,
  (ctrl, act, haz) => `Maintaining consistency throughout each attempt depends on mastering ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Sharpening your input execution via ${ctrl} makes the difference when confronting ${haz}.`,
  (ctrl, act, haz) => `Adaptive reflexes are vital as new challenges emerge, guided directly by ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Fine-tuning your movement and timing through ${ctrl} prevents costly errors against ${haz}.`,
  (ctrl, act, haz) => `Patience and calculated moves prove decisive, especially when operating ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Smooth execution of ${ctrl} ensures steady control as ${haz} tests your precision.`,
  (ctrl, act, haz) => `Reading the environment ahead allows you to deploy ${ctrl} with greater efficiency to ${act}.`,
  (ctrl, act, haz) => `Handling each section requires focused awareness, utilizing ${ctrl} to overcome ${haz}.`,
  (ctrl, act, haz) => `Rhythmic input delivery via ${ctrl} helps preserve positioning when navigating ${haz}.`,
  (ctrl, act, haz) => `Learning the distinct physics and timing cues enables smoother manipulation of ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Split-second decisions rely on familiarizing yourself with ${ctrl} to handle ${haz}.`,
  (ctrl, act, haz) => `Steering clear of dangerous mistakes demands disciplined use of ${ctrl} as you ${act}.`,
  (ctrl, act, haz) => `Consistent performance rewards players who methodically practice using ${ctrl} to ${act}.`,
  (ctrl, act, haz) => `Balancing speed and caution through ${ctrl} creates the safest path as you ${act} against ${haz}.`
];

// Helper to paraphrase feed sentence and prevent 6-word matches
function paraphraseFeedSentence(rawSentence, category, subgenre, title) {
  let s = cleanFeedText(rawSentence);
  // Remove promotional fluff
  s = s.replace(/^[A-Za-z0-9\s:–-]+ is an? /i, '')
       .replace(/\b(play free|online game|download now|click to play)\b/gi, '')
       .replace(/\b(202[0-9]|2030)\b/g, '')
       .trim();
  
  if (s.length < 10) return '';

  // Vocabulary sanitization
  s = sanitizeVocabulary(s, category, subgenre, title);

  // Reword common patterns to avoid 6-word feed matches
  s = s.replace(/\bwhere every move matters\b/gi, 'demanding deliberate consideration for each decision')
       .replace(/\byou have to perform\b/gi, 'participants are tasked with executing')
       .replace(/\bthe game features\b/gi, 'the experience provides')
       .replace(/\bfind the matching pairs of\b/gi, 'uncover and pair corresponding')
       .replace(/\btest your reflexes\b/gi, 'evaluate your reaction speed')
       .replace(/\bdefend your team'?s net against\b/gi, 'shield your goal against incoming')
       .replace(/\bevery match brings new challenges\b/gi, 'each successive fixture introduces distinct obstacles')
       .replace(/\bthe only salvation is\b/gi, 'survival hinges entirely upon')
       .replace(/\bjoin exciting battles against\b/gi, 'enter competitive skirmishes alongside')
       .replace(/\bstep into the combat zone\b/gi, 'deploy into the active confrontation zone');

  // Ensure first char is capitalized
  s = s.charAt(0).toUpperCase() + s.slice(1);
  if (!s.endsWith('.')) s += '.';
  return s;
}

// Test on 50 games
const sample50 = Object.values(topContent).filter(g => g.status === 'PASS_SCHEDULED').slice(0, 50);
console.log('Generating unique factual prose for 50 games...');

const phraseCounts = new Map();
const sentenceCounts = new Map();

sample50.forEach(g => {
  const hash = hashSlug(g.slug);
  const p1Idx = hash % P1_OPENERS.length;
  const p2Idx = Math.floor(hash / P1_OPENERS.length) % P2_OPENERS.length;

  const rawDesc = cleanFeedText(g.raw_description || '');
  const rawHowTo = cleanFeedText(g.raw_how_to || g.howToPlay || '');
  const sents = rawDesc.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 15);

  const controls = extractControls(rawHowTo, g.howToPlay, false, false, false, false);
  const ctrlKeys = controls.map(c => c.key).join(' and ');

  const p1Op = P1_OPENERS[p1Idx](g.title, 'achieve stage objectives', 'distinct environments');
  const p2Op = P2_OPENERS[p2Idx](ctrlKeys, 'navigate obstacles', 'demanding challenges');

  // Paraphrase 2-3 feed sentences for P1
  const p1BodySents = [];
  for (let i = 0; i < Math.min(sents.length, 3); i++) {
    const ps = paraphraseFeedSentence(sents[i], g.category, g.subgenre, g.title);
    if (ps.length > 20) p1BodySents.push(ps);
  }
  if (p1BodySents.length === 0) {
    p1BodySents.push(`Developing a sound tactical approach in ${g.title} enables you to coordinate every action with confidence.`);
  }

  // Paraphrase remaining feed sentences for P2
  const p2BodySents = [];
  for (let i = 3; i < sents.length; i++) {
    const ps = paraphraseFeedSentence(sents[i], g.category, g.subgenre, g.title);
    if (ps.length > 20) p2BodySents.push(ps);
  }
  if (p2BodySents.length === 0) {
    p2BodySents.push(`Maintaining disciplined focus while operating ${ctrlKeys} ensures you react swiftly to sudden hazards.`);
  }

  const p1 = `${p1Op} ${p1BodySents.join(' ')}`.trim();
  const p2 = `${p2Op} ${p2BodySents.join(' ')}`.trim();
  const desc = `${p1}\n\n${p2}`;

  // Count runs
  const runs = get6WordRuns(desc);
  for (const r of runs) {
    phraseCounts.set(r, (phraseCounts.get(r) || 0) + 1);
  }

  // Count sentences
  const allS = desc.split(/(?<=[.!?])\s+/);
  for (const s of allS) {
    const cl = s.toLowerCase().trim();
    sentenceCounts.set(cl, (sentenceCounts.get(cl) || 0) + 1);
  }
});

let phraseOver5 = 0;
for (const [r, c] of phraseCounts.entries()) {
  if (c > 5) phraseOver5++;
}

let sentenceOver5 = 0;
for (const [s, c] of sentenceCounts.entries()) {
  if (c > 5) sentenceOver5++;
}

console.log('Results across 50 games:');
console.log('6-word phrases on >5 pages:', phraseOver5);
console.log('Sentences on >5 pages:', sentenceOver5);
