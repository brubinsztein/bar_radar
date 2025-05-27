import { Bar } from '../types';

export interface BarFilter {
  type?: 'bar' | 'pub';
  minRating?: number;    // e.g. 4.0
  maxPriceLevel?: number; // e.g. 2
  openNow?: boolean;
  realAle?: boolean;
  realFire?: boolean;
  dog?: boolean;
  wheelchair?: boolean;
  garden?: boolean;
  food?: boolean;
  craftBeer?: boolean;
  liveMusic?: boolean;
  quizNight?: boolean;
  boardGames?: boolean;
  sundayRoast?: boolean;
  outdoorSeating?: boolean;
  dj?: boolean;
  streetFood?: boolean;
  nightlife?: boolean;
  cocktails?: boolean;
}

function isPub(bar: Bar): boolean {
  return bar.types?.includes('pub') || bar.osmTags?.amenity === 'pub';
}

function isBar(bar: Bar): boolean {
  return bar.types?.includes('bar') || bar.osmTags?.amenity === 'bar';
}

function hasFeature(bar: Bar, feature: string): boolean {
  if (!bar.osmTags) return false;
  
  // Get the features string from osmTags
  const featuresStr = bar.osmTags.features;
  if (!featuresStr) return false;

  // Split the features string into an array and check if it includes the feature
  const features = featuresStr.split(',');
  
  // Map feature names to their CSV equivalents
  const featureMap: Record<string, string> = {
    'real_ale': 'real_ale',
    'real_fire': 'fireplace',
    'dog': 'dog_friendly',
    'wheelchair': 'wheelchair',
    'garden': 'garden',
    'food': 'food',
    'craft_beer': 'craft_beer',
    'live_music': 'live_music',
    'quiz_night': 'quiz_night',
    'board_games': 'board_games',
    'sunday_roast': 'sunday_roast',
    'outdoor_seating': 'outdoor_seating',
    'dj': 'dj',
    'street_food': 'street_food',
    'nightlife': 'nightlife',
    'cocktails': 'cocktails'
  };

  const csvFeature = featureMap[feature];
  return csvFeature ? features.includes(csvFeature) : false;
}

export function filterBars(bars: Bar[], filter: BarFilter): Bar[] {
  return bars.filter(bar => {
    // Type filter
    if (filter.type === 'pub' && !isPub(bar)) {
      return false;
    }
    if (filter.type === 'bar' && !isBar(bar)) {
      return false;
    }

    // Rating filter
    if (filter.minRating !== undefined && (bar.rating ?? 0) < filter.minRating) {
      return false;
    }

    // Price level filter
    if (filter.maxPriceLevel !== undefined && (bar.priceLevel ?? 99) > filter.maxPriceLevel) {
      return false;
    }

    // Open now filter
    if (filter.openNow && bar.isOpen === false) {
      return false;
    }

    // Feature filters
    if (filter.realAle && !hasFeature(bar, 'real_ale')) {
      return false;
    }
    if (filter.realFire && !hasFeature(bar, 'real_fire')) {
      return false;
    }
    if (filter.dog && !hasFeature(bar, 'dog')) {
      return false;
    }
    if (filter.wheelchair && !hasFeature(bar, 'wheelchair')) {
      return false;
    }
    if (filter.garden && !hasFeature(bar, 'garden')) {
      return false;
    }
    if (filter.food && !hasFeature(bar, 'food')) {
      return false;
    }
    if (filter.craftBeer && !hasFeature(bar, 'craft_beer')) {
      return false;
    }
    if (filter.liveMusic && !hasFeature(bar, 'live_music')) {
      return false;
    }
    if (filter.quizNight && !hasFeature(bar, 'quiz_night')) {
      return false;
    }
    if (filter.boardGames && !hasFeature(bar, 'board_games')) {
      return false;
    }
    if (filter.sundayRoast && !hasFeature(bar, 'sunday_roast')) {
      return false;
    }
    if (filter.outdoorSeating && !hasFeature(bar, 'outdoor_seating')) {
      return false;
    }
    if (filter.dj && !hasFeature(bar, 'dj')) {
      return false;
    }
    if (filter.streetFood && !hasFeature(bar, 'street_food')) {
      return false;
    }
    if (filter.nightlife && !hasFeature(bar, 'nightlife')) {
      return false;
    }
    if (filter.cocktails && !hasFeature(bar, 'cocktails')) {
      return false;
    }

    return true;
  });
}

// --- Simple test/demo ---
if (require.main === module) {
  const bars: Bar[] = [
    {
      id: '1',
      name: 'The Dog Pub',
      location: { latitude: 0, longitude: 0 },
      address: '123 Main St',
      rating: 4.5,
      isOpen: true,
      placeId: 'abc',
      photos: [],
      priceLevel: 2,
      vicinity: 'Nearby',
      types: ['pub', 'bar'],
    },
    {
      id: '2',
      name: 'Cocktail Bar',
      location: { latitude: 0, longitude: 0 },
      address: '456 Side St',
      rating: 3.8,
      isOpen: false,
      placeId: 'def',
      photos: [],
      priceLevel: 3,
      vicinity: 'Nearby',
      types: ['bar'],
    },
  ];

  const filter: BarFilter = { type: 'pub', minRating: 4.0, openNow: true };
  const filtered = filterBars(bars, filter);
} 