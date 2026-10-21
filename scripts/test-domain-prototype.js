// Prototype to test clean domain sentence generation with 0 cross-genre runs
const { get6WordRuns } = require('./lib/build-all-builders');

function buildCleanShooting() {
  const p1S1_subjects = [
    "Sighting through tactical reflex optics", "Peeking around concrete barricade corners", "Holding defensive choke angles with assault rifles",
    "Sweeping across contested industrial hallways", "Tracking hostile infantry movement signatures", "Advancing along low-exposure trench corridors",
    "Surveying distant elevated sniper towers", "Engaging approaching enemy squads with burst fire", "Isolating heavily armed targets methodically",
    "Holding fortified high-ground observation perches", "Coordinating room clearance breach sequences", "Managing weapon heat during prolonged skirmishes",
    "Securing contested tactical landing zones", "Engaging moving targets with calculated lead", "Holding defensive perimeter lines against charges",
    "Advancing through smoke-obscured urban ruins", "Scanning perimeter fence lines for infiltrators", "Rotating between protective sandbag barricades",
    "Suppressing entrenched machine gun emplacements", "Targeting enemy assault commanders first", "Calibrating optical scope windage and elevation",
    "Defending strategic radar communication hubs", "Coordinating interlocking fields of fire", "Holding narrow subterranean access tunnels",
    "Engaging armored vehicle gunners from cover", "Methodical corner checking in hostile territory", "Securing vulnerable squad evacuation points",
    "Scanning rooftop perimeters for concealed sharpshooters", "Maintaining disciplined tactical squad spacing", "Neutralizing aggressive enemy strike elements",
    "Holding fortified bunker doors against breaches", "Tracking hostile patrol rotations across courtyards", "Advancing behind tactical ballistic shields",
    "Securing munitions depots from enemy sabotage", "Engaging airborne hostile drones with precision", "Holding primary intersection crossroads under fire",
    "Surveying dark warehouse interiors with flashlights", "Coordinating tactical bounding overwatch maneuvers", "Neutralizing perimeter sentries with suppressed fire",
    "Defending forward operating bases against waves", "Scanning distant hillside ridgelines for glint", "Holding fortified trench lines with heavy guns",
    "Advancing through dense jungle combat sectors", "Securing tactical bridge crossings against armor", "Engaging hostile assault boat crews from shore",
    "Methodical sweeping through ruined office complexes", "Holding defensive positions during mortar barrages", "Tracking enemy reinforcement convoys through binoculars",
    "Securing elevated missile silos from hostiles", "Neutralizing fortified sniper nests with heavy fire"
  ];
  const p1S1_actions = [
    "minimizes exposure to hostile sniper fire across open plazas",
    "ensures clean target acquisition before hostile sentries react",
    "prevents defensive perimeters from collapsing under sudden assault waves",
    "clears contested sectors systematically without walking into crossfires",
    "allows marksmen to anticipate enemy flanking routes with precision",
    "protects assault squads from elevated enemy machine gun nests",
    "reveals concealed sharpshooters before they establish firing sightlines",
    "maintains continuous stopping power while conserving vital ammunition",
    "neutralizes high-threat combat specialists before squads reposition",
    "delivers commanding operational sightlines over entire hostile valleys",
    "clears fortified compound rooms with lethal speed and poise",
    "prevents barrel overheating during intense defensive firefights",
    "guarantees safe extraction for wounded operators under fire",
    "ensures high ballistic hit probability on opening volleys",
    "keeps defensive barricades impenetrable against aggressive rushes",
    "denies hostiles the element of surprise in dense fog",
    "detects stealthy reconnaissance patrols before they plant explosives",
    "disrupts adversary targeting and prevents operators from being pinned",
    "eliminates heavy enemy weapon emplacements with minimal friendly casualties",
    "breaks enemy squad morale and shatters offensive coordination",
    "guarantees surgical first-round impacts at extreme combat ranges",
    "preserves vital satellite links during chaotic base assaults",
    "creates lethal kill zones that halt infantry advances immediately",
    "forces enemy boarding parties into narrow, defenseless corridors",
    "removes heavy vehicular threats before infantry defenses crumble",
    "eliminates ambush risks when entering unfamiliar battleground sectors",
    "ensures helicopters touch down safely amid hostile ground fire",
    "neutralizes elevated sniper threats before assault teams advance",
    "prevents multi-operator casualties from incoming explosive ordnance",
    "maintains decisive battlefield momentum during counter-offensive pushes",
    "prevents enemy breach teams from storming command centers",
    "reveals vulnerable gaps in enemy defensive line rotations",
    "provides impenetrable mobile cover across exposed open ground",
    "safeguards vital armory reserves needed for prolonged sieges",
    "eliminates airborne reconnaissance threats before positions are exposed",
    "denies rival mechanized units access to primary transit routes",
    "reveals lurking hostile ambushes in low-visibility combat zones",
    "allows teams to advance steadily while maintaining continuous cover fire",
    "preserves operational stealth during high-stakes covert insertions",
    "repels relentless assault waves until friendly air support arrives",
    "identifies concealed enemy observation posts across vast terrain",
    "anchors frontline defenses against overwhelming mechanized infantry assaults",
    "prevents sudden ambush attacks in dense, foliage-rich warzones",
    "halts advancing enemy armor columns at critical chokepoints",
    "protects coastal defense installations from amphibious beach assaults",
    "clears multi-story vertical battlegrounds with methodical efficiency",
    "preserves squad combat readiness during sustained artillery strikes",
    "provides early tactical warning of incoming enemy reinforcements",
    "prevents catastrophic enemy sabotage of critical defense installations",
    "dismantles fortified hostile redoubts with decisive ballistic superiority"
  ];

  const sents = [];
  for (let i = 0; i < 50; i++) {
    sents.push(`${p1S1_subjects[i]} ${p1S1_actions[i]}.`);
  }
  return sents;
}

const cleanS = buildCleanShooting();
console.log('Clean shooting S1 count:', cleanS.length);

const { buildDriving } = require('./lib/builders/driving-builder');
const d = buildDriving();
const dRuns = new Set();
[...d.p1, ...d.p2].forEach(t => get6WordRuns(t).forEach(r => dRuns.add(r)));

let shared = 0;
cleanS.forEach(t => get6WordRuns(t).forEach(r => { if (dRuns.has(r)) shared++; }));
console.log('Shared 6-word runs between driving and clean shooting S1:', shared);
