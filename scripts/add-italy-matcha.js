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
  console.error('Set SUPABASE_SERVICE_KEY in .env');
  process.exit(1);
}

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
};

const NEW_CAFES = [
  {id:466,name:"Moko's Matcha Milano",photo_url:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/6e/37/60/caption.jpg',city:'Milan',country:'Italy',neighborhood:'Isola',drink:'matcha',vibe_tags:['matcha_specialist','viral_aesthetic','collab_worthy'],curator_pick:true,curator_rating:5,must_try:{drink:'Ceremonial matcha or handmade matcha mochi',note:"Milan's best dedicated matcha destination — imports Japanese ceremonial-grade matcha, makes everything in-house."},curator_notes:{what_to_order:'Ceremonial matcha, matcha latte, handmade mochi, seasonal matcha desserts',best_time:'Morning or afternoon',content_tips:"Milan's strongest matcha destination. Imports and distributes high-quality Japanese ceremonial matcha, makes handmade mochi and desserts daily. This is not a café that happens to sell matcha — matcha is the entire identity. Verified by Matcha Spot 2026 Milan guide as the top Milan pick. Beautiful for content: the drinks, the desserts, and the space are all visual."},instagram_handle:'mokosmatcha.milan',trending:true,is_active:true},
  {id:467,name:'La Teiera Eclettica',photo_url:'https://www.teieraeclettica.it/wp-content/uploads/2024/03/Matcha-Hana.jpg',city:'Milan',country:'Italy',neighborhood:'Milan',drink:'matcha',vibe_tags:['matcha_specialist','cozy_quiet','hidden_gem'],curator_pick:true,curator_rating:5,must_try:{drink:'Whisked ceremonial matcha — ask for their current single-origin recommendation',note:'Best traditional Japanese tea experience in Milan. Come for the ritual, not the Instagram.'},curator_notes:{what_to_order:'Ceremonial matcha, Japanese tea ceremony experience, single-origin teas',best_time:'Afternoon',content_tips:"Milan's best Japanese tea room for a genuinely traditional whisked matcha experience. Less about the latte aesthetic, more about the ritual and quality. Quiet, intimate, and seriously focused on Japanese tea culture. The antidote to everywhere that puts matcha powder in warm milk and calls it a latte. Matcha Spot 2026 Milan guide highlight."},instagram_handle:'lateieraeclettica',trending:false,is_active:true},
  {id:468,name:'Macha Café',photo_url:'https://images.happycow.net/venues/1024/33/85/hcmp338563_3035573.jpeg',city:'Milan',country:'Italy',neighborhood:'Milan',drink:'matcha',vibe_tags:['matcha_specialist','viral_aesthetic'],curator_pick:false,curator_rating:4,must_try:{drink:'Matcha latte or seasonal matcha drink',note:'The accessible matcha stop in Milan — good quality, easy to find, reliable.'},curator_notes:{what_to_order:'Matcha latte, seasonal matcha drinks, brunch',best_time:'Morning or afternoon',content_tips:"The most accessible and mainstream matcha stop in Milan. Not as ceremonial as Moko's or La Teiera, but solid quality and easy to visit. Good for people who want a reliable matcha latte without the deep dive. Matcha Spot 2026 Milan guide pick. Useful as a grab-and-go matcha option in the centre."},instagram_handle:'machacafe.milan',trending:false,is_active:true},
  {id:469,name:'Tè Amo',photo_url:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/e2/f4/b6/caption.jpg',city:'Rome',country:'Italy',neighborhood:'Pantheon',drink:'matcha',vibe_tags:['matcha_specialist','viral_aesthetic','collab_worthy'],curator_pick:true,curator_rating:4,must_try:{drink:'Matcha latte or matcha bubble tea',note:"Rome's most central and reliable matcha stop — right near the Pantheon and Torre Argentina."},curator_notes:{what_to_order:'Matcha latte, matcha bubble tea, seasonal matcha drinks',best_time:'Afternoon',content_tips:"Rome's best central matcha option. Strong location near the Pantheon and Torre Argentina makes it the practical must-visit matcha stop for anyone exploring Rome's historic centre. Dedicated matcha focus with good quality sourcing. Verified by Juliette's Forks and Footprints 2026 Rome matcha guide as the top pick. Good for content — colourful drinks in a central Roman setting."},instagram_handle:'teamoroma',trending:false,is_active:true},
  {id:470,name:'ChaChaLab',photo_url:'https://images.squarespace-cdn.com/content/v1/66d038728d5dca2b3cc7fb28/b1b20b9c-08b1-449e-8e82-4e290e68cfa2/processed_20251003_113759.jpg',city:'Rome',country:'Italy',neighborhood:'Campo de Fiori',drink:'matcha',vibe_tags:['matcha_specialist','viral_aesthetic','collab_worthy'],curator_pick:false,curator_rating:4,must_try:{drink:'Matcha drink + colourful dessert',note:'Cute, colourful grab-and-go matcha near Campo de Fiori — strong content potential.'},curator_notes:{what_to_order:'Matcha drinks, colourful desserts, seasonal specials',best_time:'Afternoon',content_tips:"Cute, colourful matcha and dessert stop near Campo de Fiori. Not a specialist matcha lab — more of an aesthetic grab-and-go experience. Good for content: the drinks are visual, the location is great, and the vibe fits the Café Codex Rome crowd. Verified by Juliette's Forks and Footprints 2026 Rome matcha guide."},instagram_handle:'chachalab.rome',trending:false,is_active:true},
  {id:471,name:'machi machi Florence',photo_url:'https://www.foodserviceweb.it/wp-content/uploads/sites/4/2023/05/machi-machi.jpg',city:'Florence',country:'Italy',neighborhood:'Santa Maria Novella',drink:'matcha',vibe_tags:['matcha_specialist','viral_aesthetic','collab_worthy'],curator_pick:true,curator_rating:4,must_try:{drink:'Matcha latte or ceremonial matcha',note:"Florence's dedicated matcha destination — the biggest matcha crowd in the city comes here."},curator_notes:{what_to_order:'Matcha latte, ceremonial matcha, matcha desserts',best_time:'Morning or afternoon',content_tips:"Florence's strongest dedicated matcha stop. Draws the biggest matcha crowd in the city, with a focus on quality matcha drinks and desserts. Near Santa Maria Novella — easy to combine with a morning exploring that area. Matcha Spot 2026 Florence guide highlight. Good for content with Melaleuca nearby for a full Florence matcha day."},instagram_handle:'machimachi.florence',trending:false,is_active:true},
  {id:472,name:'Fujiyama Tea Room',photo_url:'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/91/08/71/photo0jpg.jpg',city:'Venice',country:'Italy',neighborhood:'Venice',drink:'matcha',vibe_tags:['matcha_specialist','cozy_quiet'],curator_pick:false,curator_rating:3,must_try:{drink:'Matcha latte or Japanese tea',note:"Venice's one defensible matcha/tea-room stop — quiet, Japanese-influenced, worth a visit if matcha is your thing."},curator_notes:{what_to_order:'Matcha latte, Japanese teas, light sweets',best_time:'Afternoon',content_tips:"Venice is not a matcha city — but Fujiyama Tea Room is the one honest matcha option worth saving. Japanese tea room atmosphere, matcha latte with genuine sourcing, and a quieter experience than the tourist cafés around it. Include as a single Venice matcha pin — not a must-visit for coffee people, but solid for the matcha crowd exploring Venice. Needs field validation before upgrading to top-tier."},instagram_handle:'fujiyamateaRoom',trending:false,is_active:true},
];

async function main() {
  // 1. Update Allegra Bologna (id 462) — add matcha_specialist to vibe_tags
  console.log('Updating Allegra Bologna (462) vibe_tags...');
  const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/cafes?id=eq.462`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ vibe_tags: ['matcha_specialist', 'viral_aesthetic', 'collab_worthy'] }),
  });
  console.log(updateRes.ok ? '✓ Updated Allegra Bologna' : `✗ Update failed: ${updateRes.status}`);

  // 2. Insert new matcha cafes
  console.log(`\nInserting ${NEW_CAFES.length} new Italy matcha cafes...`);
  for (const cafe of NEW_CAFES) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/cafes`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify(cafe),
    });
    if (res.ok) {
      console.log(`✓ ${cafe.name} (${cafe.city})`);
    } else {
      const err = await res.text();
      console.log(`✗ ${cafe.name}: ${res.status} ${err}`);
    }
  }

  // 3. Geocode the new cafes
  console.log('\nGeocoding new cafes...');
  const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
  for (const cafe of NEW_CAFES) {
    const queries = [
      `${cafe.name}, ${cafe.neighborhood}, ${cafe.city}, ${cafe.country}`,
      `${cafe.name}, ${cafe.city}, ${cafe.country}`,
      `${cafe.neighborhood}, ${cafe.city}, ${cafe.country}`,
    ];
    let coords = null;
    for (const q of queries) {
      const url = `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'CafeCodex/1.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          break;
        }
      }
      await new Promise(r => setTimeout(r, 1100));
    }
    if (coords) {
      const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/cafes?id=eq.${cafe.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ coordinates: coords }),
      });
      console.log(patchRes.ok ? `✓ ${cafe.name} → ${coords.lat}, ${coords.lng}` : `✗ ${cafe.name} geocode update failed`);
    } else {
      console.log(`✗ ${cafe.name} — not found`);
    }
    await new Promise(r => setTimeout(r, 1100));
  }

  console.log('\nDone!');
}

main().catch((e) => { console.error(e); process.exit(1); });
