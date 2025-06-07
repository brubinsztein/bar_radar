import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  text: {
    fontFamily: 'tanker-regular.ttf',
  },
});

// Export a function to merge styles with the global font
export const withGlobalFont = (style: any) => ({
  ...globalStyles.text,
  ...style,
}); 