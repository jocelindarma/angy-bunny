//Pasadena coordinates
export const SHOP_LAT = -6.2307;
export const SHOP_LON = 106.6342;

export function calcDistanceKm(
  lat2: number,
  lon2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - SHOP_LAT);
  const dLon = toRad(lon2 - SHOP_LON);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(SHOP_LAT)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getDeliveryFee(
  distanceKm: number | null,
  cartLength: number
): number {
  if (distanceKm === null || cartLength === 0) return 0;
  if (distanceKm > 50) return 0;
  if (distanceKm > 5) return 8000 + Math.ceil(distanceKm - 5) * 2000;
  if (distanceKm >= 0) return 8000;
  return 0;
}
