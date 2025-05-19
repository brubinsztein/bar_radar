declare module '@env' {
  export const GOOGLE_PLACES_API_KEY: string;
}

// Extend the NodeJS namespace to include our env variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_PLACES_API_KEY: string;
    }
  }
} 