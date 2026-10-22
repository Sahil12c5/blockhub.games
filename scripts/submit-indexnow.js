const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = '0ac409287eac4b93803799e34fc39b43';
const HOST = 'blockhub.games';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;

// Gather all canonical indexable URLs for the site
function getAllLiveUrls() {
  const urls = [
    `https://${HOST}/`,
    `https://${HOST}/about`,
    `https://${HOST}/contact`,
    `https://${HOST}/dmca`,
    `https://${HOST}/privacy-policy`,
    `https://${HOST}/terms`
  ];

  // 1. Categories
  const categoriesPath = path.join(__dirname, '../data/categories.js');
  if (fs.existsSync(categoriesPath)) {
    const content = fs.readFileSync(categoriesPath, 'utf8');
    const slugMatches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];
    const catSlugs = new Set(slugMatches.map(m => m[1]));
    for (const slug of catSlugs) {
      urls.push(`https://${HOST}/category/${slug}`);
    }
  }

  // 2. Hubs
  const hubsPath = path.join(__dirname, '../data/hubs.js');
  if (fs.existsSync(hubsPath)) {
    const content = fs.readFileSync(hubsPath, 'utf8');
    const slugMatches = [...content.matchAll(/slug:\s*["']([^"']+)["']/g)];
    const hubSlugs = new Set(slugMatches.map(m => m[1]));
    for (const slug of hubSlugs) {
      urls.push(`https://${HOST}/tag/${slug}`);
    }
  }

  // 3. Live 400 Games
  const gamesPath = path.join(__dirname, '../data/games.js');
  if (fs.existsSync(gamesPath)) {
    const content = fs.readFileSync(gamesPath, 'utf8');
    const slugMatches = [...content.matchAll(/"slug":\s*"([^"]+)"/g)];
    const gameSlugs = new Set(slugMatches.map(m => m[1]));
    for (const slug of gameSlugs) {
      urls.push(`https://${HOST}/game/${slug}`);
    }
  }

  return Array.from(new Set(urls));
}

function submitToIndexNow(urlList) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log(`Submitting ${urlList.length} URLs to IndexNow (Bing / Yandex)...`);

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✓ Success! HTTP ${res.statusCode}: URLs successfully received by IndexNow.`);
          resolve({ status: res.statusCode, body: data });
        } else {
          console.warn(`! HTTP ${res.statusCode}: ${data || res.statusMessage}`);
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => {
      console.error('Request failed:', err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  const args = process.argv.slice(2);
  let urls = [];

  if (args.length > 0 && !args.includes('--all')) {
    urls = args.map(u => u.startsWith('http') ? u : `https://${HOST}/game/${u}`);
  } else {
    urls = getAllLiveUrls();
  }

  console.log(`Found ${urls.length} indexable URLs for BlockHub.games`);
  console.log(`Verification key location: ${KEY_LOCATION}`);

  try {
    const result = await submitToIndexNow(urls);
    console.log('IndexNow submission finished with status:', result.status);
  } catch (err) {
    console.error('Error submitting to IndexNow:', err);
    process.exit(1);
  }
}

run();
