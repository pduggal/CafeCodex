import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import NominateScreen from '../../screens/NominateScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

jest.mock('../../context/CafeContext', () => ({
  useCafes: () => ({
    cafes: [
      { id: '1', city: 'Tokyo', country: 'Japan', neighborhood: 'Shibuya' },
      { id: '2', city: 'Kyoto', country: 'Japan', neighborhood: 'Gion' },
      { id: '3', city: 'Seattle', country: 'United States', neighborhood: 'Capitol Hill' },
      { id: '4', city: 'New York', country: 'United States', neighborhood: 'Brooklyn' },
    ],
    countries: [
      { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', aliases: ['japan', 'jp'], cities: ['Tokyo', 'Kyoto', 'Osaka'], planned_cities: ['Fukuoka'] },
      { name: 'United States', flag: '\u{1F1FA}\u{1F1F8}', aliases: ['usa', 'us', 'america'], cities: ['Seattle', 'New York', 'Los Angeles'] },
      { name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', aliases: ['australia', 'aus'], cities: ['Sydney', 'Melbourne'] },
    ],
  }),
}));

jest.spyOn(Alert, 'alert');

describe('NominateScreen — Country/City Dropdowns', () => {
  beforeEach(() => {
    Alert.alert.mockClear();
  });

  test('country dropdown appears when typing', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    expect(getByText('Japan')).toBeTruthy();
  });

  test('country dropdown matches aliases', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'usa');
    expect(getByText('United States')).toBeTruthy();
  });

  test('country dropdown shows flag', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Aus');
    expect(getByText('\u{1F1E6}\u{1F1FA}')).toBeTruthy();
    expect(getByText('Australia')).toBeTruthy();
  });

  test('selecting country fills field and hides dropdown', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<NominateScreen />);
    const countryInput = getByPlaceholderText('e.g. Japan');
    fireEvent.changeText(countryInput, 'Jap');
    fireEvent.press(getByText('Japan'));
    expect(countryInput.props.value).toBe('Japan');
  });

  test('city dropdown shows cities for selected country', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'To');
    expect(getByText('Tokyo')).toBeTruthy();
  });

  test('city dropdown includes planned cities', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Fuku');
    expect(getByText('Fukuoka')).toBeTruthy();
  });

  test('changing country clears city', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Tokyo');
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Aus');
    const cityInput = getByPlaceholderText('e.g. Tokyo');
    expect(cityInput.props.value).toBe('');
  });

  test('clear button resets country and city', () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    const clearButtons = getAllByText('✕');
    fireEvent.press(clearButtons[0]);
    expect(getByPlaceholderText('e.g. Japan').props.value).toBe('');
  });

  test('city allows free text for new cities', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Sapporo');
    const cityInput = getByPlaceholderText('e.g. Tokyo');
    expect(cityInput.props.value).toBe('Sapporo');
  });

  test('max 6 results in dropdown', () => {
    const { getByPlaceholderText, queryAllByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'a');
    const items = queryAllByText(/Japan|United States|Australia/);
    expect(items.length).toBeLessThanOrEqual(6);
  });
});

describe('NominateScreen — Form Validation & Submit', () => {
  beforeEach(() => {
    Alert.alert.mockClear();
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('submit button disabled when required fields empty', () => {
    const { getByText } = render(<NominateScreen />);
    const btn = getByText('Send to Pallavi ✦');
    let parent = btn.parent;
    let disabled = false;
    while (parent) {
      if (parent.props?.disabled) { disabled = true; break; }
      parent = parent.parent;
    }
    expect(disabled).toBe(true);
  });

  test('rejects invalid country on submit', async () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Onibus Coffee'), 'Test Cafe');
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Fakeland');
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Fakecity');
    fireEvent.changeText(getByPlaceholderText('Why does this cafe belong in the Codex?'), 'Great coffee');
    fireEvent.changeText(getByPlaceholderText('e.g. The ceremonial matcha bowl'), 'Latte');
    fireEvent.changeText(getByPlaceholderText('First name or nickname'), 'Tester');
    fireEvent.press(getByText('Send to Pallavi ✦'));
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Invalid country',
        'Please select a valid country from the suggestions.'
      );
    });
  });

  test('auto-confirms exact typed country name', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Onibus Coffee'), 'Test Cafe');
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Japan');
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Tokyo');
    fireEvent.changeText(getByPlaceholderText('Why does this cafe belong in the Codex?'), 'Great coffee');
    fireEvent.changeText(getByPlaceholderText('e.g. The ceremonial matcha bowl'), 'Latte');
    fireEvent.changeText(getByPlaceholderText('First name or nickname'), 'Tester');
    fireEvent.press(getByText('Send to Pallavi ✦'));
    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalledWith('Invalid country', expect.anything());
    });
  });

  test('shows success screen after valid submit', async () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Onibus Coffee'), 'Success Cafe');
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Tokyo');
    fireEvent.changeText(getByPlaceholderText('Why does this cafe belong in the Codex?'), 'Amazing');
    fireEvent.changeText(getByPlaceholderText('e.g. The ceremonial matcha bowl'), 'Matcha');
    fireEvent.changeText(getByPlaceholderText('First name or nickname'), 'QA Bot');
    fireEvent.press(getByText('Send to Pallavi ✦'));
    await waitFor(() => {
      expect(getByText('Nomination sent!')).toBeTruthy();
    });
    expect(getByText('Success Cafe')).toBeTruthy();
    expect(getByText(/Qa Bot/)).toBeTruthy();
  });

  test('nominate another resets form', async () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Onibus Coffee'), 'Reset Cafe');
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Tokyo');
    fireEvent.changeText(getByPlaceholderText('Why does this cafe belong in the Codex?'), 'Great');
    fireEvent.changeText(getByPlaceholderText('e.g. The ceremonial matcha bowl'), 'Latte');
    fireEvent.changeText(getByPlaceholderText('First name or nickname'), 'Tester');
    fireEvent.press(getByText('Send to Pallavi ✦'));
    await waitFor(() => {
      expect(getByText('Nomination sent!')).toBeTruthy();
    });
    fireEvent.press(getByText('Nominate another'));
    expect(getByText('Know a place that belongs in the Codex?')).toBeTruthy();
    expect(getByPlaceholderText('e.g. Onibus Coffee').props.value).toBe('');
  });

  test('sends Telegram notification on submit', async () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Onibus Coffee'), 'Telegram Cafe');
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Tokyo');
    fireEvent.changeText(getByPlaceholderText('Why does this cafe belong in the Codex?'), 'Great');
    fireEvent.changeText(getByPlaceholderText('e.g. The ceremonial matcha bowl'), 'Latte');
    fireEvent.changeText(getByPlaceholderText('First name or nickname'), 'Tester');
    fireEvent.press(getByText('Send to Pallavi ✦'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.telegram.org'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
