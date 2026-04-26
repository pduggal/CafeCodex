import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useCafes } from '../context/CafeContext';

const ONBOARDING_VIBES = [
  { id: 'trending', icon: '🔥', label: 'Trending', sub: "Everyone's talking about it" },
  { id: 'picks', icon: '✦', label: "Pallavi's Picks", sub: 'Personally vetted top 5-star spots' },
  { id: 'aesthetic', icon: '📸', label: 'Aesthetic', sub: 'Gorgeous, content-worthy spaces' },
  { id: 'hidden', icon: '✨', label: 'Hidden Gems', sub: 'Off the radar, worth the detour' },
];

export default function OnboardingScreen({ navigation, route }) {
  const {
    countries, hasOnboarded, savePreferences,
    selectedDrink, selectedVibes, selectedLocation,
  } = useCafes();
  const forceShow = route?.params?.forceShow === true;
  const [step, setStep] = useState(1);
  const [drink, setDrink] = useState(selectedDrink || 'coffee');
  const [vibes, setVibes] = useState(selectedVibes || []);
  const [locQuery, setLocQuery] = useState('');
  const [locResults, setLocResults] = useState([]);
  const [location, setLocation] = useState(selectedLocation || null);
  const [notVisited, setNotVisited] = useState(null);

  // Skip onboarding on return visits unless user explicitly tapped "change"
  useEffect(() => {
    if (hasOnboarded && !forceShow) {
      navigation.replace('SwipeHome');
    }
  }, [hasOnboarded, forceShow]);

  const matchLocation = (q) => {
    if (!q || q.length < 2) return [];
    const lq = q.toLowerCase().trim();
    const results = [];
    countries.forEach((c) => {
      if (c.visited) {
        const matchedCities = (c.cities || []).filter(
          (city) => city.toLowerCase().includes(lq)
        );
        if (matchedCities.length > 0) {
          matchedCities.forEach((city) =>
            results.push({ type: 'city', city, country: c.name, flag: c.flag, visited: true })
          );
          return;
        }
        const nameMatch = c.name.toLowerCase().includes(lq);
        const aliasMatch = (c.aliases || []).some((a) => a.includes(lq));
        if (nameMatch || aliasMatch) {
          (c.cities || []).forEach((city) =>
            results.push({ type: 'city', city, country: c.name, flag: c.flag, visited: true })
          );
        }
      } else {
        const nameMatch = c.name.toLowerCase().includes(lq);
        const aliasMatch = (c.aliases || []).some((a) => a.includes(lq));
        if (nameMatch || aliasMatch) {
          results.push({
            type: 'country', country: c.name, flag: c.flag, visited: false,
            planned_cities: c.planned_cities, message: c.message,
          });
        }
      }
    });
    return results.slice(0, 8);
  };

  const onLocInput = (text) => {
    setLocQuery(text);
    setLocation(null);
    setNotVisited(null);
    setLocResults(matchLocation(text));
  };

  const selectLoc = (item) => {
    if (item.visited) {
      setLocation(item);
      setLocQuery('');
      setLocResults([]);
      setNotVisited(null);
    } else {
      setNotVisited(item);
      setLocQuery('');
      setLocResults([]);
    }
  };

  const clearLoc = () => {
    setLocation(null);
    setNotVisited(null);
    setLocQuery('');
    setLocResults([]);
  };

  const toggleVibe = (id) => {
    setVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const startSwiping = () => {
    savePreferences(drink, vibes, location);
    navigation.navigate('SwipeHome');
  };

  if (step === 1) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.logo}>Café Codex</Text>
          <Text style={styles.tagline}>Your record of the world's best cups</Text>

          <Text style={styles.question}>What are you in the mood for?</Text>
          <View style={styles.drinkCards}>
            <TouchableOpacity
              style={[styles.drinkCard, drink === 'coffee' && styles.drinkCardActive]}
              onPress={() => setDrink('coffee')}
            >
              <Text style={styles.drinkIcon}>☕</Text>
              <Text style={styles.drinkLabel}>Coffee</Text>
              <Text style={styles.drinkSub}>Pour-overs, espresso, lattes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.drinkCard, drink === 'matcha' && styles.drinkCardActive]}
              onPress={() => setDrink('matcha')}
            >
              <Text style={styles.drinkIcon}>🍵</Text>
              <Text style={styles.drinkLabel}>Matcha</Text>
              <Text style={styles.drinkSub}>Ceremonial bowls, hojicha</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.locSection}>
            <Text style={styles.locLabel}>
              📍 Where are you exploring?{' '}
              <Text style={styles.locOptional}>optional</Text>
            </Text>
            <View style={styles.locInputWrap}>
              <TextInput
                style={styles.locInput}
                placeholder="Search city or country…"
                placeholderTextColor={Colors.textMuted}
                value={locQuery}
                onChangeText={onLocInput}
                autoCorrect={false}
              />
              {locQuery.length > 0 && (
                <TouchableOpacity style={styles.locClear} onPress={clearLoc}>
                  <Text style={styles.locClearText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {locResults.length > 0 && (
              <View style={styles.locDropdown}>
                {locResults.map((item, i) => (
                  <TouchableOpacity
                    key={`${item.country}-${item.city || ''}-${i}`}
                    style={styles.locItem}
                    onPress={() => selectLoc(item)}
                  >
                    <Text style={styles.locFlag}>{item.flag}</Text>
                    <View style={styles.locInfo}>
                      <Text style={styles.locName}>
                        {item.type === 'city' ? `${item.city}, ${item.country}` : item.country}
                      </Text>
                      <Text style={[styles.locStatus, item.visited ? styles.locVisited : styles.locWishlist]}>
                        {item.visited ? '✓ Visited' : '✈ On the wishlist'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {location && (
              <View style={styles.locBadge}>
                <Text style={styles.locBadgeText}>
                  {location.flag} {location.city}, {location.country}
                </Text>
                <TouchableOpacity onPress={clearLoc}>
                  <Text style={styles.locBadgeClear}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            {notVisited && (
              <View style={styles.notVisited}>
                <Text style={styles.nvFlag}>{notVisited.flag}</Text>
                <Text style={styles.nvTitle}>{notVisited.country}</Text>
                <Text style={styles.nvMsg}>{notVisited.message}</Text>
                <TouchableOpacity
                  style={styles.nvBtn}
                  onPress={() => {
                    clearLoc();
                    navigation.navigate('Recommend');
                  }}
                >
                  <Text style={styles.nvBtnText}>✦ Nominate a café there</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.cta} onPress={() => setStep(2)}>
            <Text style={styles.ctaText}>Find cafes →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.logo}>Café Codex</Text>
        <Text style={styles.tagline}>
          {drink === 'coffee' ? '☕ Coffee' : '🍵 Matcha'}
          {location ? ` · ${location.city}` : ''}
        </Text>

        <Text style={styles.question}>What kind of place?</Text>
        <View style={styles.vibeGrid}>
          {ONBOARDING_VIBES.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vibeCard, vibes.includes(v.id) && styles.vibeCardActive]}
              onPress={() => toggleVibe(v.id)}
            >
              <Text style={styles.vibeIcon}>{v.icon}</Text>
              <Text style={styles.vibeLabel}>{v.label}</Text>
              <Text style={styles.vibeSub}>{v.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.cta} onPress={startSwiping}>
          <Text style={styles.ctaText}>Show me cafes →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Text style={styles.backText}>← Change my drink</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: {
    alignItems: 'center',
    padding: 28,
    paddingTop: 32,
  },
  logo: { color: Colors.primary, fontSize: 26, fontWeight: '800', letterSpacing: 0.5, marginBottom: 4 },
  tagline: { color: Colors.textMuted, fontSize: 13, marginBottom: 36 },
  question: {
    color: Colors.cream, fontSize: 20, fontWeight: '800', textAlign: 'center',
    lineHeight: 26, marginBottom: 18, width: '100%', maxWidth: 340,
  },
  drinkCards: { flexDirection: 'row', gap: 14, width: '100%', maxWidth: 340 },
  drinkCard: {
    flex: 1, backgroundColor: Colors.cardBackground, borderWidth: 2, borderColor: Colors.cardBorder,
    borderRadius: 18, padding: 22, alignItems: 'center', gap: 8,
  },
  drinkCardActive: { borderColor: Colors.primary, backgroundColor: 'rgba(201,151,58,0.08)' },
  drinkIcon: { fontSize: 40 },
  drinkLabel: { color: Colors.cream, fontSize: 16, fontWeight: '700' },
  drinkSub: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 16 },

  locSection: { width: '100%', maxWidth: 340, marginTop: 20 },
  locLabel: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  locOptional: { color: Colors.cardBorder, fontWeight: '400', textTransform: 'none', letterSpacing: 0, fontSize: 10 },
  locInputWrap: { position: 'relative' },
  locInput: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 12, padding: 12, paddingRight: 36, color: Colors.cream, fontSize: 15,
  },
  locClear: { position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', padding: 4 },
  locClearText: { color: Colors.textMuted, fontSize: 15 },
  locDropdown: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 12, marginTop: 4, overflow: 'hidden',
  },
  locItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
  },
  locFlag: { fontSize: 22 },
  locInfo: { flex: 1 },
  locName: { color: Colors.cream, fontSize: 14, fontWeight: '600' },
  locStatus: { fontSize: 11, marginTop: 1 },
  locVisited: { color: Colors.success },
  locWishlist: { color: Colors.textMuted, fontStyle: 'italic' },
  locBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10,
    padding: 9, paddingHorizontal: 12, backgroundColor: 'rgba(107,158,107,0.1)',
    borderWidth: 1, borderColor: Colors.success, borderRadius: 10,
  },
  locBadgeText: { color: Colors.success, fontSize: 13, fontWeight: '600', flex: 1 },
  locBadgeClear: { color: Colors.textMuted, fontSize: 14 },
  notVisited: {
    marginTop: 10, padding: 14, backgroundColor: 'rgba(201,151,58,0.07)',
    borderWidth: 1, borderColor: Colors.cardBorder, borderRadius: 12,
  },
  nvFlag: { fontSize: 24, marginBottom: 6 },
  nvTitle: { color: Colors.cream, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  nvMsg: { color: Colors.textMuted, fontSize: 12, lineHeight: 19, marginBottom: 10 },
  nvBtn: { alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.primary, borderRadius: 8, paddingVertical: 7, paddingHorizontal: 14 },
  nvBtnText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },

  cta: {
    width: '100%', maxWidth: 340, backgroundColor: Colors.primary,
    borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24,
  },
  ctaText: { color: Colors.background, fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  backText: { color: Colors.textMuted, fontSize: 13, marginTop: 14 },

  vibeGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    width: '100%', maxWidth: 340,
  },
  vibeCard: {
    width: '47%', backgroundColor: Colors.cardBackground, borderWidth: 1.5,
    borderColor: Colors.cardBorder, borderRadius: 14, padding: 18, paddingHorizontal: 14, gap: 6,
  },
  vibeCardActive: { borderColor: Colors.primary, backgroundColor: 'rgba(201,151,58,0.08)' },
  vibeIcon: { fontSize: 24 },
  vibeLabel: { color: Colors.cream, fontSize: 14, fontWeight: '700', lineHeight: 17 },
  vibeSub: { color: Colors.textMuted, fontSize: 11, lineHeight: 15 },
});
