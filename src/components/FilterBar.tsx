import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = [
  { key: 'deals', label: 'Deals', emoji: '🍻' },
  { key: 'outside', label: 'Outside', emoji: '☂️' },
  { key: 'garden', label: 'Garden', emoji: '🌳' },
  { key: 'pool', label: 'Pool', emoji: '🎱' },
];

export function FilterBar({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: '#fff' }}>
      <View style={[styles.container, { paddingBottom: insets.bottom }] }>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filter, selected === f.key && styles.selected]}
            onPress={() => onSelect(f.key)}
          >
            <Text style={styles.emoji}>{f.emoji}</Text>
            <Text style={[styles.label, selected === f.key && styles.selectedLabel]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
  },
  selected: {
    backgroundColor: '#E6E9FF',
  },
  emoji: {
    fontSize: 22,
    marginRight: 6,
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
  selectedLabel: {
    color: '#5B4EFF',
    fontWeight: 'bold',
  },
}); 