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
}

function isPub(bar: Bar): boolean {
  // Check Google types
  if (bar.types?.includes('pub')) return true;
  
  // Check OSM tags
  if (bar.osmTags?.amenity === 'pub') return true;
  
  // Check for pub-related terms in name (but not just 'bar')
  const pubTerms = ['pub', 'public house', 'tavern', 'inn', 'alehouse'];
  const name = bar.name.toLowerCase();
  if (pubTerms.some(term => name.includes(term))) return true;
  
  return false;
}

export function filterBars(bars: Bar[], filter: BarFilter): Bar[] {
  const filtered = bars.filter(bar => {
    // Always exclude restaurants
    if (bar.types?.includes('restaurant')) {
      return false;
    }
    // Type filter
    if (filter.type === 'pub' && !isPub(bar)) {
      return false;
    }
    if (filter.type === 'bar' && !bar.types.includes('bar')) {
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
    // OSM tags filters
    if (filter.realAle && !bar.osmTags?.real_ale) {
      return false;
    }
    if (filter.realFire && !bar.osmTags?.real_fire) {
      return false;
    }
    if (filter.dog && !bar.osmTags?.dog) {
      return false;
    }
    if (filter.wheelchair && !bar.osmTags?.wheelchair) {
      return false;
    }
    return true;
  });
  
  return filtered;
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