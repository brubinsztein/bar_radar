export interface Location {
  latitude: number;
  longitude: number;
}

export interface Bar {
  id: string;
  name: string;
  location: Location;
  address: string;
  rating?: number;
  isOpen?: boolean;
  placeId: string;
  photos: string[];
  priceLevel?: number;
  vicinity: string;
  userRating?: number;
  lastUpdated?: Date;
  types: string[];
}

export interface BarSearchResponse {
  bars: Bar[];
  nextPageToken?: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'; 