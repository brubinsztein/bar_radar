# Venues Service (Prototype)

This microservice will serve venue (bar/pub) data for the Bar Radar app.

## Purpose
- Load venue data from a CSV file (initially).
- Expose a `/venues` endpoint for location-based queries (e.g., `/venues?lat=...&lng=...&radius=...`).
- Designed to be easily swapped to use Supabase/Postgres in the future.

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the service:
   ```sh
   node index.js
   ```

## Roadmap
- [x] Load venues from CSV on startup
- [x] Expose `/venues` endpoint for location-based queries
- [ ] Add filtering and pagination
- [ ] Support richer metadata as CSV grows
- [ ] Migrate to Supabase/Postgres for persistent storage
- [ ] Add endpoints for user-submitted data

## CSV Format
- Start with `docs/hackney_pubs_sample.csv` or your real CSV as the data source.
- Update the loader as the schema evolves.

## Future
- When ready, migrate venue data to Supabase and update this service to query the database instead of the CSV.
- Add authentication, user submissions, and real-time updates as needed. 