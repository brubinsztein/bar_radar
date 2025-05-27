import { useState, useCallback, useEffect } from 'react';
import { Bar } from '../types';
import { MAP_CONFIG } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAreaKey } from '../utils/areaKey';
import { loadCSVVenues } from '../services/csvService';

interface UseBarsResult {
  bars: Bar[];
  isLoading: boolean;
  error: string | null;
  fetchBars: (latitude: number, longitude: number) => Promise<void>;
  selectedBar: Bar | null;
  setSelectedBar: (bar: Bar | null) => void;
}

const MAX_AREAS = 7;
const AREA_LIST_KEY = 'bar_data:areas';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useBars(): UseBarsResult {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  const fetchBars = useCallback(async (latitude: number, longitude: number) => {
    const areaKey = getAreaKey(latitude, longitude);
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useBars] Loading CSV venues...');
      const csvBars = await loadCSVVenues();
      console.log('[useBars] Loaded CSV venues:', csvBars.length);

      setBars(csvBars);

      // Save to AsyncStorage per area
      await AsyncStorage.setItem(areaKey, JSON.stringify({
        bars: csvBars,
        timestamp: Date.now(),
      }));

      // Update area list (LRU)
      let areaList: string[] = [];
      const areaListRaw = await AsyncStorage.getItem(AREA_LIST_KEY);
      if (areaListRaw) {
        areaList = JSON.parse(areaListRaw);
      }
      // Move areaKey to front
      areaList = [areaKey, ...areaList.filter(k => k !== areaKey)];
      // Remove old if over limit
      if (areaList.length > MAX_AREAS) {
        const toRemove = areaList.slice(MAX_AREAS);
        for (const key of toRemove) {
          await AsyncStorage.removeItem(key);
        }
        areaList = areaList.slice(0, MAX_AREAS);
      }
      await AsyncStorage.setItem(AREA_LIST_KEY, JSON.stringify(areaList));
    } catch (err) {
      console.error('[useBars] Error in fetchBars:', err);
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