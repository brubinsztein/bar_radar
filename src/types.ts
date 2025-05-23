export interface Bar {
  id: string;
  name: string;
  location: { latitude: number; longitude: number };
  address: string;
  rating?: number;
  isOpen?: boolean;
  placeId: string;
  photos: string[];
  priceLevel?: number;
  vicinity: string;
  types: string[];
  osmTags?: {
    real_ale?: boolean;
    real_fire?: boolean;
    dog?: boolean;
    wheelchair?: boolean;
    amenity?: string;
    opening_hours?: string;
  };
} 