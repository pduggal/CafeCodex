import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn().mockResolvedValue(null),
  Accuracy: { Low: 1 },
}));

import { CafeProvider, useCafes } from '../../context/CafeContext';

function TestConsumer({ onContext }) {
  const ctx = useCafes();
  useEffect(() => { onContext(ctx); }, [ctx]);
  return <Text testID="child">loaded</Text>;
}

beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.default?.clear?.() || AsyncStorage.clear?.();
});

describe('CafeProvider', () => {
  test('renders children', async () => {
    const { getByTestId } = render(
      <CafeProvider><Text testID="child">hello</Text></CafeProvider>
    );
    expect(getByTestId('child')).toBeTruthy();
  });

  test('toggleSaved adds a cafe and persists to AsyncStorage', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleSaved('cafe-1'); });
    expect(ctx.isSaved('cafe-1')).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'savedCafes',
      expect.stringContaining('cafe-1')
    );
  });

  test('toggleSaved removes a previously saved cafe', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleSaved('cafe-2'); });
    expect(ctx.isSaved('cafe-2')).toBe(true);

    await act(async () => { await ctx.toggleSaved('cafe-2'); });
    expect(ctx.isSaved('cafe-2')).toBe(false);
  });

  test('toggleSaved removes from visited (mutual exclusion)', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleVisited('cafe-3'); });
    expect(ctx.isVisited('cafe-3')).toBe(true);

    await act(async () => { await ctx.toggleSaved('cafe-3'); });
    expect(ctx.isSaved('cafe-3')).toBe(true);
    expect(ctx.isVisited('cafe-3')).toBe(false);
  });

  test('toggleVisited removes from saved (mutual exclusion)', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleSaved('cafe-4'); });
    expect(ctx.isSaved('cafe-4')).toBe(true);

    await act(async () => { await ctx.toggleVisited('cafe-4'); });
    expect(ctx.isVisited('cafe-4')).toBe(true);
    expect(ctx.isSaved('cafe-4')).toBe(false);
  });

  test('moveToVisited removes from saved and adds to visited', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleSaved('cafe-5'); });
    expect(ctx.isSaved('cafe-5')).toBe(true);

    await act(async () => { await ctx.moveToVisited('cafe-5'); });
    expect(ctx.isVisited('cafe-5')).toBe(true);
    expect(ctx.isSaved('cafe-5')).toBe(false);
  });

  test('moveToWishlist removes from visited and adds to saved', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleVisited('cafe-6'); });
    expect(ctx.isVisited('cafe-6')).toBe(true);

    await act(async () => { await ctx.moveToWishlist('cafe-6'); });
    expect(ctx.isSaved('cafe-6')).toBe(true);
    expect(ctx.isVisited('cafe-6')).toBe(false);
  });

  test('toggleFavorite adds and removes independently of saved/visited', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleFavorite('cafe-7'); });
    expect(ctx.isFavorite('cafe-7')).toBe(true);

    await act(async () => { await ctx.toggleFavorite('cafe-7'); });
    expect(ctx.isFavorite('cafe-7')).toBe(false);
  });

  test('falls back to AsyncStorage cache when Supabase fails', async () => {
    const { publicSupabase } = require('../../lib/supabase');
    publicSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.reject(new Error('network error'))),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    }));

    const cachedCafes = [{ id: '1', name: 'Cached Cafe', city: 'Test' }];
    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'cafes_cache') return Promise.resolve(JSON.stringify(cachedCafes));
      return Promise.resolve(null);
    });

    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );

    await waitFor(() => expect(ctx?.cafes?.length).toBeGreaterThan(0));
    expect(ctx.cafes[0].name).toBe('Cached Cafe');
  });

  test('toggleVisited removes a previously visited cafe', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );
    await waitFor(() => expect(ctx).toBeDefined());

    await act(async () => { await ctx.toggleVisited('cafe-8'); });
    expect(ctx.isVisited('cafe-8')).toBe(true);

    await act(async () => { await ctx.toggleVisited('cafe-8'); });
    expect(ctx.isVisited('cafe-8')).toBe(false);
  });

  test('savePreferences updates state and persists all fields to AsyncStorage', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );
    await waitFor(() => expect(ctx).toBeDefined());

    act(() => {
      ctx.savePreferences('matcha', ['hidden_gem'], { type: 'city', city: 'Tokyo' });
    });

    await waitFor(() => expect(ctx.selectedDrink).toBe('matcha'));
    expect(ctx.selectedVibes).toEqual(['hidden_gem']);
    expect(ctx.selectedLocation).toEqual({ type: 'city', city: 'Tokyo' });
    expect(ctx.hasOnboarded).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedDrink', JSON.stringify('matcha'));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedVibes', JSON.stringify(['hidden_gem']));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('selectedLocation', JSON.stringify({ type: 'city', city: 'Tokyo' }));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('hasOnboarded', JSON.stringify(true));
  });

  test('resetOnboarding clears hasOnboarded and persists false', async () => {
    let ctx;
    render(
      <CafeProvider>
        <TestConsumer onContext={(c) => { ctx = c; }} />
      </CafeProvider>
    );
    await waitFor(() => expect(ctx).toBeDefined());

    act(() => { ctx.savePreferences('coffee', [], null); });
    await waitFor(() => expect(ctx.hasOnboarded).toBe(true));

    act(() => { ctx.resetOnboarding(); });
    await waitFor(() => expect(ctx.hasOnboarded).toBe(false));
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('hasOnboarded', JSON.stringify(false));
  });

  describe('location permission handling', () => {
    test('does not set userLocation when permission is denied', async () => {
      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );
      await waitFor(() => expect(ctx).toBeDefined());
      expect(ctx.userLocation).toBeNull();
    });

    test('sets userLocation from getCurrentPositionAsync when granted and no last-known position exists', async () => {
      const Location = require('expo-location');
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      Location.getLastKnownPositionAsync.mockResolvedValueOnce(null);
      Location.getCurrentPositionAsync.mockResolvedValueOnce({ coords: { latitude: 47.6, longitude: -122.3 } });

      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );

      await waitFor(() => expect(ctx?.userLocation).toEqual({ latitude: 47.6, longitude: -122.3 }));
    });

    test('uses last-known position without calling getCurrentPositionAsync when available', async () => {
      const Location = require('expo-location');
      Location.requestForegroundPermissionsAsync.mockResolvedValueOnce({ status: 'granted' });
      Location.getLastKnownPositionAsync.mockResolvedValueOnce({ coords: { latitude: 1, longitude: 2 } });

      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );

      await waitFor(() => expect(ctx?.userLocation).toEqual({ latitude: 1, longitude: 2 }));
      expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
    });
  });

  describe('fetchCafes / fetchCountries success and failure paths', () => {
    test('fetchCafes stores successful results and caches them', async () => {
      const { publicSupabase } = require('../../lib/supabase');
      const freshCafes = [{ id: '1', name: 'Fresh Cafe', city: 'Test' }];
      publicSupabase.from.mockImplementation((table) => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve(
            table === 'cafes' ? { data: freshCafes, error: null } : { data: [], error: null }
          )),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      }));

      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );

      await waitFor(() => expect(ctx?.cafes?.length).toBeGreaterThan(0));
      expect(ctx.cafes[0].name).toBe('Fresh Cafe');
      expect(ctx.isOffline).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('cafes_cache', JSON.stringify(freshCafes));
    });

    test('fetchCafes leaves cafes empty when both fetch and cache fail', async () => {
      const { publicSupabase } = require('../../lib/supabase');
      publicSupabase.from.mockImplementation(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.reject(new Error('network error'))),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      }));
      AsyncStorage.getItem.mockImplementation(() => Promise.resolve(null));

      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );

      await waitFor(() => expect(ctx?.loading).toBe(false));
      expect(ctx.cafes).toEqual([]);
      expect(ctx.isOffline).toBe(false);
    });

    test('fetchCountries stores successful results and caches them', async () => {
      const { publicSupabase } = require('../../lib/supabase');
      const freshCountries = [{ name: 'Japan' }];
      publicSupabase.from.mockImplementation((table) => ({
        select: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve(
            table === 'countries' ? { data: freshCountries, error: null } : { data: [], error: null }
          )),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      }));

      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );

      await waitFor(() => expect(ctx?.countries?.length).toBeGreaterThan(0));
      expect(ctx.countries[0].name).toBe('Japan');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('countries_cache', JSON.stringify(freshCountries));
    });

    test('fetchCountries falls back to AsyncStorage cache on failure', async () => {
      const { publicSupabase } = require('../../lib/supabase');
      publicSupabase.from.mockImplementation((table) => ({
        select: jest.fn(() => ({
          order: jest.fn(() => (
            table === 'countries'
              ? Promise.reject(new Error('network error'))
              : Promise.resolve({ data: [], error: null })
          )),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      }));

      const cachedCountries = [{ name: 'Italy' }];
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === 'countries_cache') return Promise.resolve(JSON.stringify(cachedCountries));
        return Promise.resolve(null);
      });

      let ctx;
      render(
        <CafeProvider>
          <TestConsumer onContext={(c) => { ctx = c; }} />
        </CafeProvider>
      );

      await waitFor(() => expect(ctx?.countries?.length).toBeGreaterThan(0));
      expect(ctx.countries[0].name).toBe('Italy');
    });
  });
});
