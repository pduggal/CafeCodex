import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { CITY_GUIDES, CAFES } from '../data/cafes';

export default function CityGuidesScreen({ navigation }) {
  const cities = [...new Set(CITY_GUIDES.map((g) => g.city))];

  const getCafe = (id) => CAFES.find((c) => c.id === id);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>City Guides</Text>
          <Text style={styles.subtitle}>
            Curated lists for every trip
          </Text>
        </View>

        {/* Cities */}
        {cities.map((city) => {
          const guides = CITY_GUIDES.filter((g) => g.city === city);
          return (
            <View key={city} style={styles.citySection}>
              <Text style={styles.cityName}>{city}</Text>

              {guides.map((guide) => (
                <View key={guide.id} style={styles.guideCard}>
                  {/* Guide header */}
                  <View style={styles.guideHeader}>
                    <Text style={styles.guideEmoji}>{guide.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.guideTitle}>{guide.title}</Text>
                      <Text style={styles.guideMeta}>
                        Pallavi's rating: {guide.curator_rating}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.guideDesc}>{guide.description}</Text>

                  {/* Cafe list */}
                  {guide.cafe_ids.map((cafeId, index) => {
                    const cafe = getCafe(cafeId);
                    if (!cafe) return null;
                    return (
                      <TouchableOpacity
                        key={cafeId}
                        style={styles.guideListItem}
                        onPress={() =>
                          navigation.navigate('Discover', {
                            screen: 'CafeDetail',
                            params: { cafe },
                          })
                        }
                      >
                        <View style={styles.guideRank}>
                          <Text style={styles.guideRankText}>{index + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.guideListName}>{cafe.name}</Text>
                          <Text style={styles.guideListSub}>
                            {cafe.neighborhood}
                            {cafe.curator_notes?.what_to_order
                              ? ` · ${cafe.curator_notes.what_to_order.split(',')[0]}`
                              : ''}
                          </Text>
                        </View>
                        {cafe.curator_pick && (
                          <Text style={styles.pickStar}>✦</Text>
                        )}
                        <Ionicons
                          name="chevron-forward"
                          size={14}
                          color={Colors.textMuted}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        })}

        {/* Coming soon */}
        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonTitle}>More cities coming soon</Text>
          <Text style={styles.comingSoonSub}>
            Los Angeles · Chicago · Tokyo · Bangalore
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
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
    paddingBottom: 20,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 3,
  },
  citySection: {
    marginBottom: 28,
  },
  cityName: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  guideCard: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 12,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  guideEmoji: {
    fontSize: 28,
  },
  guideTitle: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  guideMeta: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  guideDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  guideListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  guideRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(201,151,58,0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideRankText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  guideListName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  guideListSub: {
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  pickStar: {
    color: Colors.primary,
    fontSize: 12,
    marginRight: 4,
  },
  comingSoon: {
    marginHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
  },
  comingSoonTitle: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  comingSoonSub: {
    color: Colors.tabBarInactive,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
