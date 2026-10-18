const { checkBlocklist } = require("./blocklist.js");

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

function computeJaccardSimilarity(setA, setB) {
  if (!setA || !setB || !(setA instanceof Set) || !(setB instanceof Set) || setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const s of setA) {
    if (setB.has(s)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Category-fit keywords to ensure no racing tips on non-racing games
const RACING_EXCLUSIVE_TERMS = ["lap times", "apex of the curve", "understeer", "drifting around corners", "braking into tight corners"];

function validateQualityGates(contentData, allIndexableShingleMap) {
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
  } = contentData;

  const errors = [];

  // Gate 1: Word Count (150 - 300 words)
  const actualWords = (description || "").split(/\s+/).filter(Boolean).length;
  if (actualWords < 150 || actualWords > 300) {
    errors.push(`word_count_out_of_range: ${actualWords} words (must be 150-300)`);
  }

  // Gate 2: No sentence or paragraph repeats
  const paragraphs = description.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const paraSet = new Set(paragraphs);
  if (paraSet.size !== paragraphs.length) {
    errors.push("repeated_paragraph_detected");
  }

  const sentences = description
    .split(/[.!?]+/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 10);
  const sentenceSet = new Set(sentences);
  if (sentenceSet.size !== sentences.length) {
    errors.push("repeated_sentence_detected");
  }

  // Gate 3: Similarity to every other indexable game is below 40% (5-word shingles / Jaccard)
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

  // Gate 4: Title appears in the text, and text is not mostly the title repeated
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  if (!descLower.includes(titleLower)) {
    errors.push("title_missing_from_about_text");
  }
  const titleWords = titleLower.split(/\s+/).filter(Boolean).length;
  const titleOccurrences = descLower.split(titleLower).length - 1;
  if ((titleWords * titleOccurrences) / actualWords > 0.15) {
    errors.push("excessive_title_repetition");
  }

  // Gate 5: Blocklist generic phrases check
  const blocklistMatches = checkBlocklist(description);
  if (blocklistMatches.length > 0) {
    errors.push(`generic_blocklist_phrase_detected: "${blocklistMatches.join('", "')}"`);
  }

  // Gate 6: Tips and controls fit category (no racing tips on non-racing games)
  if (!controls || controls.length < 3) {
    errors.push("insufficient_controls_guide");
  }
  if (!tips || tips.length < 3) {
    errors.push("insufficient_strategic_tips");
  }
  if (category.toLowerCase() !== "racing") {
    const combinedTips = (tips || []).join(" ").toLowerCase();
    for (const term of RACING_EXCLUSIVE_TERMS) {
      if (combinedTips.includes(term)) {
        errors.push(`inappropriate_racing_tip_in_non_racing_category: contains "${term}"`);
        break;
      }
    }
  }

  // Gate 7: meta_title <= 60 chars, meta_description 140 - 160 chars
  if (!meta_title || meta_title.length > 60) {
    errors.push(`meta_title_too_long: ${meta_title ? meta_title.length : 0} chars (max 60)`);
  }
  if (!meta_description || meta_description.length < 140 || meta_description.length > 160) {
    errors.push(`meta_description_out_of_range: ${meta_description ? meta_description.length : 0} chars (must be 140-160)`);
  }

  // Gate 8: 8 related games, none duplicated
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
  }

  return {
    passed: errors.length === 0,
    errors,
    maxSimilarity,
    mostSimilarSlug,
    shingles: currentShingles,
  };
}

module.exports = {
  get5WordShingles,
  computeJaccardSimilarity,
  validateQualityGates,
};
