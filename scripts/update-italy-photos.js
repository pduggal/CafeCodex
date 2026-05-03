#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://slwymfjwjhklgbijgixc.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || require('dotenv').config().parsed?.SUPABASE_SERVICE_KEY
);

const photos = {
  '418': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/727/farorome_322539471_668403578102474_2373473196929469152_n.jpeg',
  '419': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/21415/luna-rome__1744815251_3612094586303137881_65798893129.jpeg',
  '420': 'https://media.cntraveler.com/photos/53e2de11dddaa35c30f61432/master/pass/barnum-cafe-rome-interior.jpg',
  '421': 'https://italyspecialty.coffee/assets/images/lazio/rome/pergamino-caffe-cafe-rome-specialty-coffee-italy.jpg',
  '422': 'https://anamericaninrome.com/wp-content/uploads/2017/10/Roscioli-Caffe-Rome-2-1024x683.jpg',
  '423': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/28410/adl_7372-copia.jpg',
  '424': 'https://cdn.th3rdwave.coffee/processed/merchants/2hRWMMdO2kffGXHyflXdepWq27N.jpg/768x768i_2x.jpg',
  '425': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/fe/fa/28/moon-love.jpg',
  '426': 'https://flawless.life/wp-content/uploads/2021/03/Casa-Manfredi-roma-cover.jpg',
  '427': 'https://italyspecialty.coffee/assets/images/tuscany/florence/coffee-mantra-cafe-florence-specialty-coffee-italy.jpg',
  '428': 'https://italyspecialty.coffee/assets/images/tuscany/florence/ditta-artigianale-oltrarno-cafe-florence-specialty-coffee-italy.jpg',
  '429': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/4130/fluidspecialtycoffee-florence-socialmedia.jpeg',
  '430': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/cc/af/3b/a-light-spot-on-the-river.jpg',
  '431': 'https://www.lamenagere.it/wp-content/uploads/2022/10/lamenagere-bistrot-slider1-01.jpg',
  '432': 'https://italyspecialty.coffee/assets/images/tuscany/florence/simbiosi-organic-cafe-cafe-florence-specialty-coffee-italy.jpg',
  '433': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/0b/49/0b/caption.jpg',
  '434': 'https://images.squarespace-cdn.com/content/v1/5f4fc2bc70a18b28fbe03f2e/1611148688179-6Q51XCNNGQE1ZM708P13/simo+tosta.jpg',
  '435': 'https://swisstraveler.net/wp/wp-content/uploads/2023/12/42AFC204-BD41-4809-A123-E8C16B4ABB22_1_201_a.jpeg',
  '436': 'https://veneziaautentica.com/wp-content/uploads/2016/07/torrefazione-cannaregio-8.jpg',
  '437': 'https://media.cntraveler.com/photos/5d6e1e839895dd0009aef7ef/16:9/w_2560,c_limit/00-cafedeldoge-venice-2019-CYBPEK.jpg',
  '438': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/c8/71/29/sullaluna.jpg',
  '439': 'https://caffeflorian.com/wp-content/uploads/2024/01/Esterno_1-scaled.jpg',
  '440': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/9c/e2/5b/pasticceria-rosa-salva.jpg',
  '441': 'https://media.cntraveler.com/photos/5d767d93085341000833751d/16:9/w_2560%2Cc_limit/Marchini-Time_Venice_%25C2%25A9FrancescoRusso_090.jpg',
  '442': 'https://italyspecialty.coffee/assets/images/lombardy/milan/orsonero-coffee-cafe-milan-specialty-coffee-italy.jpg',
  '443': 'https://italyspecialty.coffee/assets/images/lombardy/milan/cafezal-roaster-milan-specialty-coffee-italy.jpg',
  '444': 'https://thecoffeevine.com/wp-content/uploads/2022/07/BRN3983.jpg',
  '445': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/58/a2/6f/caption.jpg',
  '446': 'https://www.ifmilano.com/wp-content/uploads/Esterno-Ditta-Artigianale-Milano.jpg',
  '447': 'https://italyspecialty.coffee/assets/images/lombardy/milan/coffee-studio-7gr-cafe-milan-specialty-coffee-italy.jpg',
  '448': 'https://europeancoffeetrip.com/wp-content/uploads/2022/07/Onest-Milano-_-Interni-06-_-ph-Jacopo-Salvi.jpeg',
  '449': 'https://i0.wp.com/junecollectivemilano.com/wp-content/uploads/2023/11/junecollective-32.jpg',
  '450': 'https://images.adsttc.com/media/images/6478/ab1b/20e8/d369/8747/beab/large_jpg/pan-bakery-milano-studio-wok_17.jpg',
  '451': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2e/4c/18/a1/caption.jpg',
  '452': 'https://www.urdesignmag.com/wp-content/uploads/2025/07/eris-milan-porta-venezia-velia-architecture-pop-up-specialty-coffee-natural-wine-hub-1.webp',
  '453': 'https://www.ragnousa.com/app/uploads/2026/02/Ragno_Atelier_Prato_006-1350x759.jpg',
  '454': 'https://media.cntraveler.com/photos/55cd0270c47ae13868ae3889/16:9/w_2560,c_limit/pasticceria-cucchi-interior.jpg',
  '455': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/b4/32/18/photo4jpg.jpg',
  '456': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/dc/25/c5/mascherpa.jpg',
  '457': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/18641/img_1623.jpeg',
  '458': 'https://italyspecialty.coffee/assets/images/emilia-romagna/bologna/aroma-cafe-bologna-specialty-coffee-italy.jpg',
  '459': 'https://www.burocafe.it/specialtycoffeeshop/wp-content/uploads/2022/12/Buro_cafe-133.jpg',
  '460': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/f5/91/4a/bancone-pane-e-dolci.jpg',
  '461': 'https://deliciousbologna.com/wp-content/uploads/2022/01/Cafe-Terzi-Bologna.jpg',
  '462': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/10589/whatsapp-image-2024-10-03-at-13-57-01.jpeg',
  '463': 'https://europeancoffeetrip.com/wp-content/uploads/city-guides/cafes/24560/_20250717154834.jpg',
  '464': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/b4/de/74/il-banco.jpg',
  '465': 'https://italyspecialty.coffee/assets/images/lombardy/bergamo/bugan-coffee-lab-citta-alta-cafe-bergamo-specialty-coffee-italy.jpg',
};

async function main() {
  let success = 0, failed = 0;
  const entries = Object.entries(photos);
  console.log(`Updating ${entries.length} Italy cafe photos in Supabase...\n`);

  for (const [id, photo_url] of entries) {
    const { error } = await supabase
      .from('cafes')
      .update({ photo_url })
      .eq('id', id);

    if (error) {
      console.log(`✗ ID ${id} — ${error.message}`);
      failed++;
    } else {
      console.log(`✓ ID ${id} — photo updated`);
      success++;
    }
  }

  console.log(`\nDone: ${success} updated, ${failed} failed`);
}

main();
