import React, { createContext, useContext, useState, useEffect } from 'react';
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
      const [saved, visited, favs] = await Promise.all([
        AsyncStorage.getItem('savedCafes'),
        AsyncStorage.getItem('visitedCafes'),
        AsyncStorage.getItem('favorites'),
      ]);
      if (saved) setSavedCafes(JSON.parse(saved));
      if (visited) setVisitedCafes(JSON.parse(visited));
      if (favs) setFavorites(JSON.parse(favs));
    } catch (e) {
      console.log('Error loading data', e);
    }
  };

  const toggleSaved = async (cafeId) => {
    const updated = savedCafes.includes(cafeId)
      ? savedCafes.filter((id) => id !== cafeId)
      : [...savedCafes.filter((id) => id !== cafeId), cafeId];
    const updatedVisited = visitedCafes.filter((id) => id !== cafeId);
    setSavedCafes(updated);
    setVisitedCafes(updatedVisited);
    await AsyncStorage.setItem('savedCafes', JSON.stringify(updated));
    await AsyncStorage.setItem('visitedCafes', JSON.stringify(updatedVisited));
  };

  const toggleVisited = async (cafeId) => {
    const updated = visitedCafes.includes(cafeId)
      ? visitedCafes.filter((id) => id !== cafeId)
      : [...visitedCafes.filter((id) => id !== cafeId), cafeId];
    const updatedSaved = savedCafes.filter((id) => id !== cafeId);
    setVisitedCafes(updated);
    setSavedCafes(updatedSaved);
    await AsyncStorage.setItem('visitedCafes', JSON.stringify(updated));
    await AsyncStorage.setItem('savedCafes', JSON.stringify(updatedSaved));
  };

  const toggleFavorite = async (cafeId) => {
    const updated = favorites.includes(cafeId)
      ? favorites.filter((id) => id !== cafeId)
      : [...favorites, cafeId];
    setFavorites(updated);
    await AsyncStorage.setItem('favorites', JSON.stringify(updated));
  };

  const moveToVisited = async (cafeId) => {
    const updatedSaved = savedCafes.filter((id) => id !== cafeId);
    const updatedVisited = visitedCafes.includes(cafeId)
      ? visitedCafes
      : [...visitedCafes, cafeId];
    setSavedCafes(updatedSaved);
    setVisitedCafes(updatedVisited);
    await AsyncStorage.setItem('savedCafes', JSON.stringify(updatedSaved));
    await AsyncStorage.setItem('visitedCafes', JSON.stringify(updatedVisited));
  };

  const moveToWishlist = async (cafeId) => {
    const updatedVisited = visitedCafes.filter((id) => id !== cafeId);
    const updatedSaved = savedCafes.includes(cafeId)
      ? savedCafes
      : [...savedCafes, cafeId];
    setVisitedCafes(updatedVisited);
    setSavedCafes(updatedSaved);
    await AsyncStorage.setItem('visitedCafes', JSON.stringify(updatedVisited));
    await AsyncStorage.setItem('savedCafes', JSON.stringify(updatedSaved));
  };

  const isSaved = (cafeId) => savedCafes.includes(cafeId);
  const isVisited = (cafeId) => visitedCafes.includes(cafeId);
  const isFavorite = (cafeId) => favorites.includes(cafeId);

  const cities = ['All', ...new Set(cafes.map((c) => c.city))];

  return (
    <CafeContext.Provider
      value={{
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
        toggleSaved,
        toggleVisited,
        toggleFavorite,
        moveToVisited,
        moveToWishlist,
        isSaved,
        isVisited,
        isFavorite,
        cities,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
}

export const useCafes = () => useContext(CafeContext);
