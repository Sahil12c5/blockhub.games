const fs = require("fs");
const path = require("path");

const DYNAMIC_BLOCKLIST_FILE = path.join(__dirname, "dynamic-blocklist.json");

const EXPLICIT_BLOCKLIST = [
  "standout free online racing game",
  "standout free online",
  "high-velocity speed",
  "testing your skills and strategic execution",
  "zero latency",
  "enter the arena",
  "behind-the-wheel mastery",
  "addictive gameplay loop",
  "from the instant you launch into the arena",
  "runs smoothly at 60 frames per second",
  "without requiring any downloads, installation, or third-party plugins",
  "designed to keep you engaged across every round",
  "unlockable trucks",
  "unlockable cars",
  "unlockable levels",
  "unlock new upgrades",
  "endless upgrade paths",
  "hundreds of levels",
  "thousands of levels",
  "cutting-edge graphics",
  "unparalleled gaming experience",
  "revolutionary gameplay",
  "seamless 60 fps action",
  "participants take command of",
  "gamers navigate an interactive",
  "users confront escalating hurdles",
  "delivering immediate arcade enjoyment on any display",
  "engineered specifically for seamless cross-device play",
  "yielding smooth frame rates and rapid stage loading",
  "puzzle solutions",
  "top of the leaderboard",
  "claim your place at the top of the leaderboard",
  "building intuitive muscle memory through deliberate practice is the surest route to high score domination",
  "intuitive mechanics ensure newcomers grasp the rules instantly",
  "clear visual cues and instant stage feedback help you adapt your strategy",
  "clean physics and predictable trajectories remove frustrating guesswork",
  "calibrated input bindings eliminate delay",
  "cross-platform support ensures natural control response across chromebooks",
];

function getDynamicBlocklist() {
  if (fs.existsSync(DYNAMIC_BLOCKLIST_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DYNAMIC_BLOCKLIST_FILE, "utf8"));
      if (Array.isArray(data)) return data;
    } catch (_) {}
  }
  return [];
}

function addDynamicBlocklistPhrases(phrases) {
  const current = new Set(getDynamicBlocklist().map((p) => p.toLowerCase()));
  let added = 0;
  for (const p of phrases) {
    const clean = p.trim().toLowerCase();
    if (clean && !current.has(clean)) {
      current.add(clean);
      added++;
    }
  }
  if (added > 0) {
    fs.writeFileSync(DYNAMIC_BLOCKLIST_FILE, JSON.stringify(Array.from(current), null, 2), "utf8");
    cachedBlocklist = null;
  }
  return added;
}

let cachedBlocklist = null;

function getBlocklist() {
  if (cachedBlocklist) return cachedBlocklist;
  const combined = new Set([
    ...EXPLICIT_BLOCKLIST.map((p) => p.toLowerCase()),
    ...getDynamicBlocklist().map((p) => p.toLowerCase()),
  ]);
  cachedBlocklist = Array.from(combined);
  return cachedBlocklist;
}

function checkBlocklist(text) {
  const normalized = (text || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const list = getBlocklist();
  const matched = [];

  for (const phrase of list) {
    if (normalized.includes(phrase)) {
      matched.push(phrase);
    }
  }

  return matched;
}

module.exports = {
  EXPLICIT_BLOCKLIST,
  getBlocklist,
  checkBlocklist,
  addDynamicBlocklistPhrases,
  getDynamicBlocklist,
};
