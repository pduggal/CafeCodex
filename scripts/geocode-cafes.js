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

async function geocode(name, city, country) {
  const query = `${name}, ${city}, ${country}`;
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.length === 0) {
    const fallback = `${city}, ${country}`;
    const url2 = `${NOMINATIM_URL}?q=${encodeURIComponent(fallback)}&format=json&limit=1`;
    const res2 = await fetch(url2, { headers: { 'User-Agent': USER_AGENT } });
    if (!res2.ok) return null;
    const data2 = await res2.json();
    if (data2.length === 0) return null;
    return { lat: parseFloat(data2[0].lat), lng: parseFloat(data2[0].lon), fallback: true };
  }
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), fallback: false };
}

async function fetchAllCafes() {
  const allCafes = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cafes?select=id,name,city,country,coordinates&order=id&offset=${from}&limit=${pageSize}`,
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

async function main() {
  console.log('Fetching cafes from Supabase...');
  const cafes = await fetchAllCafes();
  console.log(`Found ${cafes.length} cafes total`);

  const needGeocoding = cafes.filter((c) => !c.coordinates);
  const alreadyDone = cafes.length - needGeocoding.length;
  if (alreadyDone > 0) console.log(`Skipping ${alreadyDone} already geocoded`);
  console.log(`Geocoding ${needGeocoding.length} cafes...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < needGeocoding.length; i++) {
    const cafe = needGeocoding[i];
    try {
      const coords = await geocode(cafe.name, cafe.city, cafe.country);
      if (coords) {
        const ok = await updateCoordinates(cafe.id, { lat: coords.lat, lng: coords.lng });
        if (ok) {
          const note = coords.fallback ? ' (city fallback)' : '';
          console.log(`✓ [${i + 1}/${needGeocoding.length}] ${cafe.name} → ${coords.lat}, ${coords.lng}${note}`);
          success++;
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

  console.log(`\nDone! ${success} geocoded, ${failed} failed, ${alreadyDone} skipped`);
}

main().catch((e) => { console.error(e); process.exit(1); });
