import { getDistanceKm, formatDistance } from '../../data/distance';

describe('getDistanceKm', () => {
  it('calculates Tokyo to NYC correctly (~10,838 km)', () => {
    const km = getDistanceKm(35.6762, 139.6503, 40.7128, -74.006);
    expect(km).toBeGreaterThan(10700);
    expect(km).toBeLessThan(11000);
  });

  it('returns 0 for same point', () => {
    expect(getDistanceKm(47.6, -122.3, 47.6, -122.3)).toBe(0);
  });

  it('returns null when any coordinate is null', () => {
    expect(getDistanceKm(null, 0, 0, 0)).toBeNull();
    expect(getDistanceKm(0, null, 0, 0)).toBeNull();
    expect(getDistanceKm(0, 0, null, 0)).toBeNull();
    expect(getDistanceKm(0, 0, 0, null)).toBeNull();
  });

  it('calculates short distance correctly (~1.1 km)', () => {
    const km = getDistanceKm(47.6062, -122.3321, 47.6152, -122.3321);
    expect(km).toBeGreaterThan(0.9);
    expect(km).toBeLessThan(1.2);
  });
});

describe('formatDistance', () => {
  it('returns null for null input', () => {
    expect(formatDistance(null, 'Japan')).toBeNull();
  });

  it('returns "nearby" for very short distances', () => {
    expect(formatDistance(0.3, 'Japan')).toBe('nearby');
    expect(formatDistance(0.1, 'United States')).toBe('nearby');
  });

  it('formats km for international', () => {
    expect(formatDistance(5.7, 'Japan')).toBe('5.7 km');
    expect(formatDistance(150, 'India')).toBe('150 km');
    expect(formatDistance(2500, 'Australia')).toBe('2,500 km');
  });

  it('formats miles for US', () => {
    const result = formatDistance(10, 'United States');
    expect(result).toMatch(/mi$/);
    expect(parseFloat(result)).toBeCloseTo(6.2, 0);
  });

  it('formats large distances with commas', () => {
    expect(formatDistance(5000, 'Japan')).toBe('5,000 km');
  });

  it('uses one decimal for distances under 10', () => {
    expect(formatDistance(3.456, 'Japan')).toBe('3.5 km');
  });

  it('rounds for distances 10-999', () => {
    expect(formatDistance(55.8, 'Japan')).toBe('56 km');
  });
});
