const R = 6371;

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km, country) {
  if (km == null) return null;
  const useMiles = country === 'United States';
  const value = useMiles ? km * 0.621371 : km;
  const unit = useMiles ? 'mi' : 'km';
  if (value < 0.5) return 'nearby';
  if (value < 10) return `${value.toFixed(1)} ${unit}`;
  if (value < 1000) return `${Math.round(value)} ${unit}`;
  return `${Math.round(value).toLocaleString()} ${unit}`;
}
