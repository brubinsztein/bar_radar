# bar_radar

## Current Workflow & Backend Plan

### Current Prototyping Approach
- The app loads venue data from a CSV file on the client.
- Sun exposure is calculated via a local microservice (`sun-exposure-service`), which now also uses OpenWeatherMap for cloud cover.
- The app is optimized for rapid prototyping, but as the CSV grows, performance and scalability will become a concern.

### Next Steps: Microservice Backend
- **Short-term:** Continue prototyping with CSV, but optimize loading (progressive, async, defer non-essential work).
- **Mid-term:** Build a Node.js/Express microservice that:
  - Loads the CSV into memory or a database.
  - Exposes a `/venues` endpoint for location-based queries.
  - (Later) Moves to Supabase/Postgres for persistent, scalable storage.
- **Long-term:** Support user-submitted data, richer metadata, and advanced queries via Supabase.

### Why This Plan?
- Keeps prototyping fast and flexible.
- Prepares for a smooth transition to a scalable backend as data and features grow.
- Supabase will enable real-time updates, user submissions, and secure data management.

### How to Run the Current System
1. **Start the sun-exposure-service** (see `sun-exposure-service/README.md` for details).
2. **Start the Expo app** from the project root:
   ```sh
   npm start
   ```
3. **.env setup:** Make sure your OpenWeatherMap API key is in `sun-exposure-service/.env`.

### Next Milestones
- [ ] Refactor CSV loading for progressive, location-based loading.
- [ ] Scaffold the venues microservice (Node.js/Express).
- [ ] Design and migrate to Supabase schema.
- [ ] Add user-submitted data support.
