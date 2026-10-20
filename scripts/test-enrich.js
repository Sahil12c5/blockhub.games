const fs = require('fs');
const path = require('path');

// Let's inspect the 5 specific issues and add ~15-25 words to each game to ensure strictly 182-215 words
const { batchPart1 } = require('./batches/batch-50-part1.js');
const { batchPart2 } = require('./batches/batch-50-part2.js');

console.log('Part 1 count:', batchPart1.length, 'Part 2 count:', batchPart2.length);
