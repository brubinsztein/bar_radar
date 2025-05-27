import { Bar } from '../types';

interface CSVVenue {
  name: string;
  latitude: string;
  longitude: string;
  address: string;
  postcode: string;
  phone: string;
  alternative_names: string;
  type: string;
  opening_hours: string;
  website: string;
  description: string;
  features: string;
}

export function parseCSVVenue(csvVenue: CSVVenue): Bar {
  const features = csvVenue.features.split(',').filter(Boolean);
  
  return {
    id: `${csvVenue.name}-${csvVenue.postcode}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: csvVenue.name,
    location: {
      latitude: parseFloat(csvVenue.latitude),
      longitude: parseFloat(csvVenue.longitude),
    },
    address: csvVenue.address,
    placeId: `${csvVenue.name}-${csvVenue.postcode}`.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    photos: [],
    vicinity: csvVenue.address,
    types: [csvVenue.type],
    osmTags: {
      real_ale: features.includes('real_ale'),
      real_fire: features.includes('fireplace'),
      dog: features.includes('dog_friendly'),
      wheelchair: features.includes('wheelchair'),
      amenity: csvVenue.type,
      opening_hours: csvVenue.opening_hours,
    },
    rating: 4.0, // Default rating
    priceLevel: 2, // Default price level
    isOpen: true, // Default to open
  };
}

export async function loadCSVVenues(): Promise<Bar[]> {
  try {
    const response = await fetch('/docs/hackney_pubs_sample.csv');
    const csvText = await response.text();
    
    // Parse CSV
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const venues: Bar[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',');
      const venue: CSVVenue = {
        name: values[0],
        latitude: values[1],
        longitude: values[2],
        address: values[3],
        postcode: values[4],
        phone: values[5],
        alternative_names: values[6],
        type: values[7],
        opening_hours: values[8],
        website: values[9],
        description: values[10],
        features: values[11],
      };
      
      venues.push(parseCSVVenue(venue));
    }
    
    return venues;
  } catch (error) {
    console.error('Error loading CSV venues:', error);
    return [];
  }
} 