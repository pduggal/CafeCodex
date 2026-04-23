export const VIBE_TAGS = [
  { id: 'viral_aesthetic', label: 'Viral & Aesthetic', emoji: '📸' },
  { id: 'matcha_specialist', label: 'Matcha Specialist', emoji: '🍵' },
  { id: 'specialty_coffee', label: 'Specialty Coffee', emoji: '☕' },
  { id: 'pour_over', label: 'Pour-Over', emoji: '🫖' },
  { id: 'creative_drinks', label: 'Creative Drinks', emoji: '🧋' },
  { id: 'cozy_quiet', label: 'Cozy & Quiet', emoji: '🌿' },
  { id: 'hidden_gem', label: 'Hidden Gem', emoji: '✨' },
  { id: 'collab_worthy', label: 'Collab-Worthy', emoji: '🤝' },
];

export const COFFEE_PHOTOS = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=600&h=440&fit=crop&q=85&auto=format',
];

export const MATCHA_PHOTOS = [
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=600&h=440&fit=crop&q=85&auto=format',
  'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&h=440&fit=crop&q=85&auto=format',
];

export function getCafePhoto(cafe) {
  if (cafe.photo_url) return cafe.photo_url;
  const arr = (cafe.drink === 'matcha' || (cafe.vibe_tags && cafe.vibe_tags.includes('matcha_specialist')))
    ? MATCHA_PHOTOS : COFFEE_PHOTOS;
  return arr[parseInt(cafe.id, 10) % arr.length];
}
