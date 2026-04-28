#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://slwymfjwjhklgbijgixc.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE_KEY) {
  console.error('Set SUPABASE_SERVICE_KEY environment variable before running this script.');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

function extractData() {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  const cafesMatch = html.match(/const CAFES_INLINE = \[([\s\S]*?)\];\s*\n/);
  if (!cafesMatch) throw new Error('Could not find CAFES array');

  const countriesMatch = html.match(/const COUNTRIES_INLINE = \[([\s\S]*?)\];\s*\n/);
  if (!countriesMatch) throw new Error('Could not find COUNTRIES array');

  let cafes, countries;
  try {
    cafes = new Function(`return [${cafesMatch[1]}]`)();
  } catch (e) {
    throw new Error(`Failed to parse CAFES: ${e.message}`);
  }
  try {
    countries = new Function(`return [${countriesMatch[1]}]`)();
  } catch (e) {
    throw new Error(`Failed to parse COUNTRIES: ${e.message}`);
  }

  console.log(`Extracted ${cafes.length} cafes and ${countries.length} countries`);
  return { cafes, countries };
}

async function seedCafes(cafes) {
  console.log(`Seeding ${cafes.length} cafes...`);

  const rows = cafes.map(c => ({
    id: String(c.id),
    name: c.name,
    city: c.city,
    country: c.country,
    neighborhood: c.neighborhood || null,
    drink: c.drink || null,
    vibe_tags: c.vibe_tags || [],
    curator_pick: c.curator_pick || false,
    curator_rating: c.curator_rating || null,
    curator_notes: c.curator_notes || null,
    photo_url: c.photo_url || null,
    instagram_handle: c.instagram_handle || null,
    trending: c.trending || false,
    is_active: c.is_active !== undefined ? c.is_active : true,
    must_try: c.must_try || null,
    press_mention: c.press_mention || null,
    coordinates: c.coordinates || null,
  }));

  const batchSize = 50;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cafes`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal,resolution=merge-duplicates' },
      body: JSON.stringify(batch),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to insert cafes batch ${i}: ${err}`);
    }
    console.log(`  Inserted cafes ${i + 1}-${Math.min(i + batchSize, rows.length)}`);
  }
  console.log(`Done: ${rows.length} cafes seeded`);
}

async function seedCountries(countries) {
  console.log(`Seeding ${countries.length} countries...`);

  const rows = countries.map(c => ({
    name: c.name,
    flag: c.flag || null,
    visited: c.visited || false,
    wishlist: c.wishlist || false,
    aliases: c.aliases || [],
    cities: c.cities || [],
    planned_cities: c.planned_cities || [],
    message: c.message || null,
  }));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/countries`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal,resolution=merge-duplicates' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to insert countries: ${err}`);
  }
  console.log(`Done: ${rows.length} countries seeded`);
}

async function verify() {
  const cafesRes = await fetch(`${SUPABASE_URL}/rest/v1/cafes?select=id`, { headers });
  const cafes = await cafesRes.json();

  const countriesRes = await fetch(`${SUPABASE_URL}/rest/v1/countries?select=id`, { headers });
  const countries = await countriesRes.json();

  console.log(`\nVerification:`);
  console.log(`  Cafes in Supabase: ${cafes.length}`);
  console.log(`  Countries in Supabase: ${countries.length}`);
}

async function main() {
  try {
    console.log('=== CafeCodex Supabase Seed ===\n');
    const { cafes, countries } = extractData();
    await seedCafes(cafes);
    await seedCountries(countries);
    await verify();
    console.log('\n=== Seed complete! ===');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
