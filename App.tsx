import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider } from '@gorhom/portal';
import { AppProvider } from './src/core/AppContext';
import { MainScreen } from './src/components/MainScreen';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'Tanker': require('./assets/fonts/Tanker-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5B4EFF" />
      </View>
    );
  }

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
