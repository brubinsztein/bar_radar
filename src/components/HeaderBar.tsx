import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function HeaderBar() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.logo}>🍺</Text>
        <Text style={styles.title}>Bar Radar</Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity 
          style={styles.location}
          onPress={() => setShowInfoModal(true)}
        >
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Hackney, UK</Text>
          <Ionicons name="information-circle-outline" size={18} color="#5B4EFF" style={styles.infoIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menu}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowInfoModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Currently in Beta</Text>
            <Text style={styles.modalText}>
              Bar Radar is currently available in Hackney only. We'll be launching across London soon!
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  infoIcon: {
    marginLeft: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B4EFF',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#5B4EFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 