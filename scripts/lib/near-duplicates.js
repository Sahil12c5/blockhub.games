/**
 * BLOCKHUB.GAMES - NEAR DUPLICATE DETECTION UTILITY
 * Detects identical or near-duplicate games based on normalized titles, slugs, and assets.
 */

function normalizeText(text) {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .replace(/&[a-z0-9#]+;/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(game|games|online|free|3d|2d|simulator|play|unblocked|webgl|html5|new|edition|edition|2023|2024|2025|2026)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSlug(slug) {
  if (!slug) return "";
  return String(slug)
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\b(game|games|online|free|3d|2d|simulator|play|unblocked|webgl|html5|new|edition|2023|2024|2025|2026)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractAssetId(url) {
  if (!url) return null;
  // Match GameMonetize / GameDistribution IDs
  const m = String(url).match(/(?:gamemonetize|gamedistribution)[^/]*\/(?:co\/)?([a-zA-Z0-9_-]{8,})/i);
  return m ? m[1].toLowerCase() : null;
}

function wordJaccard(strA, strB) {
  const wordsA = new Set(strA.split(/\s+/).filter(Boolean));
  const wordsB = new Set(strB.split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let inter = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) inter++;
  }
  const union = wordsA.size + wordsB.size - inter;
  return union === 0 ? 0 : inter / union;
}

function computeSimilarity(gameA, gameB) {
  if (!gameA || !gameB) return { isDuplicate: false, similarity: 0, reason: null };
  const slugA = (gameA.slug || "").toLowerCase();
  const slugB = (gameB.slug || "").toLowerCase();
  if (slugA === slugB) return { isDuplicate: true, similarity: 1.0, reason: "same_slug" };

  // 1. Asset ID match (same underlying iframe or thumbnail)
  const assetA = extractAssetId(gameA.iframeUrl) || extractAssetId(gameA.thumbnail);
  const assetB = extractAssetId(gameB.iframeUrl) || extractAssetId(gameB.thumbnail);
  if (assetA && assetB && assetA === assetB) {
    return { isDuplicate: true, similarity: 1.0, reason: "same_asset_id" };
  }

  // 2. Normalized slug match
  const normSlugA = normalizeSlug(slugA);
  const normSlugB = normalizeSlug(slugB);
  if (normSlugA && normSlugB && normSlugA === normSlugB) {
    return { isDuplicate: true, similarity: 0.98, reason: "identical_normalized_slug" };
  }

  // 3. Normalized title match
  const normTitleA = normalizeText(gameA.title);
  const normTitleB = normalizeText(gameB.title);
  if (normTitleA && normTitleB && normTitleA === normTitleB) {
    return { isDuplicate: true, similarity: 0.95, reason: "identical_normalized_title" };
  }

  // 4. Slug Jaccard similarity
  const slugSim = wordJaccard(normSlugA, normSlugB);
  if (slugSim >= 0.75) {
    return { isDuplicate: true, similarity: Number(slugSim.toFixed(2)), reason: "high_slug_similarity" };
  }

  // 5. Title Jaccard similarity
  const titleSim = wordJaccard(normTitleA, normTitleB);
  if (titleSim >= 0.75) {
    return { isDuplicate: true, similarity: Number(titleSim.toFixed(2)), reason: "high_title_similarity" };
  }

  return { isDuplicate: false, similarity: Math.max(slugSim, titleSim), reason: null };
}

function isNearDuplicate(gameA, gameB) {
  const res = computeSimilarity(gameA, gameB);
  return res.isDuplicate;
}

module.exports = {
  normalizeText,
  normalizeSlug,
  extractAssetId,
  wordJaccard,
  computeSimilarity,
  isNearDuplicate,
};
