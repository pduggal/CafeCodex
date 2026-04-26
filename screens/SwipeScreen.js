import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { VIBE_TAGS, getCafePhoto } from '../data/cafes';
import { useCafes } from '../context/CafeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 75;

export default function SwipeScreen({ navigation }) {
  const {
    cafes, selectedDrink, selectedVibes, selectedLocation,
    savedCafes, visitedCafes, toggleSaved, toggleVisited, isOffline,
  } = useCafes();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState('cards');
  const [browseCity, setBrowseCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [swipedThisRound, setSwipedThisRound] = useState(new Set());
  const pan = useRef(new Animated.ValueXY()).current;

  const deck = useMemo(() => {
    const filtered = cafes.filter((cafe) => {
      if (swipedThisRound.has(cafe.id)) return false;
      if (selectedDrink && cafe.drink && cafe.drink !== selectedDrink) return false;
      if (selectedLocation && selectedLocation.type === 'city' && cafe.city !== selectedLocation.city) return false;
      if (selectedVibes.length > 0) {
        for (const v of selectedVibes) {
          if (v === 'trending' && !cafe.trending) return false;
          if (v === 'picks' && !cafe.curator_pick) return false;
          if (v === 'aesthetic' && !(cafe.vibe_tags || []).includes('viral_aesthetic')) return false;
          if (v === 'hidden' && !(cafe.vibe_tags || []).includes('hidden_gem')) return false;
        }
      }
      return true;
    });
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [cafes, swipedThisRound, selectedDrink, selectedVibes, selectedLocation, shuffleSeed]);

  const allFilteredCafes = useMemo(() => {
    return cafes.filter((cafe) => {
      if (selectedDrink && cafe.drink && cafe.drink !== selectedDrink) return false;
      if (selectedLocation && selectedLocation.type === 'city' && cafe.city !== selectedLocation.city) return false;
      if (selectedVibes.length > 0) {
        for (const v of selectedVibes) {
          if (v === 'trending' && !cafe.trending) return false;
          if (v === 'picks' && !cafe.curator_pick) return false;
          if (v === 'aesthetic' && !(cafe.vibe_tags || []).includes('viral_aesthetic')) return false;
          if (v === 'hidden' && !(cafe.vibe_tags || []).includes('hidden_gem')) return false;
        }
      }
      return true;
    });
  }, [cafes, selectedDrink, selectedVibes, selectedLocation]);

  const browseCafes = useMemo(() => {
    let list = browseCity === 'All' ? allFilteredCafes : allFilteredCafes.filter((c) => c.city === browseCity);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          (c.neighborhood || '').toLowerCase().includes(q) ||
          (c.instagram_handle || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [allFilteredCafes, browseCity, searchQuery]);

  const browseCities = useMemo(() => {
    return ['All', ...new Set(allFilteredCafes.map((c) => c.city))];
  }, [allFilteredCafes]);

  const currentCafe = deck[currentIndex];

  const redealDeck = useCallback(() => {
    pan.stopAnimation();
    pan.setOffset({ x: 0, y: 0 });
    pan.setValue({ x: 0, y: 0 });
    setSwipedThisRound(new Set());
    setShuffleSeed((s) => s + 1);
  }, [pan]);

  const vibeLabel = (tagId) => {
    const found = VIBE_TAGS.find((t) => t.id === tagId);
    return found ? `${found.emoji} ${found.label}` : tagId;
  };

  const commitSwipe = useCallback((direction) => {
    if (!currentCafe) return;
    if (direction === 'right') {
      toggleSaved(currentCafe.id);
    } else {
      toggleVisited(currentCafe.id);
    }
    setSwipedThisRound((prev) => new Set(prev).add(currentCafe.id));
    pan.stopAnimation();
    pan.setOffset({ x: 0, y: 0 });
    pan.setValue({ x: 0, y: 0 });
    if (showTip) setShowTip(false);
  }, [currentCafe, toggleSaved, toggleVisited, pan, showTip]);

  const commitSwipeRef = useRef(commitSwipe);
  useEffect(() => { commitSwipeRef.current = commitSwipe; }, [commitSwipe]);

  const currentCafeRef = useRef(currentCafe);
  useEffect(() => { currentCafeRef.current = currentCafe; }, [currentCafe]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10,
      onPanResponderGrant: () => {
        pan.stopAnimation();
        pan.setOffset({ x: pan.x._value, y: 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        if (Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
          if (currentCafeRef.current) {
            navigation.navigate('CafeDetail', { cafe: currentCafeRef.current });
          }
          return;
        }
        if (gesture.dx > SWIPE_THRESHOLD || gesture.vx > 0.7) {
          Animated.timing(pan, {
            toValue: { x: SCREEN_WIDTH * 1.2, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => commitSwipeRef.current('right'));
        } else if (gesture.dx < -SWIPE_THRESHOLD || gesture.vx < -0.7) {
          Animated.timing(pan, {
            toValue: { x: -SCREEN_WIDTH * 1.2, y: 0 },
            duration: 200,
            useNativeDriver: true,
          }).start(() => commitSwipeRef.current('left'));
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const cardRotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  const rightOverlayOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const leftOverlayOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const filterLabel = `${selectedDrink === 'matcha' ? '🍵 Matcha' : '☕ Coffee'}${
    selectedLocation ? ` · ${selectedLocation.city}` : ''
  }`;

  const renderCard = (cafe, isTop) => {
    const photo = getCafePhoto(cafe);
    const isCafeSaved = savedCafes.includes(cafe.id);
    const isCafeVisited = visitedCafes.includes(cafe.id);
    const animStyle = isTop
      ? { transform: [{ translateX: pan.x }, { rotate: cardRotate }] }
      : {};

    return (
      <Animated.View
        key={cafe.id}
        style={[
          styles.card,
          isTop ? styles.cardTop : styles.cardBehind,
          animStyle,
        ]}
        {...(isTop ? panResponder.panHandlers : {})}
      >
        <View style={styles.cardPhoto}>
          <Image source={{ uri: photo }} style={styles.cardPhotoImg} />
          <View style={styles.cardPhotoGradient} />
          {cafe.curator_pick && (
            <View style={styles.cardPickBadge}>
              <Text style={styles.cardPickText}>✦ Pallavi's Pick</Text>
            </View>
          )}
          {cafe.trending && !cafe.curator_pick && (
            <View style={styles.cardTrendBadge}>
              <Text style={styles.cardTrendText}>🔥 Trending</Text>
            </View>
          )}
          {cafe.press_mention && (
            <View style={styles.cardPressBadge}>
              <Text style={styles.cardPressText}>{cafe.press_mention}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardNameRow}>
            <Text style={styles.cardName} numberOfLines={1}>{cafe.name}</Text>
            {isCafeSaved && (
              <View style={styles.cardStatusBadge}>
                <Text style={styles.cardStatusSaved}>❤️ Saved</Text>
              </View>
            )}
            {isCafeVisited && (
              <View style={[styles.cardStatusBadge, styles.cardStatusVisitedBg]}>
                <Text style={styles.cardStatusVisited}>✓ Visited</Text>
              </View>
            )}
          </View>
          <Text style={styles.cardLoc}>{cafe.neighborhood ? `${cafe.neighborhood} · ` : ''}{cafe.city}</Text>
          {cafe.instagram_handle && (
            <Text style={styles.cardInsta}>@{cafe.instagram_handle}</Text>
          )}

          {cafe.must_try ? (
            <View style={styles.mustTry}>
              <Text style={styles.mustTryLabel}>✦ ORDER THIS</Text>
              <Text style={styles.mustTryDrink}>{cafe.must_try.drink}</Text>
              <Text style={styles.mustTryNote} numberOfLines={1}>{cafe.must_try.note}</Text>
            </View>
          ) : cafe.curator_notes?.what_to_order ? (
            <View style={styles.cardNote}>
              <Text style={styles.cardNoteLabel}>ORDER THIS</Text>
              <Text style={styles.cardNoteValue} numberOfLines={1}>{cafe.curator_notes.what_to_order}</Text>
            </View>
          ) : null}

          <View style={styles.cardTags}>
            {(cafe.vibe_tags || []).slice(0, 2).map((tag) => (
              <View key={tag} style={styles.cardTag}>
                <Text style={styles.cardTagText}>{vibeLabel(tag)}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.tapHint}>Tap for details</Text>

        {isTop && (
          <>
            <Animated.View pointerEvents="none" style={[styles.swipeOverlay, styles.overlayRight, { opacity: rightOverlayOpacity }]}>
              <Text style={[styles.overlayLabel, styles.overlayLabelRight]}>WANT IT</Text>
            </Animated.View>
            <Animated.View pointerEvents="none" style={[styles.swipeOverlay, styles.overlayLeft, { opacity: leftOverlayOpacity }]}>
              <Text style={[styles.overlayLabel, styles.overlayLabelLeft]}>BEEN THERE</Text>
            </Animated.View>
          </>
        )}
      </Animated.View>
    );
  };

  const renderBrowseRow = ({ item: cafe }) => {
    const photo = getCafePhoto(cafe);
    const isWish = savedCafes.includes(cafe.id);
    const isBeen = visitedCafes.includes(cafe.id);
    return (
      <TouchableOpacity
        style={styles.browseRow}
        onPress={() => navigation.navigate('CafeDetail', { cafe })}
        activeOpacity={0.8}
      >
        <Image source={{ uri: photo }} style={styles.browseThumb} />
        <View style={styles.browseInfo}>
          <Text style={styles.browseName} numberOfLines={1}>{cafe.name}</Text>
          <Text style={styles.browseLoc}>{cafe.neighborhood ? `${cafe.neighborhood} · ` : ''}{cafe.city}</Text>
          {(isWish || isBeen) && (
            <View style={styles.browseStatusRow}>
              {isWish && <Text style={styles.browseStatusSaved}>Saved</Text>}
              {isBeen && <Text style={styles.browseStatusVisited}>Visited</Text>}
            </View>
          )}
          <View style={styles.browseRating}>
            <Text style={styles.browseStars}>{'★'.repeat(cafe.curator_rating || 0)}</Text>
            {cafe.curator_pick && <View style={styles.browsePickDot} />}
          </View>
        </View>
        <View style={styles.browseActions}>
          <TouchableOpacity
            style={[styles.browseSaveBtn, isWish && styles.browseSaved]}
            onPress={() => toggleSaved(cafe.id)}
          >
            <Text>{isWish ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.browseBeenBtn, isBeen && styles.browseBeen]}
            onPress={() => toggleVisited(cafe.id)}
          >
            <Text>{isBeen ? '✅' : '✓'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLogo}>Café Codex</Text>
          {isOffline && (
            <View style={styles.offlineBadge}>
              <Text style={styles.offlineBadgeText}>· cached</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.filterPill} onPress={() => navigation.navigate('OnboardingHome', { forceShow: true })}>
          <Text style={styles.filterLabel}>{filterLabel}</Text>
          <Text style={styles.filterChange}> · change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.vtBtn, viewMode === 'cards' && styles.vtBtnActive]}
            onPress={() => setViewMode('cards')}
          >
            <Ionicons name={viewMode === 'cards' ? 'grid' : 'grid-outline'} size={14} color={viewMode === 'cards' ? Colors.background : Colors.textMuted} />
            <Text style={[styles.vtLabel, viewMode === 'cards' && styles.vtLabelActive]}>Cards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.vtBtn, viewMode === 'list' && styles.vtBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name={viewMode === 'list' ? 'list' : 'list-outline'} size={14} color={viewMode === 'list' ? Colors.background : Colors.textMuted} />
            <Text style={[styles.vtLabel, viewMode === 'list' && styles.vtLabelActive]}>List</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.deckCount}>{deck.length} cafes</Text>
      </View>

      {/* Progress dots */}
      <View style={styles.dots}>
        {deck.slice(0, 7).map((_, i) => (
          <View key={i} style={[styles.dot, i === (swipedThisRound.size % 7) && styles.dotActive]} />
        ))}
      </View>

      {viewMode === 'list' ? (
        <View style={styles.browseWrap}>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={15} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cafes, cities, neighborhoods…"
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={(t) => { setSearchQuery(t); setBrowseCity('All'); }}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.browseCityBar}
            contentContainerStyle={styles.browseCityBarContent}
          >
            {browseCities.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.browseCityChip, browseCity === city && styles.browseCityActive]}
                onPress={() => setBrowseCity(city)}
              >
                <Text style={[styles.browseCityText, browseCity === city && styles.browseCityTextActive]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            data={browseCafes}
            keyExtractor={(item) => item.id}
            renderItem={renderBrowseRow}
            contentContainerStyle={styles.browseList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyIcon}>☕</Text>
                <Text style={styles.emptyTitle}>No cafes found</Text>
                <Text style={styles.emptySub}>Try a different city or filter</Text>
              </View>
            }
          />
        </View>
      ) : (
        <View style={styles.swipeArea}>
          {deck.length === 0 || currentIndex >= deck.length ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>✦</Text>
              <Text style={styles.emptyTitle}>That's all for now</Text>
              <Text style={styles.emptySub}>You've seen every cafe in this set.</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={redealDeck}
              >
                <Text style={styles.emptyBtnText}>Reshuffle deck</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.emptyBtn, styles.emptyBtnSecondary]}
                onPress={() => navigation.getParent()?.navigate('My List')}
              >
                <Text style={styles.emptyBtnSecondaryText}>See my list</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardStack}>
              {deck[currentIndex + 1] && renderCard(deck[currentIndex + 1], false)}
              {currentCafe && renderCard(currentCafe, true)}
            </View>
          )}
        </View>
      )}

      {viewMode === 'cards' && currentCafe && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionCircle, styles.actionBeen]}
            onPress={() => commitSwipe('left')}
          >
            <Text style={styles.actionIcon}>✓</Text>
            <Text style={styles.actionLabel}>Been there</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reshuffleBtn}
            onPress={redealDeck}
          >
            <Ionicons name="shuffle-outline" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCircle, styles.actionWant]}
            onPress={() => commitSwipe('right')}
          >
            <Text style={styles.actionIconLg}>❤️</Text>
            <Text style={styles.actionLabelGreen}>Want to go</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerLogo: { color: Colors.primary, fontSize: 20, fontWeight: '800' },
  offlineBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, backgroundColor: Colors.cardBackground },
  offlineBadgeText: { color: Colors.textMuted, fontSize: 10, fontWeight: '600' },
  filterPill: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    flexShrink: 1,
  },
  filterLabel: { color: Colors.cream, fontSize: 12, fontWeight: '600' },
  filterChange: { color: Colors.textMuted, fontSize: 12 },
  subHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 8,
  },
  deckCount: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  viewToggle: { flexDirection: 'row', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: Colors.cardBorder },
  vtBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.cardBackground, paddingHorizontal: 12, paddingVertical: 7 },
  vtBtnActive: { backgroundColor: Colors.primary },
  vtLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted },
  vtLabelActive: { color: Colors.background },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 6 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.cardBorder },
  dotActive: { backgroundColor: Colors.primary, transform: [{ scale: 1.4 }] },

  swipeArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  cardStack: { width: '100%', maxWidth: 400, flex: 1, position: 'relative' },
  card: {
    position: 'absolute', left: 0, right: 0, top: 8, bottom: 8,
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 22, overflow: 'hidden',
  },
  cardTop: { zIndex: 2 },
  cardBehind: { zIndex: 1, transform: [{ scale: 0.94 }, { translateY: 12 }] },
  cardPhoto: { height: 180, backgroundColor: Colors.cardBackground, position: 'relative', overflow: 'hidden' },
  cardPhotoImg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%', resizeMode: 'cover' },
  cardPhotoGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
  },
  cardPickBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  cardPickText: { color: Colors.background, fontSize: 11, fontWeight: '700' },
  cardTrendBadge: {
    position: 'absolute', top: 14, left: 14, backgroundColor: 'rgba(26,15,10,0.85)',
    borderWidth: 1, borderColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  cardTrendText: { color: Colors.primary, fontSize: 11, fontWeight: '600' },
  cardPressBadge: {
    position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(201,151,58,0.92)',
    paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20,
  },
  cardPressText: { color: Colors.background, fontSize: 10, fontWeight: '800' },
  cardBody: { flex: 1, padding: 16, paddingHorizontal: 18, paddingBottom: 4, gap: 6 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardName: { color: Colors.white, fontSize: 22, fontWeight: '800', lineHeight: 25, flex: 1 },
  cardStatusBadge: {
    backgroundColor: 'rgba(201,151,58,0.12)', borderWidth: 1, borderColor: 'rgba(201,151,58,0.4)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2,
  },
  cardStatusSaved: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  cardStatusVisitedBg: { backgroundColor: 'rgba(107,158,107,0.12)', borderColor: 'rgba(107,158,107,0.4)' },
  cardStatusVisited: { color: Colors.success, fontSize: 10, fontWeight: '700' },
  cardLoc: { color: Colors.textMuted, fontSize: 13 },
  cardInsta: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  cardNote: { backgroundColor: Colors.background, borderRadius: 10, padding: 10, paddingHorizontal: 12, marginTop: 2 },
  cardNoteLabel: { color: Colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  cardNoteValue: { color: Colors.cream, fontSize: 13, lineHeight: 18 },
  mustTry: {
    borderRadius: 10, padding: 10, paddingHorizontal: 12, marginTop: 2,
    borderWidth: 1, borderColor: 'rgba(201,151,58,0.55)', backgroundColor: 'rgba(201,151,58,0.08)',
  },
  mustTryLabel: { color: Colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 },
  mustTryDrink: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  mustTryNote: { color: Colors.textMuted, fontSize: 12, marginTop: 3, lineHeight: 17 },
  cardTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, paddingTop: 4 },
  cardTag: {
    backgroundColor: Colors.tagBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
  },
  cardTagText: { color: Colors.textMuted, fontSize: 10 },
  tapHint: { color: Colors.textMuted, fontSize: 10, fontWeight: '600', letterSpacing: 0.3, textAlign: 'center', paddingVertical: 6 },

  swipeOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', borderRadius: 22,
  },
  overlayRight: { backgroundColor: 'rgba(107,158,107,0.18)' },
  overlayLeft: { backgroundColor: 'rgba(201,151,58,0.12)' },
  overlayLabel: { fontSize: 28, fontWeight: '800', borderWidth: 3, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 8, letterSpacing: 1 },
  overlayLabelRight: { color: Colors.success, borderColor: Colors.success, transform: [{ rotate: '-12deg' }] },
  overlayLabelLeft: { color: Colors.primary, borderColor: Colors.primary, transform: [{ rotate: '12deg' }] },

  actions: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20,
    paddingVertical: 14, paddingHorizontal: 20,
  },
  actionCircle: {
    width: 60, height: 60, borderRadius: 30, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cardBackground, gap: 1,
  },
  actionBeen: { borderColor: Colors.primary },
  actionWant: { borderColor: Colors.success, width: 72, height: 72, borderRadius: 36 },
  actionIcon: { color: Colors.primary, fontSize: 20 },
  actionIconLg: { fontSize: 26 },
  actionLabel: { color: Colors.primary, fontSize: 8, fontWeight: '700', letterSpacing: 0.3 },
  actionLabelGreen: { color: Colors.success, fontSize: 8, fontWeight: '700', letterSpacing: 0.3 },
  reshuffleBtn: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.cardBorder,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.cardBackground,
  },

  browseWrap: { flex: 1 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginTop: 10, marginBottom: 2,
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 12, paddingHorizontal: 12, height: 40,
  },
  searchIcon: { flexShrink: 0 },
  searchInput: { flex: 1, color: Colors.cream, fontSize: 14 },
  browseCityBar: { flexGrow: 0, flexShrink: 0 },
  browseCityBarContent: { paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  browseCityChip: {
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginRight: 6,
  },
  browseCityActive: { backgroundColor: 'rgba(201,151,58,0.15)', borderColor: Colors.primary },
  browseCityText: { color: Colors.textMuted, fontSize: 12, fontWeight: '600' },
  browseCityTextActive: { color: Colors.primary },
  browseList: { paddingHorizontal: 16, paddingBottom: 24 },
  browseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.cardBackground, borderWidth: 1, borderColor: Colors.cardBorder,
    borderRadius: 14, padding: 10, paddingHorizontal: 12, marginBottom: 8,
  },
  browseThumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: Colors.background },
  browseInfo: { flex: 1 },
  browseName: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  browseLoc: { color: Colors.textMuted, fontSize: 11, marginTop: 2 },
  browseStatusRow: { flexDirection: 'row', gap: 6, marginTop: 2 },
  browseStatusSaved: { color: Colors.primary, fontSize: 10, fontWeight: '700' },
  browseStatusVisited: { color: Colors.success, fontSize: 10, fontWeight: '700' },
  browseRating: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  browseStars: { color: Colors.primary, fontSize: 11 },
  browsePickDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary },
  browseActions: { flexDirection: 'column', alignItems: 'center', gap: 6 },
  browseSaveBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  browseSaved: { borderColor: Colors.primary, backgroundColor: 'rgba(201,151,58,0.12)' },
  browseBeenBtn: {
    width: 36, height: 36, borderRadius: 18, borderWidth: 1.5, borderColor: Colors.cardBorder,
    alignItems: 'center', justifyContent: 'center',
  },
  browseBeen: { borderColor: Colors.success, backgroundColor: 'rgba(107,158,107,0.12)' },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 52, opacity: 0.4, marginBottom: 12 },
  emptyTitle: { color: Colors.cream, fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptySub: { color: Colors.textMuted, fontSize: 14, lineHeight: 22, textAlign: 'center', maxWidth: 260, marginBottom: 16 },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 28 },
  emptyBtnText: { color: Colors.background, fontSize: 15, fontWeight: '700' },
  emptyBtnSecondary: {
    backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.primary, marginTop: 10,
  },
  emptyBtnSecondaryText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
});
