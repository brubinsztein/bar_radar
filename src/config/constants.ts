export const MAP_CONFIG = {
  DEFAULT_REGION: {
    latitude: 51.5074, // London
    longitude: -0.1278,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  MAX_INITIAL_BARS: 15,
  SEARCH_RADIUS: 1000, // meters
} as const;

export const API_CONFIG = {
  PLACES_API: {
    BASE_URL: 'https://maps.googleapis.com/maps/api/place',
    PHOTO_MAX_WIDTH: 400,
  },
} as const;

export const APP_CONFIG = {
  CACHE_TIME: 1000 * 60 * 5, // 5 minutes
  STALE_TIME: 1000 * 60, // 1 minute
} as const; 