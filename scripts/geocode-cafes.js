#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

const SUPABASE_URL = 'https://slwymfjwjhklgbijgixc.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY in .env or as an environment variable.');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'CafeCodex/1.0 (cafe geocoding script)';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function nominatimSearch(query) {
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
}

async function geocode(name, neighborhood, city, country) {
  const queries = [
    `${name}, ${neighborhood}, ${city}, ${country}`,
    `${name}, ${city}, ${country}`,
    `${neighborhood}, ${city}, ${country}`,
    `${city}, ${country}`,
  ];

  for (let i = 0; i < queries.length; i++) {
    const result = await nominatimSearch(queries[i]);
    if (result) {
      const precision = i === 0 ? 'exact' : i === 1 ? 'name+city' : i === 2 ? 'neighborhood' : 'city';
      return { ...result, precision };
    }
    if (i < queries.length - 1) await sleep(1100);
  }
  return null;
}

async function fetchAllCafes() {
  const allCafes = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cafes?select=id,name,city,country,neighborhood,coordinates&order=id&offset=${from}&limit=${pageSize}`,
      { headers }
    );
    const data = await res.json();
    allCafes.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allCafes;
}

async function updateCoordinates(id, coordinates) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/cafes?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify({ coordinates }),
  });
  return res.ok;
}

function findCityFallbacks(cafes) {
  const coordGroups = {};
  for (const cafe of cafes) {
    if (!cafe.coordinates) continue;
    const key = `${cafe.coordinates.lat},${cafe.coordinates.lng}`;
    if (!coordGroups[key]) coordGroups[key] = [];
    coordGroups[key].push(cafe);
  }
  const fallbackIds = new Set();
  for (const [, group] of Object.entries(coordGroups)) {
    if (group.length >= 3) {
      for (const cafe of group) fallbackIds.add(cafe.id);
    }
  }
  return fallbackIds;
}

async function main() {
  console.log('Fetching cafes from Supabase...');
  const cafes = await fetchAllCafes();
  console.log(`Found ${cafes.length} cafes total`);

  const fallbackIds = findCityFallbacks(cafes);
  const needGeocoding = cafes.filter((c) => !c.coordinates || fallbackIds.has(c.id));
  const skipped = cafes.length - needGeocoding.length;

  console.log(`${fallbackIds.size} cafes have city-level fallback coordinates`);
  console.log(`${cafes.filter((c) => !c.coordinates).length} cafes have null coordinates`);
  console.log(`Skipping ${skipped} cafes with unique coordinates`);
  console.log(`Re-geocoding ${needGeocoding.length} cafes...\n`);

  let exact = 0, nameCity = 0, neighborhood = 0, city = 0, failed = 0;

  for (let i = 0; i < needGeocoding.length; i++) {
    const cafe = needGeocoding[i];
    try {
      const coords = await geocode(cafe.name, cafe.neighborhood, cafe.city, cafe.country);
      if (coords) {
        const ok = await updateCoordinates(cafe.id, { lat: coords.lat, lng: coords.lng });
        if (ok) {
          console.log(`✓ [${i + 1}/${needGeocoding.length}] ${cafe.name} (${cafe.city}) → ${coords.lat}, ${coords.lng} [${coords.precision}]`);
          if (coords.precision === 'exact') exact++;
          else if (coords.precision === 'name+city') nameCity++;
          else if (coords.precision === 'neighborhood') neighborhood++;
          else city++;
        } else {
          console.log(`✗ [${i + 1}/${needGeocoding.length}] ${cafe.name} — update failed`);
          failed++;
        }
      } else {
        console.log(`✗ [${i + 1}/${needGeocoding.length}] ${cafe.name} — not found`);
        failed++;
      }
    } catch (e) {
      console.log(`✗ [${i + 1}/${needGeocoding.length}] ${cafe.name} — ${e.message}`);
      failed++;
    }
    await sleep(1100);
  }

  console.log(`\nDone!`);
  console.log(`  exact (name+neighborhood+city): ${exact}`);
  console.log(`  name+city:                      ${nameCity}`);
  console.log(`  neighborhood-level:             ${neighborhood}`);
  console.log(`  city-level (fallback):          ${city}`);
  console.log(`  failed:                         ${failed}`);
  console.log(`  skipped (already unique):       ${skipped}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
