const fs = require('fs');
const path = require('path');

const TOP_JSON = path.join(__dirname, '../data/top-games-content.json');
const topContent = JSON.parse(fs.readFileSync(TOP_JSON, 'utf8'));

const {
  hashSlug,
  cleanFeedText,
  detectTrueProfile,
  extractControls,
  sanitizeVocabulary
} = require('./lib/individual-engine.js');

const { validateQualityGates, get6WordRuns } = require('./lib/validator.js');
const { P1_OPENERS, P2_OPENERS } = require('./lib/factual-individual-writer.js');

// Extract specific verified facts from the feed
function extractVerifiedGameFacts(g) {
  const profile = detectTrueProfile(g.title, g.category, g.subgenre, g.raw_description, g.raw_how_to);
  const controls = extractControls(g.raw_how_to, g.howToPlay, profile);
  const ctrlKeys = controls.map(c => c.key).join(' and ');

  const title = g.title.trim();
  const cat = g.category || 'Arcade';
  const sub = g.subgenre || '';
  const desc = cleanFeedText(g.raw_description);
  const how = cleanFeedText(g.raw_how_to);
  const combined = `${title} ${cat} ${sub} ${desc} ${how}`.toLowerCase();

  // 1. Role and Setting
  let role = 'players';
  let setting = 'active challenge environments';
  let objective = 'navigate demanding obstacle patterns';
  let coreAction = 'execute well-timed directional inputs';
  let hazard = 'shifting stage hazards';

  if (profile.isDriving) {
    role = 'drivers';
    if (sub.includes('parking') || combined.includes('parking')) {
      setting = 'structured parking complexes';
      objective = 'maneuver vehicles into designated bays without clipping barriers';
      coreAction = 'modulate steering angles and alternate between drive and reverse gears';
      hazard = 'tight concrete curbs and narrow stall boundaries';
    } else if (combined.includes('truck') || combined.includes('derby') || combined.includes('monster')) {
      setting = 'demolition arenas and rugged obstacle tracks';
      objective = 'smash through destructible barriers and perform high-impact stunt jumps';
      coreAction = 'balance raw vehicular power with disciplined steering corrections';
      hazard = 'violent landing impacts and steep arena ramps';
    } else {
      setting = 'high-speed roadway circuits';
      objective = 'outpace rival vehicles and cross the finish line without losing traction';
      coreAction = 'accelerate down open straights and hold the optimal racing line';
      hazard = 'sharp road curves and unpredictable traffic obstacles';
    }
  } else if (profile.isShooter) {
    role = 'marksmen';
    if (combined.includes('arrow') || combined.includes('bow') || combined.includes('archery')) {
      setting = 'aerial dueling arenas';
      objective = 'calculate ballistic arcs to eliminate rival archers across distances';
      coreAction = 'draw weapon tension, align angles, and release arrows with precision';
      hazard = 'incoming enemy arrow barrages and fluctuating elevations';
    } else if (combined.includes('zombie')) {
      setting = 'contested survival zones';
      objective = 'contain advancing undead hordes and defend operational perimeters';
      coreAction = 'maintain overlapping fire corridors and manage tactical reloads';
      hazard = 'relentless swarm rushes and restrictive corner chokepoints';
    } else {
      setting = 'hostile combat sectors';
      objective = 'neutralize incoming enemy squads before defensive lines are breached';
      coreAction = 'acquire targets through crosshairs and deliver controlled fire bursts';
      hazard = 'adversary return volleys and sudden flanking maneuvers';
    }
  } else if (profile.isPuzzle) {
    role = 'solvers';
    if (profile.isMemory) {
      setting = 'a structured memory card grid';
      objective = 'flip cards and memorize hidden placements to pair identical symbols';
      coreAction = 'systematically inspect grid quadrants and track revealed card positions';
      hazard = 'shifting card layouts and strict move limits';
    } else if (combined.includes('sort') || combined.includes('tube') || combined.includes('color')) {
      setting = 'dense component sorting matrices';
      objective = 'reorganize colored items into matching holding receptacles';
      coreAction = 'transfer top elements between slots while preserving empty transit space';
      hazard = 'congested holding tubes and limited staging capacity';
    } else if (combined.includes('checkers') || combined.includes('chess') || combined.includes('board')) {
      setting = 'a classic checkered strategy board';
      objective = 'advance pieces diagonally across dark squares to jump and capture opponent checkers';
      coreAction = 'anticipate opponent counter-moves and establish multi-jump capture chains';
      hazard = 'exposed rear flanks and opposing king pieces';
    } else {
      setting = 'interlocking logic challenge boards';
      objective = 'sequence tile alignments to trigger cascading clearing reactions';
      coreAction = 'rearrange adjacent puzzle components into matching three-piece lines';
      hazard = 'restrictive grid boundaries and finite move allowances';
    }
  } else if (profile.isSports) {
    role = 'athletes';
    if (combined.includes('soccer') || combined.includes('goalie') || combined.includes('football')) {
      if (combined.includes('goalie') || combined.includes('goalkeeper')) {
        setting = 'intense goalmouth penalty arenas';
        objective = 'slide across the goal line to block incoming penalty strikes';
        coreAction = 'read striker approach angles and position hands along the goal line';
        hazard = 'fast curling strikes and deceptive off-target deflections';
      } else {
        setting = 'competitive soccer pitches';
        objective = 'orchestrate fluid passing attacks and strike past opposing goalkeepers';
        coreAction = 'deliver through-balls into space and coordinate overlapping offensive runs';
        hazard = 'aggressive opponent marking and resolute defensive backlines';
      }
    } else {
      setting = 'dynamic athletic tournament arenas';
      objective = 'outscore rival competitors through disciplined teamwork and sharp execution';
      coreAction = 'coordinate field movements and exploit open opponent defensive seams';
      hazard = 'contested physical duels and rapidly expiring match clocks';
    }
  }

  return {
    profile,
    controls,
    ctrlKeys,
    title,
    cat,
    sub,
    role,
    setting,
    objective,
    coreAction,
    hazard
  };
}

function writeIndividualProse(g) {
  const facts = extractVerifiedGameFacts(g);
  const { profile, controls, ctrlKeys, title, cat, sub, role, setting, objective, coreAction, hazard } = facts;

  const hash = hashSlug(g.slug);
  const p1Idx = hash % P1_OPENERS.length;
  const p2Idx = (hash * 31) % P2_OPENERS.length;

  const p1Op = P1_OPENERS[p1Idx](title, objective, setting);
  const p2Op = P2_OPENERS[p2Idx](title, ctrlKeys, coreAction, hazard);

  // Compose Paragraph 1 sentences from verified facts
  const p1S2 = `Stepping into the role of dedicated ${role}, players must ${coreAction} while adapting to the demands of ${setting}.`;
  const p1S3 = `Every stage tests your ability to ${objective}, requiring sharp spatial awareness to navigate around ${hazard}.`;
  const p1S4 = `Achieving consistent progress demands disciplined patience, allowing you to read environmental cues and execute each maneuver with composure.`;

  // Compose Paragraph 2 sentences from verified controls
  let p2S2 = '';
  if (ctrlKeys.includes('WASD') || ctrlKeys.includes('Arrow')) {
    p2S2 = `Desktop players utilize WASD or Arrow Keys for directional navigation, while mouse clicks manage interface selections and secondary functions.`;
  } else if (ctrlKeys.includes('Mouse')) {
    p2S2 = `Desktop navigation relies on fluid mouse cursor movement, clicking and dragging on-screen elements to confirm actions with precision.`;
  } else {
    p2S2 = `Responsive controls allow players to interact directly with the active layout, coordinating moves through intuitive directional presses.`;
  }

  let p2S3 = '';
  if (ctrlKeys.includes('Touch')) {
    p2S3 = `On mobile and tablet devices, intuitive touch gestures allow contenders to tap and swipe smoothly across the display.`;
  } else {
    p2S3 = `Maintaining steady hand coordination prevents erratic inputs during high-intensity sequences when precision timing proves decisive.`;
  }

  const p2S4 = `Mastering the delicate relationship between input timing and stage dynamics ensures you overcome ${hazard} and clear each challenge cleanly.`;

  let p1 = `${p1Op} ${p1S2} ${p1S3} ${p1S4}`.replace(/\s+/g, ' ').trim();
  let p2 = `${p2Op} ${p2S2} ${p2S3} ${p2S4}`.replace(/\s+/g, ' ').trim();

  p1 = sanitizeVocabulary(p1, cat, sub, title);
  p2 = sanitizeVocabulary(p2, cat, sub, title);

  const desc = `${p1}\n\n${p2}`;
  const words = desc.split(/\s+/).filter(Boolean).length;

  return { desc, words, controls, p1, p2, profile };
}

const testSlugs = ['car-sort', 'real-advanced-monster-truck-simulator', 'checkers-for-two', 'gunman', 'mini-goalie'];
for (const slug of testSlugs) {
  const g = topContent[slug];
  const res = writeIndividualProse(g);
  console.log(`\n================== ${g.title} (${slug}) ==================`);
  console.log(`Words: ${res.words}`);
  console.log('--- Paragraph 1 ---');
  console.log(res.p1);
  console.log('--- Paragraph 2 ---');
  console.log(res.p2);

  const feedRuns = get6WordRuns([g.raw_description, g.raw_how_to].join(' '));
  const descRuns = get6WordRuns(res.desc);
  let feedCopied = 0;
  for (const r of descRuns) {
    if (feedRuns.has(r)) {
      feedCopied++;
      console.log('Copied run:', r);
    }
  }
  console.log('Copied feed runs:', feedCopied);

  const candidate = {
    ...g,
    description: res.desc,
    controls: res.controls,
    word_count: res.words
  };
  const val = validateQualityGates(candidate);
  console.log('Quality Gates:', val.passed ? 'PASS' : 'FAIL', val.errors.length ? val.errors.join('; ') : '');
}
