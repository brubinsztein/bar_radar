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
  sunny?: boolean;
}

function isPub(bar: Bar): boolean {
  return (bar.types?.some(t => t.toLowerCase() === 'pub')) || (bar.osmTags?.amenity?.toLowerCase() === 'pub');
}

function isBar(bar: Bar): boolean {
  return (bar.types?.some(t => t.toLowerCase() === 'bar')) || (bar.osmTags?.amenity?.toLowerCase() === 'bar');
}

function hasFeature(bar: Bar, feature: string): boolean {
  if (!bar.osmTags) return false;
  
  // Get the features string from osmTags
  const featuresStr = bar.osmTags.features;
  if (!featuresStr) return false;

  // Split the features string into an array and check if it includes the feature
  const features = featuresStr.split(',').map(f => f.trim());
  
  // Map filter keys to human-readable feature names from the API
  const featureMap: Record<string, string> = {
    realAle: 'Real ale',
    realFire: 'Fireplace',
    dog: 'Dog-friendly',
    wheelchair: 'Wheelchair',
    garden: 'Garden',
    food: 'Food menu',
    craftBeer: 'Craft beer',
    liveMusic: 'Live music',
    quizNight: 'Trivia night',
    boardGames: 'Board games',
    sundayRoast: 'Sunday roast',
    outdoorSeating: 'Outdoor seating',
    dj: 'DJ',
    streetFood: 'Street food',
    nightlife: 'Nightlife',
    cocktails: 'Cocktails'
  };

  const apiFeature = featureMap[feature];
  return apiFeature ? features.includes(apiFeature) : false;
}

// Utility: Check if a venue is open now based on OSM opening_hours string
function isOpenNow(openingHours: string | undefined): boolean {
  if (!openingHours) return false;
  // Get current day and time
  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = dayNames[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Split periods by |
  const periods = openingHours.split('|');
  for (const period of periods) {
    const [day, open, close] = period.split(',').map(s => s.trim());
    if (!day || !open || !close) continue;
    if (day !== today) continue;
    // Parse open/close times (e.g., 4PM, 11PM, 12AM, 10:30PM, 11pm)
    const parseTime = (t: string) => {
      let [h, m] = t.replace(/am|pm|AM|PM/gi, '').split(':');
      let hour = parseInt(h);
      let minute = m ? parseInt(m) : 0;
      if (/pm|PM/i.test(t) && hour < 12) hour += 12;
      if (/am|AM/i.test(t) && hour === 12) hour = 0;
      if (/am|AM|pm|PM/i.test(t) === false && t.toLowerCase().includes('p') && hour < 12) hour += 12;
      return hour * 60 + minute;
    };
    const openMins = parseTime(open);
    const closeMins = parseTime(close);
    // Handle venues that close after midnight
    if (closeMins < openMins) {
      if (currentMinutes >= openMins || currentMinutes < closeMins) return true;
    } else {
      if (currentMinutes >= openMins && currentMinutes < closeMins) return true;
    }
  }
  return false;
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
    if (filter.openNow) {
      const openingHours = bar.osmTags?.opening_hours;
      if (!isOpenNow(openingHours)) return false;
    }

    // Feature filters
    if (filter.realAle && !hasFeature(bar, 'realAle')) return false;
    if (filter.realFire && !hasFeature(bar, 'realFire')) return false;
    if (filter.dog && !hasFeature(bar, 'dog')) return false;
    if (filter.wheelchair && !hasFeature(bar, 'wheelchair')) return false;
    // Garden = Outdoor seating
    if (filter.garden && !hasFeature(bar, 'Outdoor seating')) return false;
    if (filter.food && !hasFeature(bar, 'food')) {
      return false;
    }
    if (filter.craftBeer && !hasFeature(bar, 'craftBeer')) {
      return false;
    }
    if (filter.liveMusic && !hasFeature(bar, 'liveMusic')) {
      return false;
    }
    if (filter.quizNight && !hasFeature(bar, 'quizNight')) {
      return false;
    }
    if (filter.boardGames && !hasFeature(bar, 'boardGames')) {
      return false;
    }
    if (filter.sundayRoast && !hasFeature(bar, 'sundayRoast')) {
      return false;
    }
    if (filter.outdoorSeating && !hasFeature(bar, 'outdoorSeating')) {
      return false;
    }
    if (filter.dj && !hasFeature(bar, 'dj')) {
      return false;
    }
    if (filter.streetFood && !hasFeature(bar, 'streetFood')) {
      return false;
    }
    if (filter.nightlife && !hasFeature(bar, 'nightlife')) {
      return false;
    }
    if (filter.cocktails && !hasFeature(bar, 'cocktails')) {
      return false;
    }

    // Sunny filter
    if (filter.sunny && !bar.isInSun) {
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