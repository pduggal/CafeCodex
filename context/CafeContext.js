import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { publicSupabase } from '../lib/supabase';

const CafeContext = createContext();

export function CafeProvider({ children }) {
  const [cafes, setCafes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savedCafes, setSavedCafes] = useState([]);
  const [visitedCafes, setVisitedCafes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [isOffline, setIsOffline] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const [selectedDrink, setSelectedDrink] = useState('coffee');
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    loadPersistedData();
    fetchCafes();
    fetchCountries();
    requestLocation();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc;
      try {
        loc = await Location.getLastKnownPositionAsync();
      } catch (_) {}
      if (!loc) {
        loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      }
      if (loc) {
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
    } catch (_) {}
  };

  const fetchCafes = async () => {
    let timeoutId;
    try {
      const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('timeout')), 15000);
      });
      const query = publicSupabase.from('cafes').select('*').order('name');
      const { data, error } = await Promise.race([query, timeout]);
      clearTimeout(timeoutId);
      if (error) throw error;
      if (data && data.length > 0) {
        setCafes(data);
        setIsOffline(false);
        AsyncStorage.setItem('cafes_cache', JSON.stringify(data)).catch(() => {});
      } else {
        throw new Error('empty');
      }
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn('Cafe fetch failed:', e.message);
      try {
        const cached = await AsyncStorage.getItem('cafes_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          console.warn('Using cache:', parsed.length, 'cafes');
          setCafes(parsed);
          setIsOffline(true);
        } else {
          console.warn('No cache available');
        }
      } catch (ce) {}
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await publicSupabase
        .from('countries')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data && data.length > 0) {
        setCountries(data);
        AsyncStorage.setItem('countries_cache', JSON.stringify(data)).catch(() => {});
      }
    } catch (e) {
      try {
        const cached = await AsyncStorage.getItem('countries_cache');
        if (cached) setCountries(JSON.parse(cached));
      } catch (ce) {}
    }
  };

  const loadPersistedData = async () => {
    try {
      const [saved, visited, favs, drink, vibes, location, onboarded] = await Promise.all([
        AsyncStorage.getItem('savedCafes'),
        AsyncStorage.getItem('visitedCafes'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('selectedDrink'),
        AsyncStorage.getItem('selectedVibes'),
        AsyncStorage.getItem('selectedLocation'),
        AsyncStorage.getItem('hasOnboarded'),
      ]);
      if (saved) setSavedCafes(JSON.parse(saved));
      if (visited) setVisitedCafes(JSON.parse(visited));
      if (favs) setFavorites(JSON.parse(favs));
      if (drink) setSelectedDrink(JSON.parse(drink));
      if (vibes) setSelectedVibes(JSON.parse(vibes));
      if (location) setSelectedLocation(JSON.parse(location));
      if (onboarded) setHasOnboarded(JSON.parse(onboarded));
    } catch (e) {
    }
  };

  const persistPreferences = useCallback((drink, vibes, location) => {
    AsyncStorage.setItem('selectedDrink', JSON.stringify(drink)).catch(() => {});
    AsyncStorage.setItem('selectedVibes', JSON.stringify(vibes)).catch(() => {});
    AsyncStorage.setItem('selectedLocation', JSON.stringify(location)).catch(() => {});
    AsyncStorage.setItem('hasOnboarded', JSON.stringify(true)).catch(() => {});
  }, []);

  const savePreferences = useCallback((drink, vibes, location) => {
    setSelectedDrink(drink);
    setSelectedVibes(vibes);
    setSelectedLocation(location);
    setHasOnboarded(true);
    persistPreferences(drink, vibes, location);
  }, [persistPreferences]);

  const resetOnboarding = useCallback(() => {
    setHasOnboarded(false);
    AsyncStorage.setItem('hasOnboarded', JSON.stringify(false)).catch(() => {});
  }, []);

  // Saved and visited are mutually exclusive — saving removes from visited and vice versa
  const toggleSaved = useCallback((cafeId) => {
    const cid = String(cafeId);
    setSavedCafes((prev) => {
      const updated = prev.includes(cid)
        ? prev.filter((id) => id !== cid)
        : [...prev, cid];
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setVisitedCafes((prev) => {
      const updated = prev.filter((id) => id !== cid);
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const toggleVisited = useCallback((cafeId) => {
    const cid = String(cafeId);
    setVisitedCafes((prev) => {
      const updated = prev.includes(cid)
        ? prev.filter((id) => id !== cid)
        : [...prev, cid];
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setSavedCafes((prev) => {
      const updated = prev.filter((id) => id !== cid);
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((cafeId) => {
    const cid = String(cafeId);
    setFavorites((prev) => {
      const updated = prev.includes(cid)
        ? prev.filter((id) => id !== cid)
        : [...prev, cid];
      AsyncStorage.setItem('favorites', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const moveToVisited = useCallback((cafeId) => {
    const cid = String(cafeId);
    setSavedCafes((prev) => {
      const updated = prev.filter((id) => id !== cid);
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setVisitedCafes((prev) => {
      const updated = prev.includes(cid) ? prev : [...prev, cid];
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const moveToWishlist = useCallback((cafeId) => {
    const cid = String(cafeId);
    setVisitedCafes((prev) => {
      const updated = prev.filter((id) => id !== cid);
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setSavedCafes((prev) => {
      const updated = prev.includes(cid) ? prev : [...prev, cid];
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const isSaved = useCallback((cafeId) => savedCafes.includes(String(cafeId)), [savedCafes]);
  const isVisited = useCallback((cafeId) => visitedCafes.includes(String(cafeId)), [visitedCafes]);
  const isFavorite = useCallback((cafeId) => favorites.includes(String(cafeId)), [favorites]);

  const cities = useMemo(() => ['All', ...new Set(cafes.map((c) => c.city))], [cafes]);

  const contextValue = useMemo(() => ({
    cafes,
    countries,
    loading,
    isOffline,
    userLocation,
    savedCafes,
    visitedCafes,
    favorites,
    selectedDrink,
    setSelectedDrink,
    selectedVibes,
    setSelectedVibes,
    selectedLocation,
    setSelectedLocation,
    hasOnboarded,
    savePreferences,
    resetOnboarding,
    toggleSaved,
    toggleVisited,
    toggleFavorite,
    moveToVisited,
    moveToWishlist,
    isSaved,
    isVisited,
    isFavorite,
    cities,
  }), [
    cafes, countries, loading, isOffline, userLocation,
    savedCafes, visitedCafes, favorites,
    selectedDrink, selectedVibes, selectedLocation,
    hasOnboarded, savePreferences, resetOnboarding,
    toggleSaved, toggleVisited, toggleFavorite, moveToVisited, moveToWishlist,
    isSaved, isVisited, isFavorite, cities,
  ]);

  return (
    <CafeContext.Provider value={contextValue}>
      {children}
    </CafeContext.Provider>
  );
}

export const useCafes = () => useContext(CafeContext);
