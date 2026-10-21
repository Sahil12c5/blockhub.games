// 24 Openers for Paragraph 1 (every opener embeds title in first 1-5 words)
const P1_OPENERS = [
  (t, goal, set) => `In ${t}, players take direct command to ${goal} across ${set}.`,
  (t, goal, set) => `Featuring responsive browser mechanics, ${t} challenges you to ${goal} within ${set}.`,
  (t, goal, set) => `Designed around active gameplay, ${t} immerses players in ${set} where they must ${goal}.`,
  (t, goal, set) => `Set within ${set}, ${t} tasks players with the central mission to ${goal}.`,
  (t, goal, set) => `Centered on ${goal}, ${t} delivers an engaging experience guiding the action through ${set}.`,
  (t, goal, set) => `Navigating through ${set}, ${t} requires steady focus and quick reflexes to ${goal}.`,
  (t, goal, set) => `From the start of ${t}, your objective is to ${goal} throughout ${set}.`,
  (t, goal, set) => `Stepping into ${t}, you are thrust into ${set} where strategic decisions help you ${goal}.`,
  (t, goal, set) => `Offering distinct challenge layouts, ${t} revolves around core mechanics and the drive to ${goal}.`,
  (t, goal, set) => `Guiding your path through ${set}, ${t} demands sharp attention and calm timing to ${goal}.`,
  (t, goal, set) => `Every attempt in ${t} tests your ability to ${goal} while adapting to ${set}.`,
  (t, goal, set) => `Developed with accessible depth, ${t} invites players to ${goal} within ${set}.`,
  (t, goal, set) => `Entering the world of ${t}, you work diligently to ${goal} across varied encounters in ${set}.`,
  (t, goal, set) => `With its emphasis on situational awareness, ${t} challenges players to ${goal} in ${set}.`,
  (t, goal, set) => `Exploring the demanding terrain of ${t}, contenders must overcome active hazards to ${goal}.`,
  (t, goal, set) => `Crafted for engaging action, ${t} puts your instincts to the test as you strive to ${goal}.`,
  (t, goal, set) => `Across the diverse stages of ${t}, the central challenge is to ${goal} in ${set}.`,
  (t, goal, set) => `Built around intuitive mechanics, ${t} empowers you to ${goal} throughout ${set}.`,
  (t, goal, set) => `Balancing patience with decisive action, ${t} tests your poise to ${goal} in ${set}.`,
  (t, goal, set) => `Taking place in ${set}, ${t} provides an active and demanding arena to ${goal}.`,
  (t, goal, set) => `Anchored by responsive controls, ${t} places you in ${set} to successfully ${goal}.`,
  (t, goal, set) => `Combining precision and foresight, ${t} invites players to ${goal} across ${set}.`,
  (t, goal, set) => `At the heart of ${t} is the ongoing drive to ${goal} within ${set}.`,
  (t, goal, set) => `Challenging players to ${goal}, ${t} delivers a rewarding session throughout ${set}.`
];

// 24 Openers for Paragraph 2 (every opener embeds title in first 1-4 words)
const P2_OPENERS = [
  (t, ctrl, act, haz) => `In ${t}, mastering the controls is essential, utilizing ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Tactical execution throughout ${t} relies on responsive inputs, using ${ctrl} for ${act}.`,
  (t, ctrl, act, haz) => `Responsive handling defines ${t}, where ${ctrl} governs every attempt to ${act}.`,
  (t, ctrl, act, haz) => `Success in ${t} requires disciplined timing when using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Navigating upcoming hazards in ${t} demands quick adjustments via ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Careful coordination in ${t} allows players to effectively deploy ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Momentum across ${t} depends on intuitive inputs, where ${ctrl} dictates your ability to ${act}.`,
  (t, ctrl, act, haz) => `Overcoming obstacles in ${t} hinges on precise inputs, using ${ctrl} to manage ${haz}.`,
  (t, ctrl, act, haz) => `Advancing through ${t} introduces rising difficulty, requiring steady command of ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Clear visual cues in ${t} give you time to respond with ${ctrl} as you ${act}.`,
  (t, ctrl, act, haz) => `Maintaining consistency throughout ${t} depends on mastering ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Sharpening your execution in ${t} via ${ctrl} makes the difference when confronting ${haz}.`,
  (t, ctrl, act, haz) => `Adaptive reflexes in ${t} are vital, guided directly by ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Fine-tuning your timing in ${t} through ${ctrl} prevents costly errors against ${haz}.`,
  (t, ctrl, act, haz) => `Patience across ${t} proves decisive, especially when operating ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Smooth execution in ${t} ensures steady control as ${haz} tests your precision.`,
  (t, ctrl, act, haz) => `Reading the environment in ${t} allows you to deploy ${ctrl} with greater efficiency to ${act}.`,
  (t, ctrl, act, haz) => `Handling each section of ${t} requires focused awareness, utilizing ${ctrl} to overcome ${haz}.`,
  (t, ctrl, act, haz) => `Rhythmic inputs in ${t} via ${ctrl} help preserve positioning when navigating ${haz}.`,
  (t, ctrl, act, haz) => `Learning the distinct physics of ${t} enables smoother manipulation of ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Split-second decisions in ${t} rely on familiarizing yourself with ${ctrl} to handle ${haz}.`,
  (t, ctrl, act, haz) => `Steering clear of mistakes in ${t} demands disciplined use of ${ctrl} as you ${act}.`,
  (t, ctrl, act, haz) => `Consistent performance in ${t} rewards players who methodically practice using ${ctrl} to ${act}.`,
  (t, ctrl, act, haz) => `Balancing speed and caution in ${t} through ${ctrl} creates the safest path to ${act}.`
];

module.exports = {
  P1_OPENERS,
  P2_OPENERS
};
