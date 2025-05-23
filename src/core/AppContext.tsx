import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';
import { useBars } from '../hooks/useBars';
import { Bar } from '../types';

interface AppContextType {
  location: ReturnType<typeof useLocation>;
  bars: ReturnType<typeof useBars>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const bars = useBars();
  const lastLocationRef = useRef<string | null>(null);

  // Fetch bars when location changes (but not on every render)
  useEffect(() => {
    if (location.location) {
      const locString = `${location.location.coords.latitude},${location.location.coords.longitude}`;
      if (lastLocationRef.current !== locString) {
        lastLocationRef.current = locString;
        bars.fetchBars(
          location.location.coords.latitude,
          location.location.coords.longitude
        );
      }
    }
  }, [location.location]);

  return (
    <AppContext.Provider value={{ location, bars }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 