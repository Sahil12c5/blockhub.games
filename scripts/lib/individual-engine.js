const { checkTrademark } = require('./trademark.js');
const { isNearDuplicate } = require('./near-duplicates.js');
const { checkBlocklist } = require('./blocklist.js');
const {
  DRIVING_TERMS,
  SHOOTING_TERMS,
  PUZZLE_TERMS,
  PLATFORMER_TERMS,
  SPORTS_TERMS,
  FIGHTING_TERMS,
  IDLE_STACKING_TERMS,
  MEMORY_CARD_TERMS,
  RACING_EXCLUSIVE_TERMS,
  UNVERIFIABLE_CHECKS,
  get5WordShingles,
  get6WordRuns
} = require('./validator.js');

function hashSlug(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function cleanFeedText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\b(poki|crazygames|y8|friv|unblocked|gamemonetize|gameflare|silvergames|gamepix)\b/gi, '')
    .replace(/\b(play free online|free online game|play on \w+\.com|download now)\b/gi, '')
    .replace(/\b(60 fps|1080p|verified & ready|verified and ready)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectTrueProfile(title, category, subgenre, rawDesc, rawHowTo) {
  const combined = `${title} ${category} ${subgenre} ${rawDesc} ${rawHowTo}`.toLowerCase();
  const catLower = (category || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();

  const isMemory = combined.includes('memory') || combined.includes('card matching') || combined.includes('flip cards') || combined.includes('match pairs') || combined.includes('matching pairs');

  const isPuzzle = !isMemory && (
    catLower === 'puzzle' ||
    combined.includes('puzzle') || combined.includes('sort') || combined.includes('match 3') ||
    combined.includes('match-3') || combined.includes('jigsaw') || combined.includes('logic grid') ||
    combined.includes('brain teaser') || combined.includes('connect wires') || combined.includes('mahjong') ||
    combined.includes('sudoku') || combined.includes('checkers') || combined.includes('chess') ||
    combined.includes('solitaire') || titleLower.includes('sort') || titleLower.includes('puzzle')
  );

  const isDriving = !isMemory && !isPuzzle && (
    catLower === 'racing' ||
    combined.includes('truck') || combined.includes('parking') || combined.includes('drift') ||
    combined.includes('racing') || combined.includes('motorcycle') || combined.includes('derby') ||
    combined.includes('monster truck') || combined.includes('stunt driver') || combined.includes('highway racer') ||
    combined.includes('bus driving') || combined.includes('kart')
  );

  const isShooter = !isMemory && !isPuzzle && !isDriving && (
    catLower === 'shooting' ||
    combined.includes('sniper') || combined.includes('fps') || combined.includes('shooter') ||
    combined.includes('crosshair') || combined.includes('headshot') || combined.includes('zombie survival') ||
    combined.includes('gunner') || combined.includes('firefight')
  );

  const isSports = !isMemory && !isPuzzle && !isDriving && !isShooter && (
    catLower === 'sports' ||
    combined.includes('soccer') || combined.includes('football') || combined.includes('goalkeeper') ||
    combined.includes('basketball') || combined.includes('tennis') || combined.includes('penalty kick') ||
    combined.includes('free kick')
  );

  const isPlatformer = !isMemory && !isPuzzle && !isDriving && !isShooter && !isSports && (
    combined.includes('platformer') || combined.includes('runner') || combined.includes('obby') ||
    combined.includes('parkour') || combined.includes('jump across')
  );

  const isFighting = !isMemory && !isPuzzle && !isDriving && !isShooter && !isSports && (
    combined.includes('fighter') || combined.includes('brawler') || combined.includes('karate') ||
    combined.includes('kung fu') || combined.includes('combat zone')
  );

  return { isMemory, isDriving, isShooter, isSports, isPuzzle, isPlatformer, isFighting };
}

function extractControls(rawHowTo, howToPlay, profile) {
  const { isDriving, isShooter, isPuzzle, isPlatformer, isSports, isMemory } = profile;
  const combined = (cleanFeedText(rawHowTo) + ' ' + cleanFeedText(howToPlay)).trim();
  const lower = combined.toLowerCase();
  const rows = [];

  // WASD / Arrow Keys
  if (/\b(wasd|w\s*a\s*s\s*d|arrow\s*keys?|arrows)\b/i.test(lower)) {
    let act = 'Navigate through stage areas';
    if (isDriving) act = 'Accelerate forward, steer vehicle, and brake';
    else if (isShooter) act = 'Move character and adjust tactical position';
    else if (isSports) act = 'Control athlete movement and change direction';
    else if (isPlatformer) act = 'Run, move laterally, and position character';
    else if (isPuzzle) act = 'Shift selector or move active puzzle items';
    
    rows.push({ key: 'WASD / Arrow Keys', action: act });
  }

  // Spacebar
  if (lower.includes('space') || lower.includes('spacebar')) {
    let act = '';
    if (isDriving) act = 'Engage handbrake for tight turns and sudden stops';
    else if (isShooter) act = 'Fire primary weapon or trigger combat action';
    else if (isPlatformer && (lower.includes('jump') || lower.includes('leap'))) act = 'Jump over gaps and clear elevated ledges';
    else if (lower.includes('dash')) act = 'Execute dash burst to evade hazards';
    else if (lower.includes('brake')) act = 'Apply emergency brakes to avoid collisions';
    
    if (act) {
      rows.push({ key: 'Spacebar', action: act });
    }
  }

  // Shift Key
  if (lower.includes('shift') && (lower.includes('boost') || lower.includes('nitro') || lower.includes('sprint'))) {
    let act = isDriving ? 'Trigger nitro boost for rapid acceleration' : 'Sprint forward to escape immediate danger';
    rows.push({ key: 'Shift Key', action: act });
  }

  // Mouse / Left Click
  if (lower.includes('mouse') || lower.includes('click') || lower.includes('left-click') || lower.includes('left click')) {
    let act = 'Select in-game items and confirm actions';
    if (isShooter) act = 'Aim pointer crosshairs and fire at hostile targets';
    else if (isMemory) act = 'Click cards to flip and reveal hidden symbols';
    else if (isPuzzle) act = 'Click to select and manipulate puzzle pieces';
    else if (isSports) act = 'Aim shots and interact with match controls';
    else if (isDriving) act = 'Click on-screen controls and navigate menus';
    
    rows.push({ key: 'Mouse / Left Click', action: act });
  }

  // Touch / Mobile
  if (lower.includes('touch') || lower.includes('tap') || lower.includes('mobile') || lower.includes('swipe') || rows.length === 0) {
    let act = 'Tap display to navigate and select options';
    if (isShooter) act = 'Touch on-screen aiming reticle and fire buttons';
    else if (isMemory) act = 'Tap cards to reveal and pair identical pictures';
    else if (isPuzzle) act = 'Tap items to move or clear puzzle configurations';
    else if (isSports) act = 'Tap and swipe to pass, shoot, and tackle';
    else if (isDriving) act = 'Touch virtual pedals and on-screen steering controls';
    
    rows.push({ key: 'Touch / Mobile', action: act });
  }

  return rows;
}

function sanitizeVocabulary(text, category, subgenre, title) {
  const catLower = (category || '').toLowerCase();
  const subLower = (subgenre || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();

  const isDriving = catLower === 'racing' || ['parking', 'truck', 'drift', 'moto', 'racing', 'driving', 'car', 'taxi'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isShooter = catLower === 'shooting' || ['fps', 'sniper', 'shooter', 'zombie'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isPuzzle = catLower === 'puzzle' || ['puzzle', 'sort', 'match', 'trivia', 'merge', 'brain', 'board'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isPlatformer = ['platformer', 'runner', 'adventure'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isSports = catLower === 'sports' || ['sports', 'soccer', 'football', 'basketball', 'tennis', 'golf', 'billiards'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isFighting = ['fighter', 'fighting', 'brawler', 'stickman', 'martial arts', 'wrestling'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isIdle = ['idle', 'clicker', 'stack', 'stacking', 'merge'].some(k => subLower.includes(k) || titleLower.includes(k));
  const isMemory = ['memory', 'card', 'pairs'].some(k => subLower.includes(k) || titleLower.includes(k));

  let res = text;
  const placeholder = '___GAME_TITLE_PROTECTED___';
  if (title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    res = res.replace(new RegExp(escaped, 'g'), placeholder);
  }

  // Replace banned driving terms
  if (!isDriving) {
    const map = {
      'vehicles?': 'units',
      'steering': 'guiding',
      'laps?': 'rounds',
      'drivers?': 'players',
      'braking': 'stopping',
      'cornering': 'turning',
      'checkpoints?': 'markers',
      'traffic': 'hazards',
      'tracks?': 'paths',
      'tires?': 'wheels',
      'throttle': 'momentum',
      'handbrake': 'brake',
      'drifting': 'sliding',
      'racecar': 'craft',
      'motorcycle': 'cycle',
      'cargo': 'supplies',
      'haulers': 'units'
    };
    for (const [k, v] of Object.entries(map)) {
      res = res.replace(new RegExp(`\\b${k}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v);
    }
  }

  // Replace banned shooting terms
  if (!isShooter) {
    const map = {
      'reloads?': 'resets',
      'ammo': 'resources',
      'ammunition': 'supplies',
      'crosshairs?': 'indicators',
      'headshots?': 'critical strikes',
      'firefights?': 'battles',
      'reticle': 'pointer',
      'sniper rifle': 'ranged weapon',
      'magazine': 'capacity',
      'bullets?': 'projectiles',
      'gunplay': 'combat mechanics',
      'firearms': 'weapons',
      'marksman': 'specialist',
      'sharpshooter': 'expert'
    };
    for (const [k, v] of Object.entries(map)) {
      res = res.replace(new RegExp(`\\b${k}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v);
    }
  }

  // Replace banned puzzle terms
  if (!isPuzzle && (isDriving || isShooter || catLower === 'sports')) {
    const map = {
      'puzzles?': 'challenges',
      'puzzler': 'game',
      'jigsaw': 'challenge',
      'riddles?': 'mysteries',
      'logic board': 'arena',
      'brain teaser': 'test of reflexes'
    };
    for (const [k, v] of Object.entries(map)) {
      res = res.replace(new RegExp(`\\b${k}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v);
    }
  }

  // Replace banned platformer terms
  if (!isPlatformer && (catLower === 'puzzle' || catLower === 'racing' || isDriving)) {
    const map = {
      'platformers?': 'games',
      'platforming': 'movement',
      'double jump': 'leap',
      'wall jump': 'rebound',
      'chasms?': 'chasms',
      'jump across gaps': 'cross obstacles',
      'ledge grab': 'grip'
    };
    for (const [k, v] of Object.entries(map)) {
      res = res.replace(new RegExp(`\\b${k}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v);
    }
  }

  // Replace banned sports terms
  if (!isSports && (isShooter || isPuzzle || isDriving || isFighting)) {
    const map = {
      'striker': 'attacker',
      'goalkeeper': 'defender',
      'free kick': 'set piece',
      'penalty shot': 'critical strike',
      'halftime': 'intermission',
      'touchdown': 'score',
      'quarterback': 'leader',
      'end zone': 'goal line',
      'dunk': 'score',
      'slam dunk': 'decisive move',
      'three-pointer': 'long-range shot'
    };
    for (const [k, v] of Object.entries(map)) {
      res = res.replace(new RegExp(`\\b${k}\\b`, 'gi'), (m) => m[0] === m[0].toUpperCase() ? v.charAt(0).toUpperCase() + v.slice(1) : v);
    }
  }

  // Clean racing exclusive terms in non-racing
  if (catLower !== 'racing' || subLower === 'parking') {
    res = res
      .replace(/\bcheckered flag\b/gi, 'finish line')
      .replace(/\bstarting grid\b/gi, 'starting line')
      .replace(/\bgrand prix\b/gi, 'tournament')
      .replace(/\bpole position\b/gi, 'lead spot')
      .replace(/\bpodium finish\b/gi, 'top rank');
  }

  if (title) {
    res = res.replace(new RegExp(placeholder, 'g'), title);
  }

  return res;
}

module.exports = {
  hashSlug,
  cleanFeedText,
  detectTrueProfile,
  extractControls,
  sanitizeVocabulary
};
