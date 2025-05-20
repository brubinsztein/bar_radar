import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function HeaderBar() {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.logo}>🍺</Text>
        <Text style={styles.title}>Bar Radar</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity style={styles.location}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>London, UK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B4EFF',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 12,
  },
  locationIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  locationText: {
    fontSize: 16,
    color: '#222',
  },
  menu: {
    backgroundColor: '#F5F8FF',
    borderRadius: 20,
    padding: 8,
  },
  menuIcon: {
    fontSize: 22,
    color: '#222',
  },
}); 