// Haalt de officiële gebedstijden op bij Diyanet (awqatsalah.diyanet.gov.tr) en bewaart ze
// als kleine bestanden in data/diyanet/. De app en de webversie lezen die bestanden.
// Inloggegevens komen uit DIYANET_EMAIL en DIYANET_PASSWORD (GitHub Secrets), nooit uit de code.

import { readFile, writeFile, mkdir } from 'node:fs/promises';

const BASE = 'https://awqatsalah.diyanet.gov.tr';
const OUT = 'data/diyanet';
const MAX_REQUESTS = 90;       // ruim onder de daglimiet van Diyanet
const MAX_DISCOVERY = 45;      // hooguit zoveel verzoeken per keer om plaatsen op te zoeken

// Onze steden: naam, land, en andere schrijfwijzen die Diyanet kan gebruiken.
const CITIES = [
  ...['Alkmaar', 'Almelo', 'Almere', 'Alphen aan den Rijn', 'Amersfoort', 'Amstelveen', 'Amsterdam', 'Apeldoorn',
    'Arnhem', 'Assen', 'Bergen op Zoom', 'Breda', 'Delft', 'Den Helder', 'Deventer', 'Diemen', 'Dordrecht', 'Ede',
    'Eindhoven', 'Emmen', 'Enschede', 'Gouda', 'Groningen', 'Haarlem', 'Heerlen', 'Helmond', 'Hengelo', 'Hilversum',
    'Hoofddorp', 'Hoorn', 'Leeuwarden', 'Leiden', 'Lelystad', 'Maastricht', 'Middelburg', 'Nijmegen', 'Oss',
    'Purmerend', 'Roermond', 'Rotterdam', 'Schiedam', 'Sittard', 'Tiel', 'Tilburg', 'Utrecht', 'Veenendaal', 'Venlo',
    'Vlaardingen', 'Waalwijk', 'Zaandam', 'Zoetermeer', 'Zwolle'].map((name) => ({ name, country: 'nl' })),
  { name: 'Den Bosch', country: 'nl', also: ['S-HERTOGENBOSCH', 'SHERTOGENBOSCH', 'HERTOGENBOSCH'] },
  { name: 'Den Haag', country: 'nl', also: ['S-GRAVENHAGE', 'SGRAVENHAGE', 'THE HAGUE', 'LAHEY'] },
  { name: 'Antwerpen', country: 'be', also: ['ANVERS', 'ANTWERP'] },
  { name: 'Brussel', country: 'be', also: ['BRUKSEL', 'BRUXELLES', 'BRUSSELS'] },
  { name: 'Genk', country: 'be' },
  { name: 'Gent', country: 'be', also: ['GAND', 'GHENT'] },
  { name: 'Berlijn', country: 'de', also: ['BERLIN'] },
  { name: 'Duisburg', country: 'de' },
  { name: 'Keulen', country: 'de', also: ['KOLN', 'KOELN', 'COLOGNE'] },
  { name: 'Ankara', country: 'tr' },
  { name: 'İstanbul', country: 'tr' },
  { name: 'İzmir', country: 'tr' },
  { name: 'Kayseri', country: 'tr' },
  { name: 'Konya', country: 'tr' },
];

const COUNTRY_NAMES = {
  nl: ['HOLLANDA', 'NETHERLANDS', 'NEDERLAND'],
  be: ['BELCIKA', 'BELGIUM', 'BELGIE'],
  de: ['ALMANYA', 'GERMANY', 'DEUTSCHLAND'],
  tr: ['TURKIYE', 'TURKEY'],
};

/** Hoofdletters zonder accenten, zodat "İstanbul" en "ISTANBUL" gelijk zijn. */
function plain(text) {
  return String(text || '')
    .replace(/İ/g, 'I').replace(/ı/g, 'i')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

function slug(name) {
  return plain(name).toLowerCase().replace(/ /g, '-');
}

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(path, value) {
  await writeFile(path, JSON.stringify(value, null, 1) + '\n');
}

let requests = 0;
let token = '';

async function call(path, options = {}) {
  if (requests >= MAX_REQUESTS) throw new Error('budget');
  requests += 1;
  const response = await fetch(BASE + path, {
    ...options,
    headers: { Accept: 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(options.headers || {}) },
  });
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = null;
  }
  if (!response.ok) {
    throw new Error(`${path}: HTTP ${response.status} ${text.slice(0, 200)}`);
  }
  return body && body.data !== undefined ? body.data : body;
}

async function login(email, password) {
  let lastError = null;
  for (const path of ['/Auth/Login', '/api/Auth/Login']) {
    try {
      const data = await call(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (data && data.accessToken) {
        token = data.accessToken;
        return;
      }
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Inloggen bij Diyanet is niet gelukt.');
}

/** Zoekt stap voor stap de plaatsnummers van Diyanet op en onthoudt wat al bekend is. */
async function discover(places) {
  const start = requests;
  const room = () => requests - start < MAX_DISCOVERY;

  if (!places.countries) {
    places.countries = await call('/api/Place/Countries');
  }
  places.states = places.states || {};
  places.cities = places.cities || {};

  for (const [code, names] of Object.entries(COUNTRY_NAMES)) {
    const country = (places.countries || []).find((c) => names.includes(plain(c.name)));
    if (!country) continue;
    if (!places.states[code] && room()) {
      places.states[code] = await call('/api/Place/States/' + country.id);
    }
    let states = places.states[code] || [];
    if (code === 'tr') {
      // Turkije heeft 81 provincies; alleen die van onze steden zijn nodig.
      const wanted = CITIES.filter((c) => c.country === 'tr').map((c) => plain(c.name));
      states = states.filter((s) => wanted.includes(plain(s.name)));
    }
    for (const state of states) {
      const key = code + ':' + state.id;
      if (!places.cities[key] && room()) {
        places.cities[key] = await call('/api/Place/Cities/' + state.id);
      }
    }
  }
}

/** Koppelt onze steden aan de plaatsnummers van Diyanet. */
function match(places, manual) {
  const found = {};
  const missing = [];
  for (const city of CITIES) {
    if (manual[city.name]) {
      found[city.name] = manual[city.name];
      continue;
    }
    const names = [plain(city.name), ...(city.also || []).map(plain)];
    let hit = null;
    for (const [key, list] of Object.entries(places.cities || {})) {
      if (!key.startsWith(city.country + ':')) continue;
      hit = (list || []).find((p) => names.includes(plain(p.name)));
      if (hit) break;
    }
    if (hit) {
      found[city.name] = hit.id;
    } else {
      missing.push(city.name);
    }
  }
  return { found, missing };
}

function clock(value) {
  const m = /(\d{1,2}):(\d{2})/.exec(String(value || ''));
  return m ? m[1].padStart(2, '0') + ':' + m[2] : '';
}

/** Datum van een Diyanet-rij als "2026-11-13". */
function dayKey(row) {
  const iso = /^(\d{4}-\d{2}-\d{2})/.exec(String(row.gregorianDateLongIso8601 || ''));
  if (iso) return iso[1];
  const short = /(\d{2})\.(\d{2})\.(\d{4})/.exec(String(row.gregorianDateShort || row.gregorianDateShortIso8601 || ''));
  return short ? `${short[3]}-${short[2]}-${short[1]}` : '';
}

async function main() {
  const email = process.env.DIYANET_EMAIL;
  const password = process.env.DIYANET_PASSWORD;
  if (!email || !password) {
    console.log('Nog geen Diyanet-gegevens ingesteld (DIYANET_EMAIL en DIYANET_PASSWORD). Niets gedaan.');
    return;
  }

  await mkdir(OUT, { recursive: true });
  const places = await readJson(OUT + '/places.json', {});
  const manual = await readJson('scripts/diyanet-cities.json', {});
  const index = await readJson(OUT + '/index.json', { cities: {} });

  await login(email, password);

  try {
    await discover(places);
  } catch (error) {
    console.log('Plaatsen opzoeken onderbroken: ' + error.message);
  }
  await writeJson(OUT + '/places.json', places);

  const { found, missing } = match(places, manual);
  const today = new Date().toISOString().slice(0, 10);
  const keepFrom = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);

  // Steden met de oudste gegevens eerst, zodat iedereen aan de beurt komt.
  const order = Object.keys(found).sort((a, b) => ((index.cities[a] || {}).fetched || '').localeCompare((index.cities[b] || {}).fetched || ''));
  const failed = [];

  for (const name of order) {
    if (requests >= MAX_REQUESTS) break;
    if ((index.cities[name] || {}).fetched === today) continue;
    try {
      const rows = await call('/api/PrayerTime/Monthly/' + found[name]);
      const file = OUT + '/' + slug(name) + '.json';
      const old = await readJson(file, { days: [] });
      const days = {};
      for (const d of old.days || []) {
        if (d.date >= keepFrom) days[d.date] = d;
      }
      for (const row of Array.isArray(rows) ? rows : []) {
        const date = dayKey(row);
        if (!date) continue;
        days[date] = {
          date,
          fajr: clock(row.fajr),
          sunrise: clock(row.sunrise),
          dhuhr: clock(row.dhuhr),
          asr: clock(row.asr),
          maghrib: clock(row.maghrib),
          isha: clock(row.isha),
          hijri: row.hijriDateLong || row.hijriDateShort || '',
        };
      }
      const list = Object.values(days).sort((a, b) => a.date.localeCompare(b.date));
      if (!list.length) throw new Error('geen dagen ontvangen');
      await writeJson(file, { city: name, cityId: found[name], source: 'Diyanet İşleri Başkanlığı', fetched: today, days: list });
      index.cities[name] = { file: slug(name) + '.json', fetched: today, from: list[0].date, to: list[list.length - 1].date };
    } catch (error) {
      if (error.message === 'budget') break;
      failed.push(name + ': ' + error.message);
    }
  }

  index.updated = today;
  index.missing = missing;
  await writeJson(OUT + '/index.json', index);

  console.log(`Verzoeken: ${requests}. Steden met tijden: ${Object.keys(index.cities).length} van ${CITIES.length}.`);
  if (missing.length) console.log('Nog niet gevonden bij Diyanet: ' + missing.join(', '));
  if (failed.length) console.log('Mislukt: ' + failed.join(' | '));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
