import { useState, useCallback } from 'react';
import { Bar, BarSearchResponse } from '../types';
import { PlacesApiService } from '../services/api';
import { MAP_CONFIG } from '../config/constants';

interface UseBarsResult {
  bars: Bar[];
  isLoading: boolean;
  error: string | null;
  fetchBars: (latitude: number, longitude: number) => Promise<void>;
  selectedBar: Bar | null;
  setSelectedBar: (bar: Bar | null) => void;
}

export function useBars(): UseBarsResult {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  const fetchBars = useCallback(async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await PlacesApiService.searchNearbyBars(
        latitude,
        longitude,
        MAP_CONFIG.SEARCH_RADIUS
      );
      
      const limitedBars = response.bars.slice(0, MAP_CONFIG.MAX_INITIAL_BARS);
      setBars(limitedBars);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bars');
      setBars([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    bars,
    isLoading,
    error,
    fetchBars,
    selectedBar,
    setSelectedBar,
  };
} 