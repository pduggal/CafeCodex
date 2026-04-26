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
});
