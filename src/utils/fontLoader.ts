import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'Tanker': require('../../assets/Tanker_Complete/Fonts/WEB/fonts/Tanker-Regular.ttf'),
  });
}; 