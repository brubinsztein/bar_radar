import { Bar } from '../types';
import * as FileSystem from 'expo-file-system';

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
      amenity: csvVenue.type,
      opening_hours: csvVenue.opening_hours,
      features: csvVenue.features,  // Store the raw features string
      // Set boolean flags based on features
      real_ale: csvVenue.features.includes('real_ale'),
      real_fire: csvVenue.features.includes('fireplace'),
      dog: csvVenue.features.includes('dog_friendly'),
      wheelchair: csvVenue.features.includes('wheelchair'),
      garden: csvVenue.features.includes('garden'),
      food: csvVenue.features.includes('food'),
      craft_beer: csvVenue.features.includes('craft_beer'),
      live_music: csvVenue.features.includes('live_music'),
      quiz_night: csvVenue.features.includes('quiz_night'),
      board_games: csvVenue.features.includes('board_games'),
      sunday_roast: csvVenue.features.includes('sunday_roast'),
    },
    rating: 4.0, // Default rating
    priceLevel: 2, // Default price level
    isOpen: true, // Default to open
  };
}

export async function loadCSVVenues(): Promise<Bar[]> {
  try {
    // For now, use the sample data since we can't directly read the CSV file
    // TODO: Implement proper CSV file reading when we have a better solution
    return SAMPLE_VENUES.map(parseCSVVenue);
  } catch (error) {
    console.error('Error loading CSV venues:', error);
    return [];
  }
}

// Sample data for testing
const SAMPLE_VENUES: CSVVenue[] = [
  {
    name: "The Dove",
    latitude: "51.542123",
    longitude: "-0.076532",
    address: "24-28 Broadway Market, London",
    postcode: "E8 4QJ",
    phone: "2072753617",
    alternative_names: "Dove Freehouse",
    type: "pub",
    opening_hours: "Mo-Th 12:00-23:00; Fr-Sa 12:00-00:00; Su 12:00-22:30",
    website: "https://dovepubs.com",
    description: "Traditional pub with Belgian beer selection and outdoor seating",
    features: "garden,real_ale,craft_beer,dog_friendly,food"
  },
  {
    name: "The Pembury Tavern",
    latitude: "51.547123",
    longitude: "-0.055876",
    address: "90 Amhurst Road, London",
    postcode: "E8 1JH",
    phone: "2089850101",
    alternative_names: "The Pembury",
    type: "pub",
    opening_hours: "Mo-Th 12:00-23:00; Fr-Sa 12:00-00:00; Su 12:00-22:30",
    website: "https://pemburytavern.co.uk",
    description: "Spacious corner pub with craft beers and pizza",
    features: "craft_beer,food,board_games,live_music,quiz_night"
  },
  {
    name: "The Old Ship",
    latitude: "51.536789",
    longitude: "-0.062345",
    address: "2 Sylvester Path, London",
    postcode: "E8 1EN",
    phone: "2072541010",
    alternative_names: "The Ship",
    type: "pub",
    opening_hours: "Mo-Sa 12:00-23:00; Su 12:00-22:30",
    website: "https://theoldshipinn.co.uk",
    description: "Cozy traditional pub with fireplace and Sunday roasts",
    features: "real_ale,fireplace,sunday_roast,dog_friendly"
  },
  {
    name: "Night Tales",
    latitude: "51.538765",
    longitude: "-0.073421",
    address: "14 Bohemia Place, London",
    postcode: "E8 1DU",
    phone: "2071754321",
    alternative_names: "",
    type: "bar",
    opening_hours: "Th-Fr 18:00-00:00; Sa 14:00-00:00; Su 14:00-22:00",
    website: "https://nighttales.co.uk",
    description: "Vibrant bar and nightlife venue with outdoor space and DJs",
    features: "cocktails,outdoor_seating,dj,street_food,nightlife"
  },
  {
    name: "The Kenton",
    latitude: "51.551234",
    longitude: "-0.078901",
    address: "38 Kenton Road, London",
    postcode: "E9 7AB",
    phone: "2072543214",
    alternative_names: "",
    type: "pub",
    opening_hours: "Mo-Th 16:00-23:00; Fr-Sa 12:00-00:00; Su 12:00-22:30",
    website: "https://thekentonpub.co.uk",
    description: "Friendly neighborhood pub with quiz nights and local beers",
    features: "quiz_night,real_ale,live_music,dog_friendly"
  }
]; 