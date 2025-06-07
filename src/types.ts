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
    garden?: boolean;
    food?: boolean;
    craft_beer?: boolean;
    live_music?: boolean;
    quiz_night?: boolean;
    board_games?: boolean;
    sunday_roast?: boolean;
    outdoor_seating?: boolean;
    dj?: boolean;
    street_food?: boolean;
    nightlife?: boolean;
    cocktails?: boolean;
    amenity?: string;
    opening_hours?: string;
    features?: string;
  };
  isInSun?: boolean;
  working_hours?: string;
} 