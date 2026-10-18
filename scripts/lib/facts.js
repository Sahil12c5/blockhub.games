function cleanText(text) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, " ")
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/\b(poki|crazygames|y8|friv|unblocked|gamemonetize)\b/gi, "")
    .replace(/\benter the arena\b/gi, "step into the combat zone")
    .replace(/\bstandout free online (racing )?game\b/gi, "exciting online title")
    .replace(/\bhigh-velocity speed\b/gi, "rapid momentum")
    .replace(/\btesting your skills and strategic execution\b/gi, "testing your tactical timing")
    .replace(/\bzero latency\b/gi, "immediate responsiveness")
    .replace(/\*\*/g, "")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function detectSubgenre(title, category, desc) {
  const combined = `${title} ${desc} ${category}`.toLowerCase();

  if (combined.includes("parking") || combined.includes("park the")) return "parking";
  if (combined.includes("truck") || combined.includes("cargo") || combined.includes("trailer")) return "truck";
  if (combined.includes("drift") || combined.includes("drifting")) return "drift";
  if (combined.includes("bike") || combined.includes("motorcycle") || combined.includes("moto")) return "moto";
  if (combined.includes("sniper") || combined.includes("headshot") || combined.includes("rifle")) return "sniper";
  if (combined.includes("zombie") || combined.includes("undead")) return "zombie";
  if (combined.includes("fps") || combined.includes("shooter") || combined.includes("gun")) return "fps";
  if (combined.includes("stickman") || combined.includes("ragdoll")) return "stickman";
  if (combined.includes("match 3") || combined.includes("match-3") || combined.includes("bubble")) return "match3";
  if (combined.includes("sort") || combined.includes("sorting") || combined.includes("screw") || combined.includes("nuts")) return "sort";
  if (combined.includes("jigsaw") || combined.includes("puzzle") || combined.includes("brain") || combined.includes("math")) return "puzzle";
  if (combined.includes("football") || combined.includes("soccer") || combined.includes("penalty")) return "soccer";
  if (combined.includes("basketball") || combined.includes("dunk") || combined.includes("hoop")) return "basketball";
  if (combined.includes("runner") || combined.includes("run") || combined.includes("dash") || combined.includes("obby")) return "runner";
  if (combined.includes("tower defense") || combined.includes("defense") || combined.includes("plants")) return "tower-defense";
  if (combined.includes("idle") || combined.includes("clicker")) return "clicker";
  if (combined.includes("fight") || combined.includes("brawl") || combined.includes("boxing") || combined.includes("combat")) return "fighter";

  return category.toLowerCase();
}

function parseControlsFromHowTo(howToPlay, subgenre, category) {
  const cleaned = cleanText(howToPlay);
  const rows = [];

  // Check for explicit key matches
  const hasWASD = /\bwasd\b/i.test(cleaned);
  const hasArrows = /\barrows?|arrow keys?\b/i.test(cleaned);
  const hasSpace = /\bspace(bar)?\b/i.test(cleaned);
  const hasMouse = /\bmouse|left click|click|cursor\b/i.test(cleaned);
  const hasShift = /\bshift\b/i.test(cleaned);
  const hasTouch = /\btouch|tap|swipe\b/i.test(cleaned);

  if (hasWASD && hasArrows) {
    rows.push({
      key: "WASD / Arrow Keys",
      action: subgenre.includes("car") || subgenre === "parking" || subgenre === "truck" || subgenre === "drift"
        ? "Steer, accelerate, and reverse vehicle"
        : "Move character and navigate surroundings",
    });
  } else if (hasWASD) {
    rows.push({
      key: "W A S D",
      action: subgenre.includes("car") || subgenre === "parking" || subgenre === "truck" || subgenre === "drift"
        ? "Drive forward, brake, and steer left/right"
        : "Navigate character across the stage",
    });
  } else if (hasArrows) {
    rows.push({
      key: "Arrow Keys",
      action: "Control directional movement and position",
    });
  }

  if (hasSpace) {
    let spaceAction = "Execute primary jump or activate action";
    if (subgenre === "drift" || subgenre === "parking" || category === "Racing") {
      spaceAction = "Engage handbrake for sharp turns or immediate stop";
    } else if (subgenre === "fps" || subgenre === "sniper" || category === "Shooting") {
      spaceAction = "Jump over obstacles or deploy tactical defense";
    }
    rows.push({ key: "Spacebar", action: spaceAction });
  }

  if (hasMouse || rows.length === 0) {
    let mouseAction = "Aim, target, and interact with on-screen elements";
    if (subgenre === "puzzle" || subgenre === "match3" || subgenre === "sort") {
      mouseAction = "Select, drag, and drop puzzle pieces";
    } else if (subgenre === "fps" || subgenre === "sniper") {
      mouseAction = "Aim reticle and fire weapon with left click";
    } else if (subgenre === "clicker") {
      mouseAction = "Click repeatedly to collect resources and buy upgrades";
    }
    rows.push({ key: "Mouse / Left Click", action: mouseAction });
  }

  if (hasShift) {
    rows.push({ key: "Shift Key", action: "Sprint, trigger nitro boost, or accelerate rapidly" });
  }

  // Always provide mobile fallback
  rows.push({
    key: "Touch / Mobile",
    action: subgenre === "puzzle" || subgenre === "match3" || subgenre === "sort"
      ? "Tap and swipe screen to manipulate tiles or items"
      : "Virtual analog stick and responsive tap buttons",
  });

  return rows;
}

function extractGameFacts(game) {
  const title = (game.title || "").trim();
  const rawDesc = cleanText(game.description || "");
  const rawHowTo = cleanText(game.howToPlay || "");
  const category = (game.category || "Arcade").trim();

  // Validate sufficient info
  const wordCount = rawDesc.split(/\s+/).filter(Boolean).length;
  if (rawDesc.length < 90 || wordCount < 16) {
    return {
      hasSufficientInfo: false,
      reason: `insufficient_info: description too short (${rawDesc.length} chars, ${wordCount} words)`,
    };
  }

  const subgenre = detectSubgenre(title, category, rawDesc);
  const controls = parseControlsFromHowTo(rawHowTo, subgenre, category);

  // Extract core concepts for description synthesis
  const sentences = rawDesc.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15);

  return {
    hasSufficientInfo: true,
    title,
    category,
    subgenre,
    rawDesc,
    rawHowTo,
    sentences,
    controls,
  };
}

module.exports = {
  cleanText,
  detectSubgenre,
  parseControlsFromHowTo,
  extractGameFacts,
};
