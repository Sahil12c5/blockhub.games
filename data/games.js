/**
 * ============================================================================
 * BLOCKHUB.GAMES - MASTER GAMES DATABASE (/data/games.js)
 * ============================================================================
 * 
 * Multi-genre library featuring Action, Racing, Shooting, Puzzle, Sports,
 * Multiplayer, Adventure, and Arcade HTML5 web games.
 * 
 * HOW TO ADD / UPDATE GAMES:
 * 1. Replace the "iframeUrl" placeholder with your actual GameMonetize or
 *    GameDistribution iframe embed URL.
 *    Example: "https://html5.gamemonetize.com/abc123xyz456/"
 * 2. Update the "thumbnail" path to point to your image in /public/thumbnails/
 * 3. Each game features 300-500 words of original SEO content, controls, tips, and FAQ.
 * ============================================================================
 */

export const games = [
  {
    slug: "cyber-drift-city-3d",
    title: "Cyber Drift City 3D",
    category: "Racing",
    featured: true,
    rating: 4.9,
    plays: "245.8K",
    thumbnail: "/thumbnails/cyber-drift-city-3d.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Cyber Drift City 3D launches players into an electrifying neon-lit metropolis where high-octane street racing meets precision drift mechanics. Tear across glowing asphalt expressways, navigate sharp hairpins between towering skyscrapers, and trigger nitro superchargers to outrun rival street racers. Upgrade your garage with high-performance turbocharged sports coupes, customize custom alloy rims and neon underglow, and tune your suspension for pinpoint drift angle control. Featuring responsive realistic vehicle physics, dynamic weather systems, and pulsating electronic synthwave soundtracks, Cyber Drift City 3D brings console-grade arcade driving right into your web browser without lag or installations.",
    howToPlay:
      "Accelerate down open city straights and initiate power slides by tapping the handbrake as you turn into corners. Counter-steer smoothly to maintain optimal drift angle without slamming into safety barriers. Chaining consecutive drift combos fills your nitro gauge, which can be unleashed on exit straights for blistering acceleration. Complete time-trial circuits, dodge incoming street traffic, and earn cash bounties to unlock championship supercars in the performance garage.",
    controls: [
      { key: "W / Up Arrow", action: "Accelerate vehicle" },
      { key: "S / Down Arrow", action: "Brake & Reverse" },
      { key: "A / Left Arrow", action: "Steer Left" },
      { key: "D / Right Arrow", action: "Steer Right" },
      { key: "Spacebar", action: "Handbrake / Initiate Drift" },
      { key: "Shift", action: "Nitro Boost" },
      { key: "C", action: "Change Camera Perspective" },
      { key: "R", action: "Reset Car on Track" },
    ],
    tips: [
      "Feather the throttle during long drifts to prevent spinning out your rear tires.",
      "Save full nitro tanks for straightaways immediately after exiting slow, technical corners.",
      "Upgrade tire grip and brake kits first to maintain tighter racing lines on city tracks.",
      "Clip the inner apex of corners to shave fractions of a second off your lap times.",
    ],
    features: [
      "Stunning 3D neon city environments with dynamic night lighting and rainy track surfaces.",
      "Over 12 customizable drift sports cars with unique handling and tuning profiles.",
      "Physics-driven tire friction, weight transfer, and nitrous boost simulation.",
      "Multiple gameplay modes including Drift Arena, Time Attack, and Free Roam.",
    ],
    faq: [
      {
        q: "Can I play Cyber Drift City 3D with a gamepad controller?",
        a: "Yes, standard USB and Bluetooth gamepads are supported natively via modern browser Gamepad APIs.",
      },
      {
        q: "How do I earn cash to unlock new drift cars?",
        a: "You earn cash by maintaining high-scoring drift chains, finishing podium in circuit races, and beating speed-trap targets.",
      },
      {
        q: "Does this racing game run smoothly on Chromebooks?",
        a: "Yes! Cyber Drift City 3D is heavily optimized with WebGL 2.0 to deliver steady 60 FPS performance on lightweight laptops.",
      },
    ],
  },
  {
    slug: "shadow-strike-ops-fps",
    title: "Shadow Strike Ops FPS",
    category: "Shooting",
    featured: true,
    rating: 4.8,
    plays: "310.4K",
    thumbnail: "/thumbnails/shadow-strike-ops-fps.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Shadow Strike Ops FPS is a military-grade tactical first-person shooter that tests your weapon handling, map awareness, and trigger discipline. Infiltrate hostile compound facilities, neutralize rogue terrorist cells, and secure vital intelligence packages under high-stakes combat pressure. Choose from an extensive arsenal of authentic modern firearms including suppressed carbines, heavy battle rifles, tactical pump shotguns, and precision bolt-action sniper rifles. With realistic bullet recoil patterns, headshot multipliers, and destructive environmental cover, Shadow Strike Ops brings competitive tactical shooter thrills directly into your browser window.",
    howToPlay:
      "Clear mission sectors room by room, checking corners and using flashbangs before breaching hostile doorways. Aim down sights (ADS) with the right mouse button to stabilize your shot spread and line up lethal headshots. Reload during tactical retreats behind concrete pillars rather than in open combat zones. Collect dropped enemy weapon magazines, defuse enemy bomb caches, and extract safely at designated mission landing zones.",
    controls: [
      { key: "W, A, S, D", action: "Move soldier" },
      { key: "Mouse Aim", action: "Look & aim weapon crosshair" },
      { key: "Left Click", action: "Fire weapon" },
      { key: "Right Click", action: "Aim Down Sights (ADS)" },
      { key: "R", action: "Reload magazine" },
      { key: "Spacebar", action: "Jump / Vault low barriers" },
      { key: "Shift", action: "Tactical Sprint" },
      { key: "C", action: "Crouch for improved shot stability" },
      { key: "1 - 3", action: "Switch Primary / Secondary / Grenade" },
    ],
    tips: [
      "Always aim at head height when rounding corners to achieve instant one-tap eliminations.",
      "Crouching reduces bullet spread by over 40%, significantly boosting medium-range accuracy.",
      "Listen for distinct enemy reload and footstep audio cues to predict hostile flanking routes.",
      "Throw smoke grenades to safely cross open sniper sightlines in urban corridors.",
    ],
    features: [
      "Authentic tactical FPS gameplay with recoil control and realistic ballistic trajectories.",
      "15 weapon types with optical attachments, suppressors, and extended magazines.",
      "Intense single-player spec-ops campaigns and target-elimination shooting ranges.",
      "Buttery-smooth 60 FPS WebGL graphics with zero install requirements.",
    ],
    faq: [
      {
        q: "What is the best all-around weapon in Shadow Strike Ops?",
        a: "The M4A1 Tactical Carbine offers the most balanced recoil recovery, fire rate, and reload speed for versatile combat.",
      },
      {
        q: "Can I adjust mouse sensitivity in game?",
        a: "Yes, open the in-game settings menu by pressing ESC to calibrate your preferred horizontal and vertical mouse sensitivity.",
      },
    ],
  },
  {
    slug: "block-craft-survival-3d",
    title: "Block Craft Survival 3D",
    category: "Adventure",
    featured: true,
    rating: 4.8,
    plays: "192.5K",
    thumbnail: "/thumbnails/block-craft-survival.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Block Craft Survival 3D drops you into an expansive procedural open-world sandbox teeming with diverse biomes, mysterious cave networks, and dangerous wildlife. As a lone survivor stranded in an untamed frontier, your immediate goal is gathering natural resources before sundown. Chop down trees for timber, assemble a sturdy crafting bench, and forge durable mining tools. As night falls, fortify your shelter against roving nocturnal monsters. Delve deep into subterranean caverns to unearth valuable coal, iron, and sparkling diamond clusters. Smelt ores into hardened armor and enchanted broadswords to conquer challenging wilderness dimensions.",
    howToPlay:
      "Gather timber and stone immediately upon spawning to craft basic picks, axes, and torches. Build a sheltered base before the first nightfall to avoid hostile creatures. Farm crops and hunt wildlife to keep your stamina replenished. Dig deep beneath the terrain to discover rich ore deposits, and use furnaces to craft weapons and sturdy protective armor.",
    controls: [
      { key: "W, A, S, D", action: "Move character" },
      { key: "Mouse", action: "Look & aim cursor" },
      { key: "Left Click", action: "Mine blocks / Attack" },
      { key: "Right Click", action: "Place blocks / Use items" },
      { key: "Spacebar", action: "Jump / Swim upward" },
      { key: "Shift", action: "Sneak / Safe edge walk" },
      { key: "1 - 9", action: "Hotbar shortcuts" },
      { key: "E", action: "Open inventory" },
    ],
    tips: [
      "Never dig directly downward to avoid falling into molten subterranean lava pools.",
      "Keep torches placed every 6 blocks in mines to stop hostile mobs from spawning.",
      "Cook meat over campfires or furnaces to maximize health restoration.",
    ],
    features: [
      "Infinite procedural sandbox world featuring mountains, lush forests, and deep caverns.",
      "Comprehensive crafting tree with over 150 unique recipes for tools and building structures.",
      "Dynamic weather and day-night survival cycle with browser auto-save.",
    ],
    faq: [
      {
        q: "How does world saving work?",
        a: "All structures, inventories, and terrain changes automatically save to your browser's local storage.",
      },
      {
        q: "Are diamonds available deep underground?",
        a: "Yes, diamonds are located at the deepest bedrock levels, usually near underground lava rivers.",
      },
    ],
  },
  {
    slug: "super-kick-soccer-champions",
    title: "Super Kick Soccer Champions",
    category: "Sports",
    featured: true,
    rating: 4.7,
    plays: "188.1K",
    thumbnail: "/thumbnails/super-kick-soccer-champions.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Step onto the stadium pitch in Super Kick Soccer Champions, a thrilling arcade soccer game packed with blistering strike shots, dramatic penalty saves, and world tournament action. Select your favorite national squad and guide them through qualifying stages to the championship final. Master curved free kicks, tactical passing sequences, and acrobatic bicycle kicks while reading the goalkeeper's movement. With responsive physics-driven ball trajectory, crowd chants, and tournament trophy rewards, this is the ultimate browser soccer showdown.",
    howToPlay:
      "Swipe or drag your mouse to calculate the arc and power of your shot. Curve your ball past the defensive wall into the upper corners of the net. In defensive mode, track the incoming striker's angle and tap to dive your goalkeeper for critical penalty stops. Advance through the knockout bracket to lift the championship cup.",
    controls: [
      { key: "Mouse Drag / Swipe", action: "Aim & curve kick trajectory" },
      { key: "Left Click", action: "Pass ball / Tackle opponent" },
      { key: "Spacebar", action: "Sprint boost" },
      { key: "A, D", action: "Move goalkeeper during penalty saves" },
    ],
    tips: [
      "Apply high spin to your free kicks to curve the ball around opponent defensive walls.",
      "Watch the keeper's weight shift before deciding whether to shoot near or far post.",
      "Conserve your sprint meter for counter-attack breakaways.",
    ],
    features: [
      "32 international soccer teams with distinct skill ratings and tournament brackets.",
      "Realistic ball physics including spin, dip, and crossbar rebounds.",
      "Exciting gameplay modes including World Cup, Penalty Shootout, and Free Kick Master.",
    ],
    faq: [
      {
        q: "Can I play penalty shootouts against friends?",
        a: "Yes, local 2-player turn-based shootout mode is fully supported.",
      },
      {
        q: "Are there unlockable soccer balls and stadiums?",
        a: "Winning tournament matches earns gold coins to unlock retro balls and international stadiums.",
      },
    ],
  },
  {
    slug: "neon-puzzle-block-master",
    title: "Neon Puzzle Block Master",
    category: "Puzzle",
    featured: false,
    rating: 4.9,
    plays: "172.3K",
    thumbnail: "/thumbnails/neon-puzzle-block-master.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Neon Puzzle Block Master delivers a relaxing yet intellectually captivating spatial logic puzzle experience. Arrange dynamic geometric polyomino blocks into a 10x10 glowing neon grid to form complete horizontal and vertical rows. Clearing lines detonates vibrant particle cascades, earning massive score multipliers and freeing up precious grid real estate. With no ticking countdown clocks, Neon Puzzle Block Master lets you plan several moves ahead, exercising your spatial awareness and cognitive problem-solving in a stress-free, ambient atmosphere.",
    howToPlay:
      "Drag block shapes from the bottom tray onto the 10x10 puzzle board. Complete full rows or columns to clear them and score points. Clear multiple rows simultaneously to trigger combo streaks. The game ends when there is no remaining space on the board to fit any of your three available block shapes.",
    controls: [
      { key: "Mouse Drag", action: "Pick up and place puzzle blocks" },
      { key: "R", action: "Restart puzzle grid" },
      { key: "Spacebar", action: "Rotate selected block (Special mode)" },
    ],
    tips: [
      "Always leave a 3x3 open square in your grid so you can safely place large block shapes.",
      "Clear lines systematically from the center outward to avoid leaving stranded single holes.",
      "Aim for double and triple line clears to trigger high-score multiplier combos.",
    ],
    features: [
      "Hypnotic neon aesthetics with soothing ambient sound effects and particle visuals.",
      "Endless classic puzzle mode and 100 handcrafted level challenges.",
      "Brain-stimulating spatial logic gameplay suitable for all age groups.",
    ],
    faq: [
      {
        q: "Is there a time limit per turn?",
        a: "No, classic mode has zero time limits, allowing you to contemplate every placement at your own pace.",
      },
      {
        q: "Can I undo a misplaced block?",
        a: "You earn Undo tokens by completing streak combos and daily puzzle milestones.",
      },
    ],
  },
  {
    slug: "pixel-arena-multiplayer",
    title: "Pixel Arena Multiplayer",
    category: "Multiplayer",
    featured: false,
    rating: 4.8,
    plays: "256.2K",
    thumbnail: "/thumbnails/pixel-arena-multiplayer.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Step into the colosseum of voxel combat in Pixel Arena Multiplayer. This fast-paced first-person arcade shooter pits players against one another in intense 5v5 team deathmatch and capture-the-flag skirmishes. Choose your class loadout—Sniper, Assault Commando, Heavy Demolitionist, or Stealth Ninja—and deploy into dynamic environments featuring destructible walls and elevated vantage points. Utilize tactical jump pads to launch over ramparts, lob explosive grenades into enemy bunkers, and coordinate pincer maneuvers with teammates for victory.",
    howToPlay:
      "Select your loadout before each round and join your squad. In Team Deathmatch, each elimination scores points toward the 50-kill goal. In Capture the Flag, infiltrate the enemy fortress, secure their flag, and escort your carrier safely back to base while protecting your own objective.",
    controls: [
      { key: "W, A, S, D", action: "Move soldier" },
      { key: "Mouse Aim", action: "Aim crosshair" },
      { key: "Left Click", action: "Shoot / Melee attack" },
      { key: "Right Click", action: "Aim down sights (ADS)" },
      { key: "Spacebar", action: "Jump / Bunny hop" },
      { key: "R", action: "Reload weapon" },
      { key: "1 - 3", action: "Switch weapons" },
      { key: "Tab", action: "Scoreboard" },
    ],
    tips: [
      "Keep moving while firing; strafing and bunny-hopping make you difficult to hit.",
      "Control the central superweapon spawn; rocket launchers spawn on 60-second timers.",
      "Shoot explosive red barrels when enemies take cover beside them for easy double eliminations.",
    ],
    features: [
      "5v5 Team Deathmatch, Free-For-All, and Capture-the-Flag game modes.",
      "4 balanced character classes with specialized loadouts.",
      "Destructible architecture allowing tactical flanking routes.",
    ],
    faq: [
      {
        q: "Is there cross-play support?",
        a: "Yes, players on desktop, Mac, and Chromebook browsers share the same servers.",
      },
      {
        q: "Are the weapons pay-to-win?",
        a: "Never! All weapons are 100% unlocked and balanced for fair competitive play.",
      },
    ],
  },
  {
    slug: "parkour-block-3d",
    title: "Parkour Block 3D",
    category: "Arcade",
    featured: false,
    rating: 4.7,
    plays: "185.3K",
    thumbnail: "/thumbnails/parkour-block-3d.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Parkour Block 3D delivers heart-stopping first-person platforming thrills set high above boiling lava lakes and bottomless abysses. Every floating pillar requires pinpoint spatial precision, momentum calculation, and lightning-quick reflex adjustments. Progress through 45 ascending difficulty stages featuring slippery ice platforms, bouncing slime blocks, disappearing trapdoors, and narrow corner wraps. With no checkpoints between start and exit portal, master your timing and bunny hops to conquer the course.",
    howToPlay:
      "Traverse across disjointed platform pillars to reach the exit portal without falling into the lava floor. Look toward your intended landing spot with the mouse, sprint forward for momentum, and leap at the edge of the block. On slippery ice blocks, maintain forward velocity and avoid sharp turns.",
    controls: [
      { key: "W, A, S, D", action: "Move & direct jumping angle" },
      { key: "Mouse", action: "Rotate camera & line up landings" },
      { key: "Spacebar", action: "Jump / Wall bounce" },
      { key: "Shift", action: "Sneak & grip block edges" },
      { key: "R", action: "Instant quick-restart stage" },
    ],
    tips: [
      "Always sprint jump rather than standing jump when clearing gaps wider than two blocks.",
      "Look downward slightly when jumping to verify exactly where your feet land.",
      "Don't panic on slime blocks; allow your character to bounce up to peak height before directing trajectory.",
    ],
    features: [
      "45 progressively challenging obstacle stages spanning multiple biomes.",
      "Authentic jumping mechanics with accurate friction, momentum, and air control.",
      "Built-in level timer and death counter for speedrunning community runs.",
    ],
    faq: [
      {
        q: "Does this game support keyboard shortcuts for instant restart?",
        a: "Yes, press 'R' at any time to instantly teleport back to the beginning of the stage.",
      },
      {
        q: "How many stages are there?",
        a: "There are currently 45 custom-designed stages ranging from beginner hops to expert courses.",
      },
    ],
  },
  {
    slug: "voxel-bedwars-championship",
    title: "Bedwars Sky Arena Championship",
    category: "Action",
    featured: false,
    rating: 4.9,
    plays: "210.8K",
    thumbnail: "/thumbnails/voxel-bedwars-championship.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Bedwars Sky Arena Championship is an electrifying competitive multiplayer tactical arena game where airborne floating islands serve as team bases. Squads spawn on peripheral islands with one sacred mission: protect their team bed while constructing sky bridges to obliterate opponent bases. As long as your bed remains intact, fallen warriors respawn indefinitely. Collect iron and gold to purchase enchanted armor, knockback weapons, fireballs, and obsidian defenses to dominate the arena.",
    howToPlay:
      "Gather iron and gold from your team island's forge upon spawning. Use materials at the shopkeeper to buy bridging blocks, shears, and swords. Layer protective blocks around your team bed before building bridges toward diamond and emerald islands to gain team-wide upgrades and eliminate enemy squads.",
    controls: [
      { key: "W, A, S, D", action: "Move character in 3D arena" },
      { key: "Spacebar", action: "Jump across island gaps" },
      { key: "Left Click", action: "Attack with sword / Mine blocks" },
      { key: "Right Click", action: "Place bridge blocks / Launch fireball" },
      { key: "Shift (Hold)", action: "Crouch for edge-safe bridging" },
      { key: "E", action: "Open shop & team inventory" },
    ],
    tips: [
      "Layer your bed defense with contrasting materials so enemies must switch between pickaxe and axe.",
      "Control the middle emerald generator early for game-deciding ender pearls and potions.",
      "Crouch-bridge backward while placing blocks to construct rapid sky pathways safely.",
    ],
    features: [
      "Fast-paced 4v4 and solo bed defense sky arena modes.",
      "Tiered shop upgrade system offering enchanted weapons, traps, and siege tools.",
      "Fluid sword combat, knockback physics, and projectile arc aiming.",
    ],
    faq: [
      {
        q: "What happens if our bed is destroyed?",
        a: "If your bed is destroyed, you cannot respawn after your next death. Play cautiously to survive.",
      },
      {
        q: "Can I play solo against bots or friends?",
        a: "Yes, both AI bot practice scrimmages and online matchmaking are supported.",
      },
    ],
  },
  {
    slug: "mega-city-builder-3d",
    title: "Mega City Builder 3D",
    category: "Adventure",
    featured: false,
    rating: 4.6,
    plays: "98.2K",
    thumbnail: "/thumbnails/mega-city-builder-3d.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Mega City Builder 3D is a sprawling creative urban construction simulator that puts the power of modern architecture directly into your hands. Design, engineer, and expand towering metropolises complete with glazed glass skyscrapers, bustling multi-lane highways, illuminated bridges, subway tunnels, and lush urban parks. With an infinite supply of textured materials, sculpt your dream city without resource constraints or time limits.",
    howToPlay:
      "Select blocks from your infinite creative materials palette. Left-click to place blocks into the 3D grid and right-click to demolish unwanted structures. Use the flight toggle key to ascend into the sky and easily build lofty penthouses or overhead monorail tracks.",
    controls: [
      { key: "W, A, S, D", action: "Navigate build site" },
      { key: "Spacebar / Shift", action: "Fly upward / Descend downward" },
      { key: "Left Click", action: "Place construction block" },
      { key: "Right Click", action: "Delete / Destroy block" },
      { key: "E", action: "Open materials catalog" },
      { key: "F", action: "Toggle flight camera mode" },
    ],
    tips: [
      "Lay out your roads and avenue grids first so skyscrapers have orderly spacing.",
      "Mix glass and concrete blocks on building exteriors for realistic modern architecture.",
      "Use flight mode at high altitude to ensure your skyline has a balanced silhouette.",
    ],
    features: [
      "Over 200 high-definition building materials from glass to asphalt and neon signage.",
      "Smooth 3D flight camera for seamless aerial construction of towering skyscrapers.",
      "Dynamic day-night lighting system showcasing glowing windows and night cityscapes.",
    ],
    faq: [
      {
        q: "Can I save my city designs?",
        a: "Yes! Your creations are continuously saved locally to your browser memory.",
      },
      {
        q: "Is there a height ceiling in creative mode?",
        a: "The build height limit is an expansive 256 blocks above ground level.",
      },
    ],
  },
  {
    slug: "pixel-zombie-survival",
    title: "Pixel Zombie Apocalypse",
    category: "Action",
    featured: false,
    rating: 4.8,
    plays: "164.1K",
    thumbnail: "/thumbnails/pixel-zombie-survival.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "A devastating biological containment failure has overrun a peaceful town with relentless mutant undead hordes. In Pixel Zombie Apocalypse, you are a heavily equipped tactical operative dropped into the quarantine zone. Face down waves of fast ghouls, acidic spitters, and colossal armored zombie brutes. Between rounds, scavenge police stations for high-caliber ammunition, medical kits, and defensive barricades.",
    howToPlay:
      "Establish defensible chokepoints such as staircases or narrow corridors. Aim for zombie heads to conserve ammunition and maximize critical damage. During intermissions between rounds, hurry to the mystery weapons crate to purchase upgraded firearms and repair barricades.",
    controls: [
      { key: "W, A, S, D", action: "Move soldier / Evade attacks" },
      { key: "Mouse Aim", action: "Aim weapon crosshair" },
      { key: "Left Click", action: "Fire weapon" },
      { key: "Right Click", action: "Aim down iron sights (Zoom)" },
      { key: "R", action: "Reload weapon magazine" },
      { key: "F", action: "Repair barricade / Open doors" },
      { key: "Shift", action: "Sprint" },
    ],
    tips: [
      "Always aim for the head; headshots deal 3x damage and conserve precious ammo.",
      "Repair window barricades during quiet moments between rounds for bonus credits.",
      "Never allow yourself to get cornered inside dead-end rooms.",
    ],
    features: [
      "Wave-based survival gameplay with dynamic difficulty scaling across 30 rounds.",
      "Arsenal of 18 authentic weapons including assault rifles, shotguns, and miniguns.",
      "Interactive fortress defense with repairable barricades and traps.",
    ],
    faq: [
      {
        q: "What is the best weapon for high rounds?",
        a: "The drum-fed automatic shotgun and rapid-fire laser rifle are most effective late-game.",
      },
      {
        q: "Do zombies break through wooden barricades?",
        a: "Yes, zombies will aggressively claw down wooden boards. Repair them by pressing 'F'.",
      },
    ],
  },
  {
    slug: "highway-traffic-racer-pro",
    title: "Highway Traffic Racer Pro",
    category: "Racing",
    featured: false,
    rating: 4.8,
    plays: "152.0K",
    thumbnail: "/thumbnails/highway-traffic-racer-pro.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Weave through dense multi-lane freeway traffic at breakneck speeds in Highway Traffic Racer Pro. Push your tuned sports car to its absolute limits as you perform near-miss overtakes against heavy trucks, commuter sedans, and highway patrol cruisers. Collect cash for high-speed overtakes, upgrade turbochargers, and challenge two-way traffic flow and time trial conditions across sunny, rainy, and midnight highway biomes.",
    howToPlay:
      "Steer left and right between lanes while holding down acceleration. Overtake civilian vehicles within inches to score close-call cash bonuses. In two-way traffic mode, driving in the opposite oncoming lane grants double score multiplier points. Avoid collisions at all costs.",
    controls: [
      { key: "W / Up Arrow", action: "Accelerate" },
      { key: "S / Down Arrow", action: "Brake" },
      { key: "A, D / Left, Right", action: "Steer car across lanes" },
      { key: "Spacebar", action: "Nitro boost" },
      { key: "C", action: "Change camera view" },
    ],
    tips: [
      "Driving above 100 km/h triggers close-overtake bonus multipliers.",
      "In two-way traffic mode, oncoming traffic earns double speed bonuses.",
      "Upgrade brakes early to save yourself from unexpected sudden lane-changing trucks.",
    ],
    features: [
      "Realistic cockpit and chase camera perspectives with responsive physics.",
      "4 detailed highway environments: Suburb, Desert, Snow, and City Night.",
      "10 unlockable sports cars, muscle cars, and hypercars.",
    ],
    faq: [
      {
        q: "How do I trigger nitro boost?",
        a: "Performing near-miss passes charges your nitro gauge. Press Spacebar to engage boost.",
      },
      {
        q: "Does crashing end the run?",
        a: "Yes, in One-Way and Two-Way modes a collision ends the run and tallies your prize money.",
      },
    ],
  },
  {
    slug: "sniper-elite-target-hunt",
    title: "Sniper Elite: Target Hunt",
    category: "Shooting",
    featured: false,
    rating: 4.7,
    plays: "141.6K",
    thumbnail: "/thumbnails/sniper-elite-target-hunt.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Assume the role of a top-tier covert marksman in Sniper Elite: Target Hunt. Stationed atop vantage positions in hostile territory, you must locate high-value target commanders, account for wind distance and bullet drop, and execute single-shot eliminations without alerting base guards. Upgrade high-magnification sniper scopes, suppressors, and armor-piercing ammunition across 30 thrilling contract operations.",
    howToPlay:
      "Hold right mouse click to look through your telescopic scope. Scroll mouse wheel to zoom in on targets. Identify your mission target using visual intel briefs. Hold Shift to hold your breath and steady your crosshair, then pull the trigger for the kill shot.",
    controls: [
      { key: "Right Click (Hold)", action: "Aim sniper scope" },
      { key: "Mouse Wheel", action: "Adjust scope zoom level" },
      { key: "Shift (Hold)", action: "Hold breath & steady aim" },
      { key: "Left Click", action: "Fire sniper rifle" },
      { key: "R", action: "Reload chamber" },
    ],
    tips: [
      "Always hold your breath with Shift right before firing to eliminate scope sway.",
      "Wait for moving targets to pause at doorways or vehicles before squeezing the trigger.",
      "Target explosive red canisters near enemy vehicle patrols for collateral damage.",
    ],
    features: [
      "High-magnification optical scopes with realistic breath control and sway physics.",
      "Cinematic slow-motion bullet trajectory camera on high-value elimination shots.",
      "30 covert sniper contracts spanning desert camps, docks, and snowy valleys.",
    ],
    faq: [
      {
        q: "How do I unlock thermal scopes?",
        a: "Completing contract chapter 2 unlocks night-vision and thermal imaging rifle attachments.",
      },
      {
        q: "What happens if a civilian is hit?",
        a: "Hitting non-combatant targets immediately fails the contract objective.",
      },
    ],
  },
  {
    slug: "bubble-pop-galaxy-quest",
    title: "Bubble Pop: Galaxy Quest",
    category: "Arcade",
    featured: false,
    rating: 4.8,
    plays: "179.4K",
    thumbnail: "/thumbnails/bubble-pop-galaxy-quest.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Embark on a vibrant arcade journey across the cosmos in Bubble Pop: Galaxy Quest. Aim your color cannon, bounce bubbles off side guide walls, and connect groups of 3 or more matching cosmic spheres to trigger chain-reaction pops. Clear descending bubble clusters before they cross the danger line, unleash rainbow supernova power-ups, and conquer 100 galactic levels of addictive arcade matching fun.",
    howToPlay:
      "Move your mouse to aim the trajectory guide line. Left click to fire the loaded colored bubble toward matching ceiling clusters. Match three or more bubbles of the same color to burst them. Dropping large clusters earns bonus star points to unlock galactic booster charms.",
    controls: [
      { key: "Mouse Move", action: "Aim trajectory guide line" },
      { key: "Left Click", action: "Launch bubble" },
      { key: "Right Click / Spacebar", action: "Swap current and standby bubble" },
    ],
    tips: [
      "Bounce bubbles off the side walls to reach tricky clusters tucked behind obstacles.",
      "Swap your current bubble with the standby bubble if the standby matches a nearby cluster.",
      "Dislodge the anchor bubbles at the top of a formation to cause all lower bubbles to fall.",
    ],
    features: [
      "100 progressively designed arcade levels with moving obstacles and black holes.",
      "Vibrant cosmic graphics with explosive fireworks and particle celebration effects.",
      "Relaxing arcade gameplay with smooth mouse and touch control.",
    ],
    faq: [
      {
        q: "Can I play this game on mobile?",
        a: "Yes! Responsive touch aiming and tapping are natively supported on mobile browsers.",
      },
      {
        q: "What does the Rainbow Bubble do?",
        a: "The Rainbow Bubble matches with any bubble color it touches, popping that entire connected cluster.",
      },
    ],
  },
  {
    slug: "dunk-hoops-basketball-3d",
    title: "Dunk Hoops: Basketball 3D",
    category: "Sports",
    featured: false,
    rating: 4.7,
    plays: "138.9K",
    thumbnail: "/thumbnails/dunk-hoops-basketball-3d.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Step onto the street court in Dunk Hoops: Basketball 3D. Test your shooting touch in fast-paced 3-point shootouts, slam dunk contests, and 1v1 arcade pickup matches. Time your release meter at the sweet spot to sink nothing-but-net swishes, charge your Fireball streak meter, and showcase thunderous rim-rocking dunks over opposing defenders.",
    howToPlay:
      "Press and hold the mouse button or spacebar to wind up your shooting jump. Release the button right as the shot meter hits the green zone for a perfect basket. In dunk contest mode, execute timed key taps mid-air to pull off windmills, 360s, and tomahawk slams.",
    controls: [
      { key: "Mouse Click (Hold & Release)", action: "Time jump shot release" },
      { key: "W, A, S, D", action: "Dribble & move on court (1v1 mode)" },
      { key: "Spacebar", action: "Jump / Dunk / Block shot" },
    ],
    tips: [
      "Releasing in the green sweet spot gives a 100% swish probability.",
      "Sinking three consecutive baskets lights the ball on fire, doubling your score.",
      "Pump fake by tapping quickly to throw defensive blockers off balance.",
    ],
    features: [
      "Realistic rim and backboard physics with responsive bounce simulations.",
      "Arcade game modes: 3-Point Contest, Slam Dunk Exhibition, and 1v1 Streetball.",
      "Multiple unlockable street courts from Venice Beach to Brooklyn Rooftops.",
    ],
    faq: [
      {
        q: "How do I trigger special slam dunks?",
        a: "Sprint toward the paint and hold Spacebar while inside the key to launch a highlight dunk.",
      },
      {
        q: "Can I customize my player?",
        a: "Yes, you can customize jerseys, sneakers, and basketball designs in the locker room.",
      },
    ],
  },
  {
    slug: "temple-quest-tomb-runner",
    title: "Temple Quest: Tomb Runner",
    category: "Adventure",
    featured: false,
    rating: 4.8,
    plays: "198.5K",
    thumbnail: "/thumbnails/temple-quest-tomb-runner.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Sprint, slide, and leap through ancient ruins in Temple Quest: Tomb Runner. Escaping a collapsed subterranean vault with a legendary golden idol, you must navigate crumbling stone bridges, jump over spike pits, dodge swinging pendulum blades, and slide under low rock overhangs. Collect golden relics, activate invincibility shields, and push your reflexes to the limit in this non-stop 3D adventure runner.",
    howToPlay:
      "Steer left and right between lanes while your adventurer sprints forward automatically. Swipe up or press Up arrow to leap over obstacles, and swipe down to slide beneath traps. Turn corners by pressing Left or Right when approaching cliff edges.",
    controls: [
      { key: "Up Arrow / W", action: "Jump over obstacles" },
      { key: "Down Arrow / S", action: "Slide under barriers" },
      { key: "Left Arrow / A", action: "Steer left / Turn corner" },
      { key: "Right Arrow / D", action: "Steer right / Turn corner" },
      { key: "Spacebar", action: "Activate collected power-up" },
    ],
    tips: [
      "Look ahead at obstacle patterns rather than focusing right in front of your character.",
      "Upgrade coin magnet duration first in the shop to vacuum up relics without moving.",
      "You can jump mid-turn to clear obstacles situated right on sharp corners.",
    ],
    features: [
      "Fast-paced endless runner gameplay with responsive arcade keyboard and swipe controls.",
      "Dynamic procedural temple environments with jungle, volcano, and tomb sectors.",
      "Dozens of unlockable adventurer skins, power-up boosts, and global leaderboards.",
    ],
    faq: [
      {
        q: "What happens when you fall?",
        a: "Falling ends the run, but you can use an Ankh resurrection token to continue your streak.",
      },
      {
        q: "Does game speed increase over time?",
        a: "Yes, your sprinting speed increases incrementally the farther you survive down the temple path.",
      },
    ],
  },
  {
    slug: "galaxy-conquest-io",
    title: "Galaxy Conquest .io",
    category: "Multiplayer",
    featured: false,
    rating: 4.8,
    plays: "167.3K",
    thumbnail: "/thumbnails/galaxy-conquest-io.svg",
    // REPLACE THIS EMBED URL WITH YOUR GAMEMONETIZE / GAMEDISTRIBUTION IFRAME LINK
    iframeUrl: "PASTE_GAMEMONETIZE_EMBED_URL_HERE",
    description:
      "Deploy your fleet and dominate the cosmos in Galaxy Conquest .io. Start with a single remote planet colony and send starships to capture neutral planetary orbits. Mine cosmic crystals, upgrade planet defenses, and outmaneuver real-time human players across an expansive galactic sector map. Form alliances, launch synchronized fleet invasions, and paint the entire galaxy in your empire's colors.",
    howToPlay:
      "Click and drag from your planet to an adjacent target planet to send half your fleet. Captured planets generate starships over time. Upgrade your primary planets to build dreadnoughts and planetary defense shields. Eliminate all opponent fleets to conquer the sector.",
    controls: [
      { key: "Left Click & Drag", action: "Send fleet between planets" },
      { key: "Double Click", action: "Select all planets owned by you" },
      { key: "Right Click", action: "Cancel fleet maneuver" },
      { key: "Mouse Wheel", action: "Zoom galaxy map" },
    ],
    tips: [
      "Capture small neutral planets early to rapidly boost your collective ship generation rate.",
      "Don't leave your core planets with zero garrison ships; opponents will seize undefended worlds.",
      "Launch multi-planet coordinated attacks against strong opponent fortress planets.",
    ],
    features: [
      "Real-time multiplayer strategic fleet battles with instant matchmaking.",
      "Dynamic planetary economies with fleet production and defensive shields.",
      "Intuitive drag-and-drop fleet controls playable on any browser.",
    ],
    faq: [
      {
        q: "How many players are in each match?",
        a: "Each galaxy sector match hosts 4 to 8 players competing for planetary dominance.",
      },
      {
        q: "Can I play against AI bots offline?",
        a: "Yes, offline skirmish mode with customizable bot difficulty is fully available.",
      },
    ],
  },
];

export function getAllGames() {
  return games;
}

export function getFeaturedGames() {
  return games.filter((game) => game.featured);
}

export function getGameBySlug(slug) {
  return games.find((game) => game.slug.toLowerCase() === slug.toLowerCase());
}

export function getGamesByCategory(category) {
  return games.filter(
    (game) => game.category.toLowerCase() === category.toLowerCase()
  );
}

export function getRelatedGames(currentSlug, category, limit = 4) {
  const sameCategory = games.filter(
    (g) => g.category.toLowerCase() === category.toLowerCase() && g.slug !== currentSlug
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  const otherGames = games.filter(
    (g) => g.category.toLowerCase() !== category.toLowerCase() && g.slug !== currentSlug
  );
  return [...sameCategory, ...otherGames].slice(0, limit);
}
