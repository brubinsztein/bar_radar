const express = require('express');
const SunCalc = require('suncalc');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post('/sun-exposure', (req, res) => {
  const { latitude, longitude, datetime } = req.body;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'latitude and longitude are required and must be numbers.' });
  }
  const date = datetime ? new Date(datetime) : new Date();
  const sunPos = SunCalc.getPosition(date, latitude, longitude);
  const inSun = sunPos.altitude > 0; // Above horizon
  res.json({
    inSun,
    sunAzimuth: (sunPos.azimuth * 180 / Math.PI).toFixed(2),
    sunElevation: (sunPos.altitude * 180 / Math.PI).toFixed(2)
  });
});

app.get('/', (req, res) => {
  res.send('Sun Exposure Microservice is running. POST to /sun-exposure');
});

app.listen(PORT, () => {
  console.log(`Sun Exposure Microservice running on port ${PORT}`);
}); 