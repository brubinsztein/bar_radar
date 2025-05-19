export interface Bar {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  rating?: number;
  isOpen?: boolean;
  placeId: string;
  photos?: string[];
  priceLevel?: number; // 0-4, from least to most expensive
  vicinity: string;
}

export interface BarSearchResponse {
  bars: Bar[];
  nextPageToken?: string;
} 