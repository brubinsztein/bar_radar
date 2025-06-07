import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';

export function HeaderBar() {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.centerGroup}>
          <Image source={require('../../assets/bar-radar-logo.png')} style={styles.logoImg} />
          <View>
            <Text style={styles.logoLabel}>Bar</Text>
            <Text style={styles.logoLabel}>Radar</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.location}
          onPress={() => setShowInfoModal(true)}
        >
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.locationText}>Hackney, UK</Text>
          <Ionicons name="information-circle-outline" size={18} color="#5B4EFF" style={styles.infoIcon} />
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
            <Text style={styles.modalLabel}>
              Bar Radar is currently available in Hackney only. We'll be launching across London soon!
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  logoImg: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginRight: 3,
  },
  logoLabel: {
    fontSize: 24,
    color: '#5B4EFF',
    fontFamily: 'Tanker',
    textAlign: 'left',
    lineHeight: 28,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 16,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#222',
    fontFamily: 'Tanker',
  },
  infoIcon: {
    marginLeft: 4,
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
    fontSize: 16,
    color: '#222',
    fontFamily: 'Tanker',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 16,
    color: '#5B4EFF',
    fontFamily: 'Tanker',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
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
    fontFamily: 'Tanker',
    textAlign: 'center',
  },
}); 