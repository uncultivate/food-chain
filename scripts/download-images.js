import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'organisms');

const IMAGES = [
  { id: 'plankton', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Plankton.jpg/220px-Plankton.jpg' },
  { id: 'seaweed', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Seagrass_at_Kadmat_Island.jpg/220px-Seagrass_at_Kadmat_Island.jpg' },
  { id: 'jellyfish', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Jelly_cc11.jpg/220px-Jelly_cc11.jpg' },
  { id: 'fish', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Georgia_Aquarium_-_Giant_Grouper.jpg/220px-Georgia_Aquarium_-_Giant_Grouper.jpg' },
  { id: 'shellfish', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mussels_at_Carnac.jpg/220px-Mussels_at_Carnac.jpg' },
  { id: 'octopus', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Octopus2.jpg/220px-Octopus2.jpg' },
  { id: 'dolphin', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/220px-Tursiops_truncatus_01.jpg' },
  { id: 'turtle', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Green_turtle_swimming_in_blue_water.jpg/220px-Green_turtle_swimming_in_blue_water.jpg' },
  { id: 'shark', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Great_white_shark_south_africa.jpg/220px-Great_white_shark_south_africa.jpg' },
  { id: 'acacia', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Acacia_cyanophylla.jpg/220px-Acacia_cyanophylla.jpg' },
  { id: 'grasses', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Grass_dsc08672-nevit.jpg/220px-Grass_dsc08672-nevit.jpg' },
  { id: 'insects', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Insect_collage.jpg/220px-Insect_collage.jpg' },
  { id: 'bilby', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Greater_bilby.jpg/220px-Greater_bilby.jpg' },
  { id: 'kangaroo', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Kangaroo_Australia_01_11_2008_-_retouch.jpg/220px-Kangaroo_Australia_01_11_2008_-_retouch.jpg' },
  { id: 'snake', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Python_regius_1.jpg/220px-Python_regius_1.jpg' },
  { id: 'eagle', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Aquila_audax_-_Mount_Annan_Botanic_Garden.jpg/220px-Aquila_audax_-_Mount_Annan_Botanic_Garden.jpg' },
  { id: 'dingo', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Australian_Dingo.jpg/220px-Australian_Dingo.jpg' },
  { id: 'cane_toads', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Bufo_marinus_from_Australia.JPG/220px-Bufo_marinus_from_Australia.JPG' },
  { id: 'feral_cats', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/220px-Cat03.jpg' },
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
  for (const { id, url } of IMAGES) {
    try {
      const data = await download(url);
      fs.writeFileSync(path.join(OUT_DIR, `${id}.jpg`), data);
      console.log(`Downloaded ${id}.jpg`);
    } catch (err) {
      console.error(`Failed ${id}:`, err.message);
    }
  }
})();
