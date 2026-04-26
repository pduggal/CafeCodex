import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  test('falls back to AsyncStorage cache when Supabase fails', async () => {
    const { supabase } = require('../../lib/supabase');
    supabase.from.mockImplementation(() => ({
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
});
