import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider } from '@gorhom/portal';
import { AppProvider } from './src/core/AppContext';
import { MainScreen } from './src/components/MainScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PortalProvider>
          <AppProvider>
            <MainScreen />
          </AppProvider>
        </PortalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
