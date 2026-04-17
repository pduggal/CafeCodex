import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { VIBE_TAGS } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

export default function CafeDetailScreen({ route, navigation }) {
  const { cafe } = route.params;
  const { isSaved, toggleSaved, isVisited, toggleVisited } = useCafes();
  const saved = isSaved(cafe.id);
  const visited = isVisited(cafe.id);

  const vibeLabel = (tagId) => {
    const found = VIBE_TAGS.find((t) => t.id === tagId);
    return found ? `${found.emoji} ${found.label}` : tagId;
  };

  const openInstagram = () => {
    if (cafe.instagram_handle) {
      Linking.openURL(`https://instagram.com/${cafe.instagram_handle}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={Colors.white} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>☕</Text>
          {cafe.curator_pick && (
            <View style={styles.curatorBadge}>
              <Text style={styles.curatorBadgeText}>✦ Pallavi's Pick</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Name + rating */}
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{cafe.name}</Text>
              <Text style={styles.location}>
                {cafe.neighborhood} · {cafe.city}
              </Text>
            </View>
            {cafe.curator_rating && (
              <View style={styles.ratingBox}>
                <Text style={styles.ratingNumber}>{cafe.curator_rating}</Text>
                <Text style={styles.ratingStar}>/5</Text>
              </View>
            )}
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, saved && styles.actionBtnActive]}
              onPress={() => toggleSaved(cafe.id)}
            >
              <Ionicons
                name={saved ? 'heart' : 'heart-outline'}
                size={16}
                color={saved ? Colors.background : Colors.primary}
              />
              <Text style={[styles.actionBtnText, saved && styles.actionBtnTextActive]}>
                {saved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, visited && styles.actionBtnVisited]}
              onPress={() => toggleVisited(cafe.id)}
            >
              <Ionicons
                name={visited ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={16}
                color={visited ? Colors.background : Colors.primary}
              />
              <Text style={[styles.actionBtnText, visited && styles.actionBtnTextActive]}>
                {visited ? 'Visited' : 'Mark Visited'}
              </Text>
            </TouchableOpacity>

            {cafe.instagram_handle && (
              <TouchableOpacity style={styles.actionBtn} onPress={openInstagram}>
                <Ionicons name="logo-instagram" size={16} color={Colors.primary} />
                <Text style={styles.actionBtnText}>@{cafe.instagram_handle}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Vibe tags */}
          <View style={styles.tagRow}>
            {cafe.vibe_tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{vibeLabel(tag)}</Text>
              </View>
            ))}
          </View>

          {/* Curator notes */}
          {cafe.curator_notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✦ Pallavi's Notes</Text>

              <View style={styles.noteCard}>
                <View style={styles.noteRow}>
                  <Text style={styles.noteLabel}>Order this</Text>
                  <Text style={styles.noteValue}>{cafe.curator_notes.what_to_order}</Text>
                </View>
                <View style={styles.noteDivider} />
                <View style={styles.noteRow}>
                  <Text style={styles.noteLabel}>Skip this</Text>
                  <Text style={styles.noteValue}>{cafe.curator_notes.what_to_skip}</Text>
                </View>
                <View style={styles.noteDivider} />
                <View style={styles.noteRow}>
                  <Text style={styles.noteLabel}>Best time</Text>
                  <Text style={styles.noteValue}>{cafe.curator_notes.best_time}</Text>
                </View>
                {cafe.curator_notes.content_tips && (
                  <SafeAreaView>
                    <View style={styles.noteDivider} />
                    <View style={styles.noteRow}>
                      <Text style={styles.noteLabel}>Content tips</Text>
                      <Text style={styles.noteValue}>{cafe.curator_notes.content_tips}</Text>
                    </View>
                  </SafeAreaView>
                )}
              </View>
            </View>
          )}

          {/* Map placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={32} color={Colors.primary} />
              <Text style={styles.mapText}>
                {cafe.neighborhood}, {cafe.city}
              </Text>
              <Text style={styles.mapCoords}>
                {cafe.coordinates.lat.toFixed(4)}, {cafe.coordinates.lng.toFixed(4)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backBtn: {
    position: 'absolute',
    top: 54,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(26,15,10,0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 240,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroEmoji: {
    fontSize: 64,
    opacity: 0.35,
  },
  curatorBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  curatorBadgeText: {
    color: Colors.background,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  body: {
    padding: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  location: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  ratingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,151,58,0.15)',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 12,
  },
  ratingNumber: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  ratingStar: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnActive: {
    backgroundColor: Colors.primary,
  },
  actionBtnVisited: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  actionBtnText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  actionBtnTextActive: {
    color: Colors.background,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  noteCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  noteRow: {
    padding: 14,
  },
  noteLabel: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  noteValue: {
    color: Colors.cream,
    fontSize: 14,
    lineHeight: 20,
  },
  noteDivider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
  },
  mapPlaceholder: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mapText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  mapCoords: {
    color: Colors.textMuted,
    fontSize: 11,
  },
});
