import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import FeedScreen from '../../screens/FeedScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

const mockNavigate = jest.fn();
const mockNavigation = { navigate: mockNavigate };

const MOCK_CAFES = [
  { id: '10', name: 'Onibus Coffee', city: 'Tokyo', country: 'Japan', neighborhood: 'Nakameguro' },
  { id: '20', name: 'Elm Coffee Roasters', city: 'Seattle', country: 'United States', neighborhood: 'Pioneer Square' },
];

const MOCK_POSTS = [
  {
    id: 'p1', type: 'cafe', title: 'Onibus Coffee', subtitle: 'Tokyo, Japan',
    body: 'The pour-over here is unreal.', image_url: 'https://example.com/onibus.jpg',
    cafe_id: '10', published_at: new Date().toISOString(), is_active: true, metadata: {},
  },
  {
    id: 'p2', type: 'city', title: 'Seattle is Live!', subtitle: '12 cafes added',
    body: 'Coffee capital of the US.', image_url: null,
    cafe_id: null, published_at: new Date().toISOString(), is_active: true,
    metadata: { city: 'Seattle' },
  },
  {
    id: 'p3', type: 'recipe', title: 'Secret Matcha Latte', subtitle: null,
    body: 'Try this at home.', image_url: null,
    cafe_id: null, published_at: new Date().toISOString(), is_active: true,
    metadata: { ingredients: ['Ceremonial matcha', 'Oat milk', 'Honey'] },
  },
  {
    id: 'p4', type: 'update', title: 'App Update v2.0', subtitle: 'New features',
    body: 'Dark mode and more.', image_url: null,
    cafe_id: null, published_at: new Date().toISOString(), is_active: true, metadata: {},
  },
];

let mockCafes = MOCK_CAFES;
jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({ cafes: mockCafes }),
}));

const mockSupabaseData = { data: null, error: null };
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve(mockSupabaseData),
        }),
      }),
    }),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

describe('FeedScreen — Empty State', () => {
  beforeEach(() => {
    mockSupabaseData.data = null;
    mockSupabaseData.error = new Error('empty');
    mockNavigate.mockClear();
  });

  test('shows empty state icon and message', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Nothing new yet')).toBeTruthy();
    });
    expect(getByText('Check back soon for new cafes, cities, and recipes.')).toBeTruthy();
  });

  test('shows header even when empty', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText("What's New")).toBeTruthy();
      expect(getByText('The latest from the codex')).toBeTruthy();
    });
  });
});

describe('FeedScreen — With Posts', () => {
  beforeEach(() => {
    mockSupabaseData.data = MOCK_POSTS;
    mockSupabaseData.error = null;
    mockNavigate.mockClear();
  });

  test('renders all post titles', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Onibus Coffee')).toBeTruthy();
    });
    expect(getByText('Seattle is Live!')).toBeTruthy();
    expect(getByText('Secret Matcha Latte')).toBeTruthy();
    expect(getByText('App Update v2.0')).toBeTruthy();
  });

  test('renders type badges for each post type', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('☕ JUST ADDED')).toBeTruthy();
    });
    expect(getByText('🗺 NEW CITY LIVE')).toBeTruthy();
    expect(getByText('🧪 SECRET RECIPE')).toBeTruthy();
    expect(getByText('✦ FROM PALLAVI')).toBeTruthy();
  });

  test('cafe post shows View Cafe CTA', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('☕ View Cafe →')).toBeTruthy();
    });
  });

  test('tapping cafe CTA navigates to CafeDetail', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('☕ View Cafe →')).toBeTruthy();
    });
    fireEvent.press(getByText('☕ View Cafe →'));
    expect(mockNavigate).toHaveBeenCalledWith('CafeDetail', { cafe: MOCK_CAFES[0] });
  });

  test('recipe post renders ingredients list', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('◦  Ceremonial matcha')).toBeTruthy();
    });
    expect(getByText('◦  Oat milk')).toBeTruthy();
    expect(getByText('◦  Honey')).toBeTruthy();
  });

  test('post body text is rendered', async () => {
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('The pour-over here is unreal.')).toBeTruthy();
    });
  });

  test('update post has no CTA button', async () => {
    const { getByText, queryByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('App Update v2.0')).toBeTruthy();
    });
    expect(queryByText('☕ View Cafe →')).toBeTruthy();
  });
});

describe('FeedScreen — Cafe Navigation Edge Cases', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('cafe post with no matching cafe does not navigate', async () => {
    mockSupabaseData.data = [{
      id: 'p-orphan', type: 'cafe', title: 'Removed Cafe',
      cafe_id: '999', published_at: new Date().toISOString(),
      is_active: true, metadata: {},
    }];
    mockSupabaseData.error = null;
    const { getByText } = render(<FeedScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('Removed Cafe')).toBeTruthy();
    });
  });
});
