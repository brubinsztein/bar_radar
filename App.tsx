import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/core/AppContext';
import { MainScreen } from './src/components/MainScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <MainScreen />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
