const { checkBlocklist } = require("./blocklist.js");
const { isNearDuplicate } = require("./near-duplicates.js");
const { checkTrademark } = require("./trademark.js");

function get5WordShingles(text) {
  const words = (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const shingles = new Set();
  for (let i = 0; i <= words.length - 5; i++) {
    shingles.add(words.slice(i, i + 5).join(" "));
  }
  return shingles;
}

function get6WordRuns(text) {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const runs = new Set();
  for (let i = 0; i <= words.length - 6; i++) {
    runs.add(words.slice(i, i + 6).join(" "));
  }
  return runs;
}

function computeJaccardSimilarity(setA, setB) {
  if (!setA || !setB || !(setA instanceof Set) || !(setB instanceof Set) || setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const s of setA) {
    if (setB.has(s)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Driving words allowed ONLY in racing, driving, and parking games
const DRIVING_TERMS = [
  "vehicle", "vehicles", "steering", "apex", "oversteer", "understeer",
  "lap", "laps", "driver", "drivers", "braking", "cornering", "checkpoint",
  "checkpoints", "traffic", "track", "tracks", "chicane", "chicanes",
  "tire", "tires", "throttle", "handbrake", "speedometer", "drifting",
  "racecar", "motorcycle", "haulers", "cargo", "gearbox"
];

// Shooting words allowed ONLY in shooters/shootings
const SHOOTING_TERMS = [
  "reload", "reloading", "ammo", "ammunition", "crosshair", "crosshairs",
  "headshot", "headshots", "firefight", "firefights", "reticle", "sniper rifle",
  "magazine", "bullet drop", "bullet", "bullets", "gunplay", "firearms",
  "marksman", "sharpshooter"
];

// Puzzle words (banned in action, sports, racing, driving, shooting, fighting)
const PUZZLE_TERMS = [
  "jigsaw", "anagram", "anagrams", "sudoku", "crossword", "crosswords", "tangram", "nonogram"
];

// Platformer words (banned in puzzle, card, driving, parking, sports)
const PLATFORMER_TERMS = [
  "wall-jump", "wall jump", "double-jump", "double jump", "ledge grab", "springboard"
];

// Sports words (banned in puzzle, platformer, shooter, driving, card, idle, fighting)
const SPORTS_TERMS = [
  "touchdown", "quarterback", "slam dunk", "free kick", "penalty kick", "offside", "fairway", "putting green", "homerun", "home run", "halftime"
];

// Fighting words (banned in puzzle, racing, parking, idle, card, bubble shooter)
const FIGHTING_TERMS = [
  "uppercut", "hadouken", "combo breaker", "knockout punch", "fatal strike", "roundhouse kick"
];

// Idle/Stacking words (banned in sports, racing, fighting, shooting)
const IDLE_STACKING_TERMS = [
  "passive income", "idle generator", "auto-clicker", "autoclicker", "offline earnings", "prestige multiplier", "toppling tower"
];

// Memory-card words (banned in racing, shooter, sports, platformer, fighting)
const MEMORY_CARD_TERMS = [
  "card flipping", "face-down cards", "memory pairs", "card-matching", "flip over cards"
];

const RACING_EXCLUSIVE_TERMS = [
  "lap times",
  "apex of the curve",
  "understeer",
  "drifting around corners",
  "braking into tight corners",
  "racing line",
  "handbrake drifting",
  "high-velocity speed",
  "top speed records",
  "drag coefficient",
  "tire grip compounds",
  "aerodynamic downforce",
];

const PARKING_EXCLUSIVE_TERMS = [
  "reverse mirror navigation",
  "parallel parking",
  "tight garage",
  "parking spot",
  "parking jam",
  "backing into",
  "parking precision",
];

const SHOOTING_EXCLUSIVE_TERMS = [
  "headshot accuracy",
  "ammunition management",
  "crosshair",
  "reload timing",
  "sniper scope",
  "bullet drop",
];

const UNVERIFIABLE_CHECKS = [
  { term: "leaderboard", regex: /\bleaderboards?\b/i, feedRegex: /\bleaderboards?\b/i },
  { term: "unlockable items/features", regex: /\bunlock(?:able|ing|ed|s)?\b/i, feedRegex: /\bunlock(?:able|ing|ed|s)?\b/i },
  { term: "levels", regex: /\blevels?\b/i, feedRegex: /\blevels?\b/i },
  { term: "upgrades", regex: /\bupgrades?\b/i, feedRegex: /\bupgrades?\b/i },
  { term: "multiplayer", regex: /\bmultiplayer\b/i, feedRegex: /\bmultiplayer\b/i, allowedCategory: "multiplayer" },
  { term: "achievements", regex: /\bachievements?\b/i, feedRegex: /\bachievements?\b/i },
  { term: "save progress", regex: /\bsave(?:d)?\s+progress\b/i, feedRegex: /\bsave(?:d)?\s+progress\b/i },
];

const PUBLISHER_TAGLINE_PATTERNS = [
  /\b(?:the\s+)?best\b.*?\bgame\s+(?:202[0-9]|2030)\b/i,
  /\bno\.?\s*1\s+(?:free\s+)?(?:online\s+)?game\b/i,
  /\bultimate\s+(?:gaming\s+)?experience\b/i,
  /\bstandout\s+free\s+online\b/i,
  /\bplay\s+the\s+best\b/i,
  /\bpremier\s+online\s+title\b/i,
  /\bcutting[- ]edge\s+graphics\b/i,
  /\bunparalleled\s+gaming\b/i,
  /\brevolutionary\s+gameplay\b/i,
];

function validateQualityGates(contentData, allIndexableShingleMap = null, catalogSentenceCounts = null) {
  const {
    slug,
    title,
    category,
    word_count,
    description,
    tips,
    controls,
    meta_title,
    meta_description,
    related,
    subgenre,
    raw_description,
    raw_how_to,
    howToPlay,
  } = contentData;

  const errors = [];
  const descText = (description || "").trim();
  const descLower = descText.toLowerCase();

  // Gate 1: Structure (exactly 2 rich paragraphs; browser line rendered in shared page template)
  const paras = descText.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  if (paras.length !== 2) {
    errors.push(`paragraph_count_invalid: ${paras.length} paragraphs (must be exactly 2 paragraphs)`);
  }

  // Gate 2: Word Count (Target 160-240 words, min 150)
  const actualWords = descText.split(/\s+/).filter(Boolean).length;
  const minWords = 150;
  const maxWords = 240;
  if (actualWords < minWords) {
    errors.push(`word_count_too_low: ${actualWords} words (min ${minWords}, target 160-240)`);
  } else if (actualWords > maxWords) {
    errors.push(`word_count_too_high: ${actualWords} words (max ${maxWords}, target 160-240)`);
  }

  // Gate 3: No repeated adjacent words ("sharpens sharpens")
  const adjDupe = descText.match(/\b([a-zA-Z]{2,})\s+\1\b/i);
  if (adjDupe) {
    errors.push(`repeated_adjacent_words: "${adjDupe[0]}"`);
  }

  // Gate 4: Sentences must start with capital letter
  const rawSentences = descText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  for (const s of rawSentences) {
    const cleanS = s.replace(/^[^a-zA-Z0-9]+/, "");
    const firstChar = cleanS.charAt(0);
    if (firstChar && firstChar === firstChar.toLowerCase() && /[a-z]/.test(firstChar)) {
      errors.push(`sentence_starts_with_lowercase: "${s.slice(0, 30)}..."`);
      break;
    }
  }

  // Gate 5: Capitalization of catalog title (Never lowercase title at start)
  if (title && descText) {
    const firstWord = descText.replace(/^[^a-zA-Z0-9]+/, "").split(/\s+/)[0];
    const expectedFirstWord = title.trim().replace(/^[^a-zA-Z0-9]+/, "").split(/\s+/)[0];
    if (firstWord.toLowerCase() === expectedFirstWord.toLowerCase()) {
      if (firstWord[0] !== firstWord[0].toUpperCase()) {
        errors.push(`sentence_starts_with_lowercase_title: "${firstWord}" should be capitalized`);
      }
    }
  }

  // Gate 6: Sentence repetition across pages (no sentence on > 5 pages)
  if (catalogSentenceCounts) {
    for (const s of rawSentences) {
      const cleanNorm = s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").trim();
      if (cleanNorm.length > 20 && (catalogSentenceCounts.get(cleanNorm) || 0) > 5) {
        errors.push(`sentence_overused_across_catalog: "${s.slice(0, 40)}..." appears on >5 pages`);
        break;
      }
    }
  }

  // Gate 7: Do not copy feed description (no run of 6+ consecutive words from feed)
  const feedRaw = [raw_description || "", raw_how_to || "", howToPlay || ""].join(" ");
  const feedRuns = get6WordRuns(feedRaw);
  const titleRuns = get6WordRuns(title || "");
  if (feedRuns.size > 0) {
    const descRuns = get6WordRuns(descText);
    for (const run of descRuns) {
      if (feedRuns.has(run) && !titleRuns.has(run)) {
        errors.push(`copied_feed_run_detected: run of 6+ consecutive words matches feed: "${run}"`);
        break;
      }
    }
  }

  // Gate 8: Strip and reject publisher taglines
  for (const pat of PUBLISHER_TAGLINE_PATTERNS) {
    const m = descText.match(pat);
    if (m) {
      errors.push(`publisher_tagline_detected: "${m[0]}"`);
      break;
    }
  }

  // Gate 9: Genre Vocabulary Validator (Strict banned-word lists per genre/subgenre)
  const catLower = (category || "").toLowerCase();
  const subLower = (subgenre || "").toLowerCase();
  const titleLowerWord = (title || "").toLowerCase();

  const isDriving =
    catLower === "racing" ||
    ["parking", "truck", "drift", "moto", "racing", "driving", "car", "taxi"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isShooter =
    catLower === "shooting" ||
    ["fps", "sniper", "shooter", "zombie"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isPuzzle =
    catLower === "puzzle" ||
    ["puzzle", "sort", "match", "trivia", "merge", "brain", "board"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isPlatformer =
    ["platformer", "runner", "adventure"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isSports =
    catLower === "sports" ||
    ["sports", "soccer", "football", "basketball", "tennis", "golf", "billiards"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isFighting =
    ["fighter", "fighting", "brawler", "stickman", "martial arts", "wrestling"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isIdle =
    ["idle", "clicker", "stack", "stacking", "merge"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const isMemory =
    ["memory", "card", "pairs"].some((k) => subLower.includes(k) || titleLowerWord.includes(k));

  const combinedAllText = descText.toLowerCase();

  // Driving words allowed ONLY in racing, driving, and parking games
  if (!isDriving) {
    for (const term of DRIVING_TERMS) {
      if (titleLowerWord.includes(term)) continue;
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_driving_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Shooting words allowed ONLY in shooters
  if (!isShooter) {
    for (const term of SHOOTING_TERMS) {
      if (titleLowerWord.includes(term)) continue;
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_shooting_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Puzzle words banned in pure action, sports, racing, driving, shooting
  if (!isPuzzle && (isDriving || isShooter || catLower === "sports")) {
    for (const term of PUZZLE_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_puzzle_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Platformer words banned in pure driving, puzzle, sports
  if (!isPlatformer && (catLower === "puzzle" || catLower === "racing" || isDriving)) {
    for (const term of PLATFORMER_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_platformer_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Sports words banned in pure puzzle, platformer, shooter, driving, idle, fighting
  if (!isSports && (isShooter || isPuzzle || isDriving || isFighting)) {
    for (const term of SPORTS_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_sports_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Fighting words banned in pure puzzle, racing, parking, idle, bubble shooter
  if (!isFighting && (isDriving || isPuzzle || isIdle)) {
    for (const term of FIGHTING_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_fighting_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Idle words banned in sports, racing, fighting, shooting
  if (!isIdle && (isSports || isDriving || isFighting || isShooter)) {
    for (const term of IDLE_STACKING_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_idle_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Memory card words banned in racing, shooter, sports, platformer, fighting
  if (!isMemory && (isDriving || isShooter || isSports || isFighting)) {
    for (const term of MEMORY_CARD_TERMS) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(combinedAllText)) {
        errors.push(`banned_memory_card_word_in_${category || "game"}: contains "${term}"`);
        break;
      }
    }
  }

  // Racing exclusive phrases
  if (catLower !== "racing" || subLower === "parking") {
    for (const term of RACING_EXCLUSIVE_TERMS) {
      if (combinedAllText.includes(term)) {
        errors.push(`inappropriate_racing_term_in_non_racing_category: contains "${term}"`);
        break;
      }
    }
  }

  // Gate 10: Sentence repeat within same page
  const cleanSentences = rawSentences.map((s) => s.toLowerCase());
  const sentenceSet = new Set(cleanSentences);
  if (sentenceSet.size !== cleanSentences.length) {
    errors.push("repeated_sentence_detected");
  }

  // Gate 11: Sentence Starters Variety
  const starters = rawSentences.map((s) =>
    s.replace(/^[^a-zA-Z0-9]+/, "").split(/\s+/)[0].toLowerCase()
  );

  for (let i = 1; i < starters.length; i++) {
    if (starters[i] && starters[i] === starters[i - 1]) {
      errors.push(`consecutive_repeated_starter: "${starters[i]}" starts sentence ${i} and ${i + 1}`);
    }
  }

  const starterCounts = {};
  for (const st of starters) {
    if (!st) continue;
    starterCounts[st] = (starterCounts[st] || 0) + 1;
    if (starterCounts[st] > 2) {
      errors.push(`overused_sentence_starter: "${st}" used ${starterCounts[st]} times (max allowed 2)`);
    }
  }

  // Gate 12: Jaccard similarity across indexable games (< 40%)
  const currentShingles = get5WordShingles(description);
  let maxSimilarity = 0;
  let mostSimilarSlug = null;

  if (allIndexableShingleMap) {
    for (const [otherSlug, otherShingles] of Object.entries(allIndexableShingleMap)) {
      if (otherSlug.toLowerCase() === slug.toLowerCase()) continue;
      const sim = computeJaccardSimilarity(currentShingles, otherShingles);
      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        mostSimilarSlug = otherSlug;
      }
      if (sim >= 0.40) {
        errors.push(`similarity_exceeded: ${(sim * 100).toFixed(1)}% with ${otherSlug} (max allowed 40%)`);
        break;
      }
    }
  }

  // Gate 13: Title appears in text
  const cleanTitle = (title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanDesc = descLower.replace(/[^a-z0-9]/g, "");
  if (cleanTitle && !cleanDesc.includes(cleanTitle)) {
    errors.push("title_missing_from_about_text");
  }

  // Gate 14: Blocklist generic phrases check
  const blocklistMatches = checkBlocklist(description);
  if (blocklistMatches.length > 0) {
    errors.push(`generic_blocklist_phrase_detected: "${blocklistMatches.join('", "')}"`);
  }

  // Gate 15: Controls suitability (no generic aim/target/interact rows for non-shooters)
  if (!controls || controls.length < 3) {
    errors.push("insufficient_controls_guide");
  } else {
    const nonShooters = ["parking", "racing", "runner", "puzzle", "sports", "merge", "sort", "clicker", "idle"];
    if (!isShooter && (nonShooters.includes(catLower) || nonShooters.includes(subLower))) {
      for (const ctrl of controls) {
        const act = (ctrl.action || "").toLowerCase();
        if (
          act.includes("aim, target") ||
          act.includes("aim crosshair") ||
          act.includes("fire weapon") ||
          (act.includes("aim") && act.includes("target"))
        ) {
          errors.push(`inappropriate_aim_control_in_non_shooter: "${ctrl.key}: ${ctrl.action}"`);
        }
      }
    }
  }

  // Gate 16: No unverifiable claims unless supported by feed text
  const fullFeedText = [raw_description || "", raw_how_to || "", howToPlay || ""].join(" ").toLowerCase();
  for (const uc of UNVERIFIABLE_CHECKS) {
    if (uc.regex.test(descLower)) {
      const allowedByCat = uc.allowedCategory && catLower === uc.allowedCategory;
      if (!allowedByCat && !uc.feedRegex.test(fullFeedText)) {
        errors.push(`unverifiable_claim_detected: "${uc.term}" mentioned in text but not verified in feed data`);
      }
    }
  }

  // Gate 17: Tips count
  if (!tips || tips.length < 3) {
    errors.push("insufficient_strategic_tips");
  }

  // Gate 18: Meta tags length
  if (!meta_title || meta_title.length > 60) {
    errors.push(`meta_title_too_long: ${meta_title ? meta_title.length : 0} chars (max 60)`);
  }
  if (!meta_description || meta_description.length < 140 || meta_description.length > 160) {
    errors.push(`meta_description_out_of_range: ${meta_description ? meta_description.length : 0} chars (must be 140-160)`);
  }

  // Gate 19: 8 related games, no duplicates, no self, no near-duplicates
  if (!related || related.length !== 8) {
    errors.push(`related_count_invalid: ${related ? related.length : 0} (must be exactly 8)`);
  } else {
    const uniqueRelated = new Set(related);
    if (uniqueRelated.size !== 8) {
      errors.push("duplicate_related_games_detected");
    }
    if (uniqueRelated.has(slug)) {
      errors.push("self_referencing_related_game_detected");
    }
    for (const relSlug of related) {
      if (
        isNearDuplicate(
          { slug, title },
          { slug: relSlug, title: relSlug.replace(/[-_]+/g, " ") }
        )
      ) {
        errors.push(`near_duplicate_in_related_games: "${relSlug}" is a near-duplicate of "${slug}"`);
      }
    }
  }

  // Gate 20: Trademark check (blocks indexability)
  const tmCheck = checkTrademark({ slug, title });
  if (tmCheck.flagged && tmCheck.blocksIndex) {
    errors.push(`trademark_detected_blocks_indexability: "${tmCheck.term}" detected in title or slug`);
  }

  return {
    passed: errors.length === 0,
    errors,
    maxSimilarity,
    mostSimilarSlug,
    shingles: currentShingles,
  };
}

function validateCatalogPatterns(catalogItems) {
  const errors = [];
  const total = catalogItems.length;
  if (total === 0) return { passed: true, errors, p1Distribution: {}, p2Distribution: {}, primaryObjectivePct: 0 };

  const p1Counts = {};
  const p2Counts = {};
  let primaryObjectiveCount = 0;

  for (const item of catalogItems) {
    const desc = (item.description || "").trim();
    const paras = desc.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const p1 = paras[0] || "";
    const p2 = paras[1] || "";

    if (/the primary objective is to/i.test(p1)) {
      primaryObjectiveCount++;
    }

    const p1Sent0 = p1.split(/(?<=[.!?])\s+/)[0] || "";
    let p1Cat = "Other";
    if (/^\S.*?\b(drops|plunges|thrusts)\s+players\s+(directly\s+)?into\b/i.test(p1Sent0)) p1Cat = "Drops into premise";
    else if (/^(step into|enter)\s+(the\s+)?(world|arena|realm)\s+of\b/i.test(p1Sent0)) p1Cat = "Step into the arena";
    else if (/^in\s+[A-Za-z0-9].*?,\s*(you|players)\b/i.test(p1Sent0)) p1Cat = "In [Title], you explore";
    else if (/^\S.*?\btests?\s+(your|player)\s+(reflexes|skills|precision|instincts|timing)\b/i.test(p1Sent0)) p1Cat = "Tests your reflexes";
    else if (/^\S.*?\bdelivers?\s+(fast-paced|intense|dynamic|fluid|exciting)\b/i.test(p1Sent0)) p1Cat = "Delivers fast-paced";
    else if (/^built\s+around\b/i.test(p1Sent0)) p1Cat = "Built around challenges";
    else if (/^set\s+across\b/i.test(p1Sent0)) p1Cat = "Set across environments";
    else if (/^\S.*?\bis\s+(an?|the)\s+.*?\b(experience|game|brawler|racer|puzzler|puzzle|platformer|adventure|simulator|shooter|title|challenge|tournament|simulation|runner|obstacle course)\b/i.test(p1Sent0)) p1Cat = "Is a dynamic title";
    else if (/^(commanding|guiding|controlling|leading)\s+.*?in\b/i.test(p1Sent0)) p1Cat = "Commanding the action";

    p1Counts[p1Cat] = (p1Counts[p1Cat] || 0) + 1;

    const p2Sent0 = p2.split(/(?<=[.!?])\s+/)[0] || "";
    let p2Cat = "Other";
    if (/^(precision timing|timing your|disciplined timing)\b/i.test(p2Sent0)) p2Cat = "Precision timing";
    else if (/^success\s+demands\s+a\s+disciplined\s+balance\b/i.test(p2Sent0)) p2Cat = "Disciplined balance";
    else if (/^hazards\s+throughout\s+(each|the)\s+stage\b/i.test(p2Sent0)) p2Cat = "Hazards throughout";
    else if (/^studying\s+(obstacle|enemy|stage|opponent)\b/i.test(p2Sent0)) p2Cat = "Studying obstacle layouts";
    else if (/^maintaining\s+.*?momentum\b/i.test(p2Sent0)) p2Cat = "Maintaining forward momentum";
    else if (/^smooth\s+(keyboard|touch|control)\b/i.test(p2Sent0)) p2Cat = "Smooth keyboard controls";
    else if (/^keep\s+a\s+(sharp|close)\s+eye\b/i.test(p2Sent0)) p2Cat = "Keep a sharp eye";
    else if (/^later\s+(challenges|stages|levels)\s+introduce\b/i.test(p2Sent0)) p2Cat = "Later challenges introduce";
    else if (/^[A-Z][a-z]+ing\b.*?\b(requires|demands|centers on|relies on)\b/i.test(p2Sent0)) p2Cat = "[Gerund phrase] requires";

    p2Counts[p2Cat] = (p2Counts[p2Cat] || 0) + 1;
  }

  for (const [name, count] of Object.entries(p1Counts)) {
    const pct = (count / total) * 100;
    if (pct > 15.0) {
      errors.push(`p1_opener_pattern_overused: "${name}" appears on ${count}/${total} pages (${pct.toFixed(1)}% > 15%)`);
    }
  }

  for (const [name, count] of Object.entries(p2Counts)) {
    const pct = (count / total) * 100;
    if (pct > 15.0) {
      errors.push(`p2_opener_pattern_overused: "${name}" appears on ${count}/${total} pages (${pct.toFixed(1)}% > 15%)`);
    }
  }

  const primPct = (primaryObjectiveCount / total) * 100;
  if (primPct > 10.0) {
    errors.push(`primary_objective_phrase_overused: "The primary objective is to" appears on ${primaryObjectiveCount}/${total} pages (${primPct.toFixed(1)}% > 10%)`);
  }

  return {
    passed: errors.length === 0,
    errors,
    p1Distribution: p1Counts,
    p2Distribution: p2Counts,
    primaryObjectiveCount,
    primaryObjectivePct: primPct,
    totalGames: total,
  };
}

module.exports = {
  get5WordShingles,
  get6WordRuns,
  computeJaccardSimilarity,
  validateQualityGates,
  validateCatalogPatterns,
  UNVERIFIABLE_CHECKS,
  DRIVING_TERMS,
  SHOOTING_TERMS,
};
