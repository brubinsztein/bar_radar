import { Bar, BarSearchResponse, ApiError as ApiErrorType } from '../types';
import { API_CONFIG } from '../config/constants';
import { GOOGLE_PLACES_API_KEY } from '@env';

class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class PlacesApiService {
  private static BASE_URL = API_CONFIG.PLACES_API.BASE_URL;

  private static async fetchWithErrorHandling<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(endpoint, options);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error_message || 'API request failed',
          data.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  static async searchNearbyBars(
    latitude: number,
    longitude: number,
    radius: number = 1000,
    pageToken?: string
  ): Promise<BarSearchResponse> {
    const endpoint = `${this.BASE_URL}/nearbysearch/json`;
    const params = new URLSearchParams({
      location: `${latitude},${longitude}`,
      radius: radius.toString(),
      type: 'bar',
      key: GOOGLE_PLACES_API_KEY,
      ...(pageToken && { pagetoken: pageToken }),
    });

    const data = await this.fetchWithErrorHandling<any>(`${endpoint}?${params}`);

    const bars: Bar[] = data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      location: {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      },
      address: place.vicinity,
      rating: place.rating,
      isOpen: place.opening_hours?.open_now,
      placeId: place.place_id,
      photos: place.photos?.map((photo: any) => photo.photo_reference) || [],
      priceLevel: place.price_level,
      vicinity: place.vicinity,
      types: place.types || [],
    }));

    return {
      bars,
      nextPageToken: data.next_page_token,
    };
  }

  static async getPhotoUrl(
    photoReference: string,
    maxWidth: number = API_CONFIG.PLACES_API.PHOTO_MAX_WIDTH
  ): Promise<string> {
    const endpoint = `${this.BASE_URL}/photo`;
    const params = new URLSearchParams({
      maxwidth: maxWidth.toString(),
      photo_reference: photoReference,
      key: GOOGLE_PLACES_API_KEY,
    });

    return `${endpoint}?${params}`;
  }

  static async searchNearbyBarsAllPages(
    latitude: number,
    longitude: number,
    radius: number = 1000
  ): Promise<Bar[]> {
    let allBars: Bar[] = [];
    let pageToken: string | undefined = undefined;
    let page = 0;
    do {
      if (pageToken) {
        // Google requires a short delay before next_page_token is valid
        await new Promise(res => setTimeout(res, 2000));
      }
      const resp = await this.searchNearbyBars(latitude, longitude, radius, pageToken);
      allBars = allBars.concat(resp.bars);
      pageToken = resp.nextPageToken;
      page++;
    } while (pageToken && page < 3); // Google returns max 3 pages
    return allBars;
  }
} 