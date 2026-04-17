import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useCafes } from '../context/CafeContext';

const { width, height } = Dimensions.get('window');

export default function MapScreen({ navigation }) {
  const { cafes, selectedCity } = useCafes();
  const [selectedCafe, setSelectedCafe] = useState(null);

  const visibleCafes = cafes.filter(
    (c) => selectedCity === 'All' || c.city === selectedCity
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.subtitle}>{visibleCafes.length} spots</Text>
      </View>

      {/* Map placeholder — replace with MapView when Google Maps key is ready */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={Colors.primary} style={{ opacity: 0.5 }} />
          <Text style={styles.mapPlaceholderTitle}>Map View</Text>
          <Text style={styles.mapPlaceholderSub}>
            Add your Google Maps API key to{'\n'}app.json to enable live maps
          </Text>

          {/* Simulated pins */}
          <View style={styles.pinGrid}>
            {visibleCafes.map((cafe, index) => (
              <TouchableOpacity
                key={cafe.id}
                style={[
                  styles.simulatedPin,
                  selectedCafe?.id === cafe.id && styles.simulatedPinActive,
                ]}
                onPress={() => setSelectedCafe(cafe === selectedCafe ? null : cafe)}
              >
                <Text style={styles.pinEmoji}>
                  {cafe.curator_pick ? '✦' : '•'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom sheet — selected cafe */}
        {selectedCafe && (
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetContent}>
              <View style={{ flex: 1 }}>
                <View style={styles.sheetNameRow}>
                  <Text style={styles.sheetName}>{selectedCafe.name}</Text>
                  {selectedCafe.curator_pick && (
                    <View style={styles.curatorBadge}>
                      <Text style={styles.curatorBadgeText}>✦ Pick</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.sheetLocation}>
                  {selectedCafe.neighborhood} · {selectedCafe.city}
                </Text>
                {selectedCafe.curator_notes?.what_to_order && (
                  <Text style={styles.sheetOrder} numberOfLines={1}>
                    Order: {selectedCafe.curator_notes.what_to_order}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.sheetBtn}
                onPress={() =>
                  navigation.navigate('Discover', {
                    screen: 'CafeDetail',
                    params: { cafe: selectedCafe },
                  })
                }
              >
                <Ionicons name="arrow-forward" size={18} color={Colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#120A06',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapPlaceholderTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  mapPlaceholderSub: {
    color: Colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  pinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  simulatedPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulatedPinActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pinEmoji: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: Colors.cardBorder,
    paddingBottom: 24,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.cardBorder,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  sheetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  sheetNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  sheetName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  curatorBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  curatorBadgeText: {
    color: Colors.background,
    fontSize: 9,
    fontWeight: '700',
  },
  sheetLocation: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  sheetOrder: {
    color: Colors.cream,
    fontSize: 12,
    opacity: 0.75,
    fontStyle: 'italic',
  },
  sheetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
