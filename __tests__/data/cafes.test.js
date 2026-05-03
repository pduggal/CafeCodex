const { VIBE_TAGS, getCafePhoto, getVibeLabel, timeAgo } = require('../../data/cafes');

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

  test('falls back to Unsplash URL for coffee cafes without photo_url', () => {
    const cafe = { id: '3', drink: 'coffee' };
    const result = getCafePhoto(cafe);
    expect(result).toContain('unsplash.com');
    expect(typeof result).toBe('string');
  });

  test('falls back to Unsplash URL for matcha cafes without photo_url', () => {
    const cafe = { id: '2', drink: 'matcha' };
    const result = getCafePhoto(cafe);
    expect(result).toContain('unsplash.com');
  });

  test('uses matcha fallback when vibe_tags includes matcha_specialist', () => {
    const coffeeCafe = { id: '7', drink: 'coffee', vibe_tags: [] };
    const matchaCafe = { id: '7', vibe_tags: ['matcha_specialist'] };
    const coffeePhoto = getCafePhoto(coffeeCafe);
    const matchaPhoto = getCafePhoto(matchaCafe);
    expect(matchaPhoto).toContain('unsplash.com');
    expect(matchaPhoto).not.toBe(coffeePhoto);
  });
});

describe('getVibeLabel', () => {
  test('returns emoji + label for known tag', () => {
    expect(getVibeLabel('specialty_coffee')).toBe('☕ Specialty Coffee');
    expect(getVibeLabel('hidden_gem')).toBe('✨ Hidden Gem');
  });

  test('returns raw id for unknown tag', () => {
    expect(getVibeLabel('unknown_tag')).toBe('unknown_tag');
  });

  test('works for all 8 canonical tags', () => {
    VIBE_TAGS.forEach((tag) => {
      const result = getVibeLabel(tag.id);
      expect(result).toContain(tag.emoji);
      expect(result).toContain(tag.label);
    });
  });
});

describe('timeAgo', () => {
  test('returns "just now" for recent timestamps', () => {
    expect(timeAgo(new Date())).toBe('just now');
  });

  test('returns minutes ago', () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    expect(timeAgo(tenMinAgo)).toBe('10m ago');
  });

  test('returns hours ago', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(timeAgo(threeHoursAgo)).toBe('3h ago');
  });

  test('returns days ago', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    expect(timeAgo(twoDaysAgo)).toBe('2d ago');
  });

  test('returns weeks ago', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    expect(timeAgo(twoWeeksAgo)).toBe('2w ago');
  });
});
