import { Bar } from '../types';

export interface BarFilter {
  type?: string;         // e.g. "bar", "pub"
  minRating?: number;    // e.g. 4.0
  maxPriceLevel?: number; // e.g. 2
  openNow?: boolean;
}

export function filterBars(bars: Bar[], filter: BarFilter): Bar[] {
  return bars.filter(bar => {
    // Type filter
    if (filter.type && !bar.types.includes(filter.type)) return false;
    // Rating filter
    if (filter.minRating !== undefined && (bar.rating ?? 0) < filter.minRating) return false;
    // Price level filter
    if (filter.maxPriceLevel !== undefined && (bar.priceLevel ?? 99) > filter.maxPriceLevel) return false;
    // Open now filter
    if (filter.openNow && bar.isOpen === false) return false;
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
  console.log('Filtered bars:', filtered);
} 