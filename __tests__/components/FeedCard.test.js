import React from 'react';
import { render } from '@testing-library/react-native';
import FeedCard from '../../components/FeedCard';

const NOW = new Date().toISOString();

const CAFE_POST = {
  id: '1',
  type: 'cafe',
  title: 'Onyx Coffee Lab',
  subtitle: 'Seattle · Specialty Coffee',
  body: null,
  image_url: 'https://example.com/photo.jpg',
  cafe_id: '42',
  metadata: { owner_quote: 'Every cup tells a story', instagram: '@onyxcoffee' },
  published_at: NOW,
  is_active: true,
};

const CITY_POST = {
  id: '2',
  type: 'city',
  title: 'Tokyo is live!',
  subtitle: '12 cafes · 3 curator picks',
  body: "Tokyo's kissaten culture is unlike anything else.",
  image_url: null,
  cafe_id: null,
  metadata: { cafe_count: 12, curator_picks: 3, city: 'Tokyo' },
  published_at: NOW,
  is_active: true,
};

const RECIPE_POST = {
  id: '3',
  type: 'recipe',
  title: 'Lavender Oat Latte',
  subtitle: 'from Blue Bottle · NYC',
  body: null,
  image_url: null,
  cafe_id: null,
  metadata: { ingredients: ['Double espresso', 'Oat milk', 'Lavender syrup'], from_cafe: 'Blue Bottle' },
  published_at: NOW,
  is_active: true,
};

const UPDATE_POST = {
  id: '4',
  type: 'update',
  title: '362 cafes and counting',
  subtitle: null,
  body: 'Your nominations are shaping the codex.',
  image_url: null,
  cafe_id: null,
  metadata: {},
  published_at: NOW,
  is_active: true,
};

describe('FeedCard', () => {
  test('renders cafe post with title, subtitle, and owner quote', () => {
    const { getByText } = render(<FeedCard post={CAFE_POST} />);
    expect(getByText('Onyx Coffee Lab')).toBeTruthy();
    expect(getByText('Seattle · Specialty Coffee')).toBeTruthy();
    expect(getByText(/Every cup tells a story/)).toBeTruthy();
    expect(getByText('☕ JUST ADDED')).toBeTruthy();
  });

  test('renders city post with title and subtitle', () => {
    const { getByText } = render(<FeedCard post={CITY_POST} />);
    expect(getByText('Tokyo is live!')).toBeTruthy();
    expect(getByText('12 cafes · 3 curator picks')).toBeTruthy();
    expect(getByText('🗺 NEW CITY LIVE')).toBeTruthy();
  });

  test('renders recipe post with ingredient list', () => {
    const { getByText } = render(<FeedCard post={RECIPE_POST} />);
    expect(getByText('Lavender Oat Latte')).toBeTruthy();
    expect(getByText('🧪 SECRET RECIPE')).toBeTruthy();
    expect(getByText('◦  Double espresso')).toBeTruthy();
    expect(getByText('◦  Oat milk')).toBeTruthy();
    expect(getByText('◦  Lavender syrup')).toBeTruthy();
  });

  test('renders update post with body text', () => {
    const { getByText } = render(<FeedCard post={UPDATE_POST} />);
    expect(getByText('362 cafes and counting')).toBeTruthy();
    expect(getByText('Your nominations are shaping the codex.')).toBeTruthy();
    expect(getByText('✦ FROM PALLAVI')).toBeTruthy();
  });

  test('shows relative timestamp', () => {
    const { getByText } = render(<FeedCard post={UPDATE_POST} />);
    expect(getByText('just now')).toBeTruthy();
  });

  test('shows CTA button for cafe post with onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(<FeedCard post={CAFE_POST} onPress={onPress} />);
    expect(getByText('☕ View Cafe →')).toBeTruthy();
  });

  test('does not show CTA for update post', () => {
    const { queryByText } = render(<FeedCard post={UPDATE_POST} />);
    expect(queryByText(/View Cafe/)).toBeNull();
    expect(queryByText(/Explore/)).toBeNull();
  });
});
