// Bouwt één lijst met moskeeën in Nederland, België en Duitsland uit OpenStreetMap
// en bewaart die als data/mosques.json. De app leest dat bestand, zodat zoeken snel en betrouwbaar is.

import { writeFile, mkdir } from 'node:fs/promises';

const SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];
const COUNTRIES = ['NL', 'BE', 'DE'];

async function ask(query) {
  let last = null;
  for (let round = 0; round < 2; round += 1) {
    for (const server of SERVERS) {
      try {
        const response = await fetch(server, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Gebedstijden/1.0 (github.com/ckr015/gebedstijden)',
          },
          body: 'data=' + encodeURIComponent(query),
          signal: AbortSignal.timeout(240000),
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const json = await response.json();
        if (!Array.isArray(json.elements)) throw new Error('geen lijst');
        return json.elements;
      } catch (error) {
        last = error;
        console.log(`${server}: ${error.message}`);
      }
    }
  }
  throw last;
}

async function main() {
  const list = [];
  const seen = new Set();
  for (const code of COUNTRIES) {
    const query = `[out:json][timeout:200];area["ISO3166-1"="${code}"]["admin_level"="2"]->.a;`
      + `nwr(area.a)["amenity"="place_of_worship"]["religion"="muslim"];out center;`;
    const elements = await ask(query);
    let count = 0;
    for (const e of elements) {
      const lat = typeof e.lat === 'number' ? e.lat : e.center && e.center.lat;
      const lng = typeof e.lon === 'number' ? e.lon : e.center && e.center.lon;
      if (typeof lat !== 'number' || typeof lng !== 'number') continue;
      const name = String((e.tags && e.tags.name) || '').slice(0, 60);
      const key = name + '|' + lat.toFixed(3) + '|' + lng.toFixed(3);
      if (seen.has(key)) continue;
      seen.add(key);
      list.push([name, Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
      count += 1;
    }
    console.log(`${code}: ${count} moskeeën`);
    if (count < 50) throw new Error(`Te weinig resultaten voor ${code}; lijst niet bijgewerkt.`);
  }
  await mkdir('data', { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  await writeFile('data/mosques.json', JSON.stringify({ updated: today, source: 'OpenStreetMap', countries: COUNTRIES, list }) + '\n');
  console.log(`Totaal: ${list.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
