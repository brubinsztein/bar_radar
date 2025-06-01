# bar_radar

## Current Workflow & Backend Plan

### Current Prototyping Approach
- The app loads venue data from a CSV file on the client.
- Sun exposure is calculated via a local microservice (`sun-exposure-service`), which now also uses OpenWeatherMap for cloud cover.
- The app is optimized for rapid prototyping, but as the CSV grows, performance and scalability will become a concern.

### Venues Microservice (venues-service)
- A new Node.js/Express microservice (`venues-service`) loads venue data from a CSV file and exposes a `/venues` endpoint for location-based queries.
- This service is designed to be easily swapped to use Supabase/Postgres in the future.
- The app will connect to this service once the real v1 CSV is finalized.

### Why This Plan?
- Keeps prototyping fast and flexible.
- Prepares for a smooth transition to a scalable backend as data and features grow.
- Supabase will enable real-time updates, user submissions, and secure data management.

### How to Run the Current System
1. **Start the sun-exposure-service** (see `sun-exposure-service/README.md` for details).
2. **Start the venues-service** (see `venues-service/README.md` for details).
3. **Start the Expo app** from the project root:
   ```sh
   npm start
   ```
4. **.env setup:** Make sure your OpenWeatherMap API key is in `sun-exposure-service/.env`.

### Next Milestones
- [ ] Finalize the real v1 CSV with all required fields and metadata.
- [ ] Update the venues-service to use the new CSV and support richer queries.
- [ ] Connect the app to the venues-service for live venue data.
- [ ] Migrate venue data to Supabase/Postgres for persistent storage.
- [ ] Add endpoints for user-submitted data and real-time updates.
