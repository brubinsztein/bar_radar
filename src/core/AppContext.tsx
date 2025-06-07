import React, { createContext, useContext, ReactNode, useRef, useEffect } from 'react';
import { useLocation } from '../hooks/useLocation';

interface AppContextType {
  location: ReturnType<typeof useLocation>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <AppContext.Provider value={{ location }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
} 