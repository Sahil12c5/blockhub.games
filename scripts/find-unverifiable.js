const fs = require('fs');
const path = require('path');

function searchInDir(dir, patterns) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name === 'node_modules' || f.name === '.next' || f.name === '.git' || f.name === 'out') continue;
      searchInDir(full, patterns);
    } else if (/\.(js|jsx|ts|tsx|md|json)$/.test(f.name)) {
      const content = fs.readFileSync(full, 'utf8');
      for (const p of patterns) {
        if (content.includes(p)) {
          console.log(`Found "${p}" in ${full}`);
        }
      }
    }
  }
}

searchInDir('.', ['Verified & Ready', '1080p', '60 FPS']);
