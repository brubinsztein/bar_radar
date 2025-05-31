const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csvParse = require('csv-parse');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
const CSV_PATH = path.join(__dirname, '../docs/hackney_pubs_sample.csv');

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

// Load CSV on startup
function loadVenuesFromCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_PATH)
      .pipe(csvParse.parse({ columns: true, trim: true }))
      .on('data', (row) => {
        // Parse lat/lng as numbers
        row.latitude = parseFloat(row.latitude);
        row.longitude = parseFloat(row.longitude);
        results.push(row);
      })
      .on('end', () => {
        venues = results;
        console.log(`Loaded ${venues.length} venues from CSV.`);
        resolve();
      })
      .on('error', reject);
  });
}

app.get('/venues', (req, res) => {
  const { lat, lng, radius } = req.query;
  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'lat, lng, and radius query params are required' });
  }
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = parseFloat(radius);
  const filtered = venues.filter(v =>
    haversine(latNum, lngNum, v.latitude, v.longitude) <= radiusNum
  );
  res.json({ venues: filtered });
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