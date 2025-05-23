export function getAreaKey(latitude: number, longitude: number): string {
  const lat = latitude.toFixed(3);
  const lng = longitude.toFixed(3);
  return `bar_data:${lat}:${lng}`;
} 