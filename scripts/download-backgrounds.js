import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images');

const BACKGROUNDS = [
  {
    file: 'ocean.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Ocean.jpg/1280px-Ocean.jpg',
  },
  {
    file: 'australia_bush.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Blue_Mountains_National_Park%2C_New_South_Wales.jpg/1280px-Blue_Mountains_National_Park%2C_New_South_Wales.jpg',
  },
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'FoodChainApp/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

fs.mkdirSync(OUT_DIR, { recursive: true });

(async () => {
  for (const { file, url } of BACKGROUNDS) {
    try {
      const data = await download(url);
      fs.writeFileSync(path.join(OUT_DIR, file), data);
      console.log(`Downloaded ${file}`);
    } catch (err) {
      console.error(`Failed ${file}:`, err.message);
    }
  }
})();
