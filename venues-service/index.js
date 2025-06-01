const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const CSV_PATH = path.join(__dirname, '../assets/bar_radar_hackney_venues.csv');

const app = express();
app.use(cors());

let venues = [];

// Helper: Haversine formula for distance in meters
function haversine(lat1, lon1, lat2, lon2) {
  const toRad = x => (x * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fields to exclude from API response (normalize to trimmed, lowercase)
const EXCLUDE_FIELDS = new Set([
  'reviews_tags', 'reviews', 'plus_code', 'category', 'subtypes', 'about', 'photo', 'description', 'range', 'logo', ' logo'
].map(f => f.trim().toLowerCase()));

// Load CSV on startup
function loadVenuesFromCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    let rowIndex = 0;
    fs.createReadStream(CSV_PATH)
      .pipe(csvParse.parse({ columns: true, trim: true }))
      .on('data', (row) => {
        // Parse lat/lng as numbers
        const latitude = parseFloat(row.latitude);
        const longitude = parseFloat(row.longitude);
        
        // Normalize features and create osmTags structure
        const features = (row.verified_features || '')
          .split(',')
          .map(f => f.trim().replace(/_/g, ' '))
          .filter(f => f.length > 0);
        
        // Create the venue object with the correct structure
        const venue = {
          id: String(rowIndex++),
          name: row.name,
          location: { latitude, longitude },
          address: row.full_address,
          placeId: row.place_id || `venue-${rowIndex}`,
          photos: [],
          vicinity: row.full_address,
          types: [row.venue_type_verified ? row.venue_type_verified.toLowerCase() : ''],
          osmTags: {
            features: features.join(','),
            real_ale: features.includes('real ale'),
            real_fire: features.includes('fireplace'),
            dog: features.includes('dog friendly'),
            wheelchair: features.includes('wheelchair'),
            garden: features.includes('garden'),
            food: features.includes('food'),
            craft_beer: features.includes('craft beer'),
            live_music: features.includes('live music'),
            quiz_night: features.includes('quiz night'),
            board_games: features.includes('board games'),
            sunday_roast: features.includes('sunday roast'),
            outdoor_seating: features.includes('outdoor seating'),
            dj: features.includes('dj'),
            street_food: features.includes('street food'),
            nightlife: features.includes('nightlife'),
            cocktails: features.includes('cocktails'),
            amenity: row.venue_type_verified ? row.venue_type_verified.toLowerCase() : '',
            opening_hours: row.working_hours
          },
          rating: parseFloat(row.rating) || undefined,
          isOpen: true, // Default to open
          priceLevel: 2 // Default price level
        };
        
        results.push(venue);
      })
      .on('end', () => {
        venues = results;
        console.log(`Loaded ${venues.length} venues from CSV.`);
        console.log('Raw venue keys:', Object.keys(venues[0]));
        resolve();
      })
      .on('error', reject);
  });
}

// Helper: filter out excluded fields
function filterVenueFields(venue) {
  // Don't filter anything - we need all fields for the frontend
  return venue;
}

// /venues endpoint with location, type, and feature filtering
app.get('/venues', (req, res) => {
  console.log('First venue in venues array:', venues[0]);
  const { lat, lng, radius = 2000 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing required parameters: lat, lng' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseFloat(radius);

  const results = venues
    .filter(v => {
      const venueLat = v.location.latitude;
      const venueLng = v.location.longitude;
      
      if (isNaN(venueLat) || isNaN(venueLng)) {
        console.warn(`Invalid coordinates for venue: ${v.name}`);
        return false;
      }

      const distance = haversine(userLat, userLng, venueLat, venueLng);
      return distance <= searchRadius;
    });

  // Log a sample venue for debugging
  console.log('Sample venue data:', JSON.stringify(results[0], null, 2));

  res.json({ venues: results });
});

// /venues/:id endpoint for details
app.get('/venues/:id', (req, res) => {
  const venue = venues.find(v => v.id === req.params.id);
  if (!venue) {
    return res.status(404).json({ error: 'Venue not found' });
  }
  res.json(filterVenueFields(venue));
});

app.get('/', (req, res) => {
  res.send('Venues Service is running. Use /venues?lat=...&lng=...&radius=...');
});

loadVenuesFromCSV().then(() => {
  app.listen(PORT, () => {
    console.log(`Venues Service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to load venues:', err);
  process.exit(1);
}); 