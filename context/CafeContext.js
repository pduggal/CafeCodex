import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CAFES } from '../data/cafes';

const CafeContext = createContext();

export function CafeProvider({ children }) {
  const [savedCafes, setSavedCafes] = useState([]);
  const [visitedCafes, setVisitedCafes] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    loadPersistedData();
  }, []);

  const loadPersistedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedCafes');
      const visited = await AsyncStorage.getItem('visitedCafes');
      if (saved) setSavedCafes(JSON.parse(saved));
      if (visited) setVisitedCafes(JSON.parse(visited));
    } catch (e) {
      console.log('Error loading data', e);
    }
  };

  const toggleSaved = async (cafeId) => {
    const updated = savedCafes.includes(cafeId)
      ? savedCafes.filter((id) => id !== cafeId)
      : [...savedCafes, cafeId];
    setSavedCafes(updated);
    await AsyncStorage.setItem('savedCafes', JSON.stringify(updated));
  };

  const toggleVisited = async (cafeId) => {
    const updated = visitedCafes.includes(cafeId)
      ? visitedCafes.filter((id) => id !== cafeId)
      : [...visitedCafes, cafeId];
    setVisitedCafes(updated);
    await AsyncStorage.setItem('visitedCafes', JSON.stringify(updated));
  };

  const isSaved = (cafeId) => savedCafes.includes(cafeId);
  const isVisited = (cafeId) => visitedCafes.includes(cafeId);

  const cities = ['All', ...new Set(CAFES.map((c) => c.city))];

  return (
    <CafeContext.Provider
      value={{
        cafes: CAFES,
        savedCafes,
        visitedCafes,
        selectedCity,
        setSelectedCity,
        toggleSaved,
        toggleVisited,
        isSaved,
        isVisited,
        cities,
      }}
    >
      {children}
    </CafeContext.Provider>
  );
}

export const useCafes = () => useContext(CafeContext);
