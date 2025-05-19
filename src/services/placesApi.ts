import { Bar, BarSearchResponse } from '../types/bar';
import { GOOGLE_PLACES_API_KEY } from '@env';

if (!GOOGLE_PLACES_API_KEY) {
  throw new Error('Google Places API key is not configured. Please check your .env file.');
}

export class PlacesApiService {
  private static BASE_URL = 'https://maps.googleapis.com/maps/api/place';

  static async searchNearbyBars(
    latitude: number,
    longitude: number,
    radius: number = 1000, // Reduced from 1500m to 1000m for faster initial load
    pageToken?: string
  ): Promise<BarSearchResponse> {
    const startTime = Date.now();
    try {
      console.log('Making Places API request...');
      const endpoint = `${this.BASE_URL}/nearbysearch/json`;
      const params = new URLSearchParams({
        location: `${latitude},${longitude}`,
        radius: radius.toString(),
        type: 'bar',
        key: GOOGLE_PLACES_API_KEY,
        ...(pageToken && { pagetoken: pageToken }),
      });

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_message || 'Failed to fetch nearby bars');
      }

      console.log(`Places API response received in ${Date.now() - startTime}ms`);
      
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
      }));

      console.log(`Data processing completed in ${Date.now() - startTime}ms`);

      return {
        bars,
        nextPageToken: data.next_page_token,
      };
    } catch (error) {
      console.error('Error fetching nearby bars:', error);
      throw error;
    }
  }

  static async getPhotoUrl(photoReference: string, maxWidth: number = 400): Promise<string> {
    const endpoint = `${this.BASE_URL}/photo`;
    const params = new URLSearchParams({
      maxwidth: maxWidth.toString(),
      photo_reference: photoReference,
      key: GOOGLE_PLACES_API_KEY,
    });

    return `${endpoint}?${params}`;
  }
} 