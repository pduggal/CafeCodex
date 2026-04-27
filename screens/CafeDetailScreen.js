import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { getCafePhoto, getVibeLabel } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

export default function CafeDetailScreen({ route, navigation }) {
  const { cafe } = route.params;
  const { isSaved, toggleSaved, isVisited, toggleVisited } = useCafes();
  const saved = isSaved(cafe.id);
  const visited = isVisited(cafe.id);
  const photo = getCafePhoto(cafe);

  const openInstagram = () => {
    if (cafe.instagram_handle) {
      Linking.openURL(`https://instagram.com/${cafe.instagram_handle}`);
    }
  };

  const openGoogleMaps = () => {
    const q = encodeURIComponent(`${cafe.name} ${cafe.city}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
  };

  const openAppleMaps = () => {
    const q = encodeURIComponent(`${cafe.name} ${cafe.city}`);
    Linking.openURL(`maps://?q=${q}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={22} color={Colors.white} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: photo }} style={styles.heroImg} />
          {cafe.curator_pick && (
            <View style={styles.curatorBadge}>
              <Text style={styles.curatorBadgeText}>✦ Pallavi's Pick</Text>
            </View>
          )}
          {cafe.is_active === false && (
            <View style={styles.closedBadge}>
              <Text style={styles.closedBadgeText}>⚠ Permanently Closed</Text>
            </View>
          )}
          {cafe.press_mention && (
            <View style={styles.pressBadge}>
              <Text style={styles.pressBadgeText}>{cafe.press_mention}</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{cafe.name}</Text>
              <Text style={styles.location}>
                {cafe.neighborhood ? `${cafe.neighborhood} · ` : ''}{cafe.city}
              </Text>
            </View>
            {cafe.curator_rating && (
              <View style={styles.ratingBox}>
                <Text style={styles.ratingNumber}>{cafe.curator_rating}</Text>
                <Text style={styles.ratingStar}>/5</Text>
              </View>
            )}
          </View>

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

          <View style={styles.tagRow}>
            {(cafe.vibe_tags || []).map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{getVibeLabel(tag)}</Text>
              </View>
            ))}
          </View>

          {cafe.must_try && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✦ Must Try</Text>
              <View style={styles.mustTryCard}>
                <Text style={styles.mustTryDrink}>{cafe.must_try.drink}</Text>
                <Text style={styles.mustTryNote}>{cafe.must_try.note}</Text>
              </View>
            </View>
          )}

          {cafe.curator_notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>✦ Pallavi's Notes</Text>
              <View style={styles.noteCard}>
                {cafe.curator_notes.what_to_order && (
                  <>
                    <View style={styles.noteRow}>
                      <Text style={styles.noteLabel}>Order this</Text>
                      <Text style={styles.noteValue}>{cafe.curator_notes.what_to_order}</Text>
                    </View>
                    <View style={styles.noteDivider} />
                  </>
                )}
                {cafe.curator_notes.best_time && (
                  <>
                    <View style={styles.noteRow}>
                      <Text style={styles.noteLabel}>Best time</Text>
                      <Text style={styles.noteValue}>{cafe.curator_notes.best_time}</Text>
                    </View>
                    <View style={styles.noteDivider} />
                  </>
                )}
                {cafe.curator_notes.content_tips && (
                  <View style={styles.noteRow}>
                    <Text style={styles.noteLabel}>Content tips</Text>
                    <Text style={styles.noteValue}>{cafe.curator_notes.content_tips}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={18} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.locationName}>{cafe.name}</Text>
                  <Text style={styles.locationAddr}>
                    {[cafe.neighborhood, cafe.city, cafe.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.locationBtns}>
                <TouchableOpacity style={styles.locationBtn} onPress={openGoogleMaps}>
                  <Ionicons name="navigate-outline" size={14} color={Colors.primary} />
                  <Text style={styles.locationBtnText}>Google Maps</Text>
                </TouchableOpacity>
                <View style={styles.locationBtnDivider} />
                <TouchableOpacity style={styles.locationBtn} onPress={openAppleMaps}>
                  <Ionicons name="map-outline" size={14} color={Colors.primary} />
                  <Text style={styles.locationBtnText}>Apple Maps</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  backBtn: {
    position: 'absolute', top: 54, left: 16, zIndex: 10,
    backgroundColor: 'rgba(26,15,10,0.8)', width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  hero: { height: 240, backgroundColor: Colors.cardBackground, position: 'relative' },
  heroImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  curatorBadge: {
    position: 'absolute', bottom: 14, left: 16,
    backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  curatorBadgeText: { color: Colors.background, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  closedBadge: {
    position: 'absolute', top: 14, left: 16,
    backgroundColor: 'rgba(0,0,0,0.75)', borderWidth: 1, borderColor: '#ff6b6b',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  closedBadgeText: { color: '#ff6b6b', fontSize: 10, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  pressBadge: {
    position: 'absolute', top: 14, right: 16,
    backgroundColor: 'rgba(201,151,58,0.92)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
  },
  pressBadgeText: { color: Colors.background, fontSize: 10, fontWeight: '800' },
  body: { padding: 20 },
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  name: { color: Colors.white, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  location: { color: Colors.textMuted, fontSize: 13 },
  ratingBox: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(201,151,58,0.15)', borderWidth: 1, borderColor: Colors.primary,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginLeft: 12,
  },
  ratingNumber: { color: Colors.primary, fontSize: 20, fontWeight: '800' },
  ratingStar: { color: Colors.textMuted, fontSize: 11 },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.primary,
  },
  actionBtnActive: { backgroundColor: Colors.primary },
  actionBtnVisited: { backgroundColor: Colors.success, borderColor: Colors.success },
  actionBtnText: { color: Colors.primary, fontSize: 12, fontWeight: '600' },
  actionBtnTextActive: { color: Colors.background },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tag: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  tagText: { color: Colors.textMuted, fontSize: 12 },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: Colors.primary, fontSize: 13, fontWeight: '700',
    letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12,
  },
  mustTryCard: {
    borderRadius: 12, padding: 14, borderWidth: 1,
    borderColor: 'rgba(201,151,58,0.55)', backgroundColor: 'rgba(201,151,58,0.08)',
  },
  mustTryDrink: { color: Colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  mustTryNote: { color: Colors.textMuted, fontSize: 14, lineHeight: 20 },
  noteCard: {
    backgroundColor: Colors.cardBackground, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden',
  },
  noteRow: { padding: 14 },
  noteLabel: {
    color: Colors.primary, fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  noteValue: { color: Colors.cream, fontSize: 14, lineHeight: 20 },
  noteDivider: { height: 1, backgroundColor: Colors.cardBorder },
  locationCard: {
    backgroundColor: Colors.cardBackground, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden',
  },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14 },
  locationName: { color: Colors.white, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  locationAddr: { color: Colors.textMuted, fontSize: 13, lineHeight: 18 },
  locationDivider: { height: 1, backgroundColor: Colors.cardBorder },
  locationBtns: { flexDirection: 'row' },
  locationBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 13,
  },
  locationBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  locationBtnDivider: { width: 1, backgroundColor: Colors.cardBorder },
});
