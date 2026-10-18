const fs = require("fs");
const path = require("path");

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
];

let cachedBlocklist = null;

function getBlocklist() {
  if (cachedBlocklist) return cachedBlocklist;
  cachedBlocklist = EXPLICIT_BLOCKLIST.map((p) => p.toLowerCase());
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
};
