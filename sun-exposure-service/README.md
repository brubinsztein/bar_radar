# Sun Exposure Service

This microservice provides sun exposure data for venues in the Bar Radar app.

## How to Start the Service

If you ever restart your computer or close your terminals, follow these steps:

1. **Compile TypeScript:**
   ```sh
   npx tsc
   ```
   This will compile the TypeScript source files in `src/` to JavaScript in `dist/`.

2. **Start the API Service:**
   ```sh
   npm start
   ```
   This will run the compiled JavaScript server (`dist/index.js`) on port 3000.

3. **Start the Expo App (in a separate terminal):**
   ```sh
   cd .. # Go to the main project directory if you're not already there
   npm start
   ```
   This will start the Expo development server for your React Native app.

---

- Make sure your phone and computer are on the same Wi-Fi network.
- The Bar Radar app should use your computer's local IP address (e.g., `http://192.168.0.6:3000/sun-exposure`) to access this service.

---

**Troubleshooting:**
- If you see `TypeError: Network request failed` in the app, make sure the service is running and accessible from your device.
- If you change any TypeScript files, re-run `npx tsc` before restarting the service.

## Features
- Calculates sun position (azimuth and elevation) for any latitude/longitude and time
- Returns whether the sun is above the horizon ("in the sun")
- Simple REST API
- CORS enabled for easy integration

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the service:
   ```bash
   node index.js
   ```
   The service will run on port 4000 by default (or set `PORT` in a `.env` file).

## API

### POST `/sun-exposure`
**Request Body:**
```json
{
  "latitude": 51.5432,
  "longitude": -0.0557,
  "datetime": "2024-06-20T17:00:00Z" // optional, defaults to now
}
```

**Response:**
```json
{
  "inSun": true,
  "sunAzimuth": 270.5,
  "sunElevation": 35.2
}
```
- `inSun`: `true` if the sun is above the horizon at the given time/location
- `sunAzimuth`: Sun's compass direction in degrees
- `sunElevation`: Sun's height above the horizon in degrees

### GET `/`
Returns a simple status message.

## Environment Variables
- `PORT` (optional): Port to run the service on (default: 4000)

## License
MIT 