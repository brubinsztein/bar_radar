import { filterBars, BarFilter } from './filterBars';
import { Bar } from '../types';

describe('filterBars', () => {
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

  it('filters by type, rating, and openNow', () => {
    const filter: BarFilter = { type: 'pub', minRating: 4.0, openNow: true };
    const filtered = filterBars(bars, filter);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('The Dog Pub');
  });

  it('filters by maxPriceLevel', () => {
    const filter: BarFilter = { maxPriceLevel: 2 };
    const filtered = filterBars(bars, filter);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('The Dog Pub');
  });

  it('returns all bars if no filter is set', () => {
    const filter: BarFilter = {};
    const filtered = filterBars(bars, filter);
    expect(filtered).toHaveLength(2);
  });
}); 