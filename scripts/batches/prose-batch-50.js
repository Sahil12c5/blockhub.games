/**
 * PROSE BATCH 50 - COMBINED & ENRICHED (GAMES 1 TO 50)
 */

const { batchPart1 } = require('./batch-50-part1.js');
const { batchPart2 } = require('./batch-50-part2.js');

const rawBatch50 = [...batchPart1, ...batchPart2];

module.exports = {
  rawBatch50,
};
