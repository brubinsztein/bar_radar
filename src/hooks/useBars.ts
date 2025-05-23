import { useState, useCallback, useEffect } from 'react';
import { Bar } from '../types';
import { PlacesApiService } from '../services/api';
import { MAP_CONFIG } from '../config/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAreaKey } from '../utils/areaKey';
import { fetchOSMData, enrichBarWithOSMData, osmNodeToBar } from '../services/osmService';

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

function areBarsDuplicate(barA: Bar, barB: Bar): boolean {
  // Check distance (within ~20 meters)
  const latDiff = barA.location.latitude - barB.location.latitude;
  const lonDiff = barA.location.longitude - barB.location.longitude;
  const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111139; // rough meters
  if (distance > 0.02) return false; // ~20 meters

  // Check name similarity (case-insensitive, ignore punctuation)
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return normalize(barA.name) === normalize(barB.name);
}

export function useBars(): UseBarsResult {
  const [bars, setBars] = useState<Bar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  // Load last used area on mount
  useEffect(() => {
    const loadLastArea = async () => {
      try {
        const areaListRaw = await AsyncStorage.getItem(AREA_LIST_KEY);
        if (areaListRaw) {
          const areaList = JSON.parse(areaListRaw);
          if (areaList.length > 0) {
            const lastKey = areaList[0];
            const savedData = await AsyncStorage.getItem(lastKey);
            if (savedData) {
              const { bars: savedBars, timestamp } = JSON.parse(savedData);
              if (Date.now() - timestamp < MAX_AGE_MS) {
                setBars(savedBars);
              } else {
                await AsyncStorage.removeItem(lastKey);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading saved bar data:', err);
      }
    };
    loadLastArea();
  }, []);

  const fetchBars = useCallback(async (latitude: number, longitude: number) => {
    const areaKey = getAreaKey(latitude, longitude);
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useBars] Fetching bars from Places API...');
      const googleBars = await PlacesApiService.searchNearbyBarsAllPages(
        latitude,
        longitude,
        MAP_CONFIG.SEARCH_RADIUS
      );

      console.log('[useBars] Fetching OSM data...');
      const osmData = await fetchOSMData(latitude, longitude, 0.01);
      console.log('[useBars] OSM data fetched:', osmData ? 'success' : 'null');
      // Enrich Google bars with OSM tags if matched
      const enrichedGoogleBars = googleBars.map((bar: Bar) => enrichBarWithOSMData(bar, osmData));
      // Convert OSM nodes to Bar objects
      const osmBars: Bar[] = (osmData?.elements || [])
        .filter((node: any) => node.tags && node.tags.name)
        .map(osmNodeToBar)
        .filter((bar: Bar | null): bar is Bar => bar !== null);

      // Merge and deduplicate
      const allBars: Bar[] = [...enrichedGoogleBars];
      for (const osmBar of osmBars) {
        const duplicate = enrichedGoogleBars.some((gBar: Bar) => areBarsDuplicate(gBar, osmBar));
        if (!duplicate) {
          allBars.push(osmBar);
        }
      }
      console.log('[useBars] Total bars after merging:', allBars.length);
      allBars.slice(0, 3).forEach((bar, i) => {
        console.log(`[DEBUG BAR ${i}]`, JSON.stringify(bar, null, 2));
      });
      if (allBars.length > 0) {
        console.log('[DEBUG OSM TAGS]', JSON.stringify(allBars[0].osmTags, null, 2));
        console.log('[DEBUG OSM TAGS TYPE]', typeof allBars[0].osmTags);
      }
      allBars
        .filter(bar => bar.name && bar.name.toLowerCase().includes('howl'))
        .forEach(bar => {
          console.log('[DEBUG HOW AT THE MOON]', JSON.stringify(bar, null, 2));
        });

      // Visual divider for filter debug logs
      console.log('==== FILTER DEBUG START ====');
      allBars.slice(0, 3).forEach((bar, i) => {
        console.log(`[FILTER DEBUG ${i}]`, {
          name: bar.name,
          types: bar.types,
          osmTags: bar.osmTags,
          rating: bar.rating,
          priceLevel: bar.priceLevel,
          isOpen: bar.isOpen
        });
      });
      console.log('==== FILTER DEBUG END ====');

      // Log all unique osmTags keys and types
      const allOsmTagKeys = new Set<string>();
      const allTypes = new Set<string>();
      allBars.forEach(bar => {
        if (bar.osmTags) {
          Object.keys(bar.osmTags).forEach(key => allOsmTagKeys.add(key));
        }
        if (bar.types) {
          bar.types.forEach(type => allTypes.add(type));
        }
      });
      console.log('[DEBUG ALL OSM TAG KEYS]', Array.from(allOsmTagKeys));
      console.log('[DEBUG ALL TYPES]', Array.from(allTypes));

      setBars(allBars);

      // Save to AsyncStorage per area
      await AsyncStorage.setItem(areaKey, JSON.stringify({
        bars: allBars,
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