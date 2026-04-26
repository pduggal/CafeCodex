const { VIBE_TAGS, getCafePhoto, COFFEE_PHOTOS, MATCHA_PHOTOS } = require('../../data/cafes');

const CANONICAL_VIBE_IDS = [
  'viral_aesthetic', 'matcha_specialist', 'specialty_coffee', 'pour_over',
  'creative_drinks', 'cozy_quiet', 'hidden_gem', 'collab_worthy',
];

describe('VIBE_TAGS', () => {
  test('has exactly 8 entries', () => {
    expect(VIBE_TAGS).toHaveLength(8);
  });

  test('every tag has id, label, and emoji fields', () => {
    VIBE_TAGS.forEach((tag) => {
      expect(tag).toHaveProperty('id');
      expect(tag).toHaveProperty('label');
      expect(tag).toHaveProperty('emoji');
      expect(typeof tag.id).toBe('string');
      expect(typeof tag.label).toBe('string');
      expect(typeof tag.emoji).toBe('string');
    });
  });

  test('tag ids match the canonical set', () => {
    const ids = VIBE_TAGS.map((t) => t.id).sort();
    expect(ids).toEqual([...CANONICAL_VIBE_IDS].sort());
  });
});

describe('getCafePhoto', () => {
  test('returns photo_url when present', () => {
    const cafe = { id: '1', photo_url: 'https://example.com/photo.jpg' };
    expect(getCafePhoto(cafe)).toBe('https://example.com/photo.jpg');
  });

  test('falls back to COFFEE_PHOTOS for coffee cafes', () => {
    const cafe = { id: '3', drink: 'coffee' };
    const expected = COFFEE_PHOTOS[3 % COFFEE_PHOTOS.length];
    expect(getCafePhoto(cafe)).toBe(expected);
  });

  test('falls back to MATCHA_PHOTOS for matcha cafes', () => {
    const cafe = { id: '2', drink: 'matcha' };
    const expected = MATCHA_PHOTOS[2 % MATCHA_PHOTOS.length];
    expect(getCafePhoto(cafe)).toBe(expected);
  });

  test('uses MATCHA_PHOTOS when vibe_tags includes matcha_specialist', () => {
    const cafe = { id: '7', vibe_tags: ['matcha_specialist'] };
    const expected = MATCHA_PHOTOS[7 % MATCHA_PHOTOS.length];
    expect(getCafePhoto(cafe)).toBe(expected);
  });
});
