import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    isSaved: () => false,
    toggleSaved: jest.fn(),
    isVisited: () => false,
  }),
}));

import CafeCard from '../../components/CafeCard';

const baseCafe = {
  id: '1',
  name: 'Test Cafe',
  city: 'Seattle',
  neighborhood: 'Capitol Hill',
  drink: 'coffee',
  vibe_tags: ['specialty_coffee', 'cozy_quiet'],
  curator_pick: false,
  is_active: true,
};

describe('CafeCard', () => {
  test('renders name and city', () => {
    const { getByText } = render(<CafeCard cafe={baseCafe} onPress={() => {}} />);
    expect(getByText('Test Cafe')).toBeTruthy();
    expect(getByText(/Seattle/)).toBeTruthy();
  });

  test('handles null vibe_tags without crash', () => {
    const cafe = { ...baseCafe, vibe_tags: null };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText('Test Cafe')).toBeTruthy();
  });

  test('shows Closed badge when is_active is false', () => {
    const cafe = { ...baseCafe, is_active: false };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText(/Closed/)).toBeTruthy();
  });

  test('shows curator pick and press mention badges', () => {
    const cafe = { ...baseCafe, curator_pick: true, press_mention: 'Featured in NYT' };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText(/Pallavi's Pick/)).toBeTruthy();
    expect(getByText('Featured in NYT')).toBeTruthy();
  });

  test('shows instagram handle when present', () => {
    const cafe = { ...baseCafe, instagram_handle: 'testcafe' };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText('@testcafe')).toBeTruthy();
  });

  test('hides instagram handle when absent', () => {
    const { queryByText } = render(<CafeCard cafe={baseCafe} onPress={() => {}} />);
    expect(queryByText(/@/)).toBeNull();
  });

  test('shows must-try drink when present', () => {
    const cafe = { ...baseCafe, must_try: { drink: 'Oat Latte', note: 'Best in the city' } };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText(/Must try.*Oat Latte/)).toBeTruthy();
  });

  test('shows trending badge when trending and not curator pick', () => {
    const cafe = { ...baseCafe, trending: true };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText(/Trending/)).toBeTruthy();
  });

  test('shows neighborhood in location text', () => {
    const { getByText } = render(<CafeCard cafe={baseCafe} onPress={() => {}} />);
    expect(getByText(/Capitol Hill/)).toBeTruthy();
  });

  test('shows star rating when curator_rating is present', () => {
    const cafe = { ...baseCafe, curator_rating: 4 };
    const { getByText } = render(<CafeCard cafe={cafe} onPress={() => {}} />);
    expect(getByText('★★★★')).toBeTruthy();
  });
});
