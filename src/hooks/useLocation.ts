import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { MAP_CONFIG } from '../config/constants';

interface UseLocationResult {
  location: Location.LocationObject | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<void>;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    console.log('[useLocation] State changed', { location, error, isLoading });
  }, [location, error, isLoading]);

  return {
    location,
    error,
    isLoading,
    requestPermission,
  };
} 