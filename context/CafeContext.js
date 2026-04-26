import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const CafeContext = createContext();

export function CafeProvider({ children }) {
  const [cafes, setCafes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [savedCafes, setSavedCafes] = useState([]);
  const [visitedCafes, setVisitedCafes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedDrink, setSelectedDrink] = useState('coffee');
  const [selectedVibes, setSelectedVibes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    loadPersistedData();
    fetchCafes();
    fetchCountries();
  }, []);

  const fetchCafes = async () => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 8000)
      );
      const query = supabase.from('cafes').select('*').order('name');
      const { data, error } = await Promise.race([query, timeout]);
      if (error) throw error;
      if (data && data.length > 0) {
        setCafes(data);
        AsyncStorage.setItem('cafes_cache', JSON.stringify(data)).catch(() => {});
      } else {
        throw new Error('empty');
      }
    } catch (e) {
      console.log('Supabase cafes failed, loading cache', e);
      try {
        const cached = await AsyncStorage.getItem('cafes_cache');
        if (cached) setCafes(JSON.parse(cached));
      } catch (ce) {}
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      if (error) throw error;
      if (data && data.length > 0) {
        setCountries(data);
        AsyncStorage.setItem('countries_cache', JSON.stringify(data)).catch(() => {});
      }
    } catch (e) {
      console.log('Supabase countries failed, loading cache', e);
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
      console.log('Error loading persisted data', e);
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

  const toggleSaved = useCallback((cafeId) => {
    setSavedCafes((prev) => {
      const updated = prev.includes(cafeId)
        ? prev.filter((id) => id !== cafeId)
        : [...prev, cafeId];
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setVisitedCafes((prev) => {
      const updated = prev.filter((id) => id !== cafeId);
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const toggleVisited = useCallback((cafeId) => {
    setVisitedCafes((prev) => {
      const updated = prev.includes(cafeId)
        ? prev.filter((id) => id !== cafeId)
        : [...prev, cafeId];
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setSavedCafes((prev) => {
      const updated = prev.filter((id) => id !== cafeId);
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((cafeId) => {
    setFavorites((prev) => {
      const updated = prev.includes(cafeId)
        ? prev.filter((id) => id !== cafeId)
        : [...prev, cafeId];
      AsyncStorage.setItem('favorites', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const moveToVisited = useCallback((cafeId) => {
    setSavedCafes((prev) => {
      const updated = prev.filter((id) => id !== cafeId);
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setVisitedCafes((prev) => {
      const updated = prev.includes(cafeId) ? prev : [...prev, cafeId];
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const moveToWishlist = useCallback((cafeId) => {
    setVisitedCafes((prev) => {
      const updated = prev.filter((id) => id !== cafeId);
      AsyncStorage.setItem('visitedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
    setSavedCafes((prev) => {
      const updated = prev.includes(cafeId) ? prev : [...prev, cafeId];
      AsyncStorage.setItem('savedCafes', JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const isSaved = useCallback((cafeId) => savedCafes.includes(cafeId), [savedCafes]);
  const isVisited = useCallback((cafeId) => visitedCafes.includes(cafeId), [visitedCafes]);
  const isFavorite = useCallback((cafeId) => favorites.includes(cafeId), [favorites]);

  const cities = useMemo(() => ['All', ...new Set(cafes.map((c) => c.city))], [cafes]);

  const contextValue = useMemo(() => ({
    cafes,
    countries,
    loading,
    savedCafes,
    visitedCafes,
    favorites,
    selectedCity,
    setSelectedCity,
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
    cafes, countries, loading,
    savedCafes, visitedCafes, favorites,
    selectedCity, selectedDrink, selectedVibes, selectedLocation,
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
