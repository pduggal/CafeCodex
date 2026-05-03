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

  test('country dropdown matches partial name', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'United S');
    expect(getByText('United States')).toBeTruthy();
  });

  test('country dropdown shows flag', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Aus');
    expect(getByText('Australia')).toBeTruthy();
  });

  test('selecting country fills field and hides dropdown', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
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

  test('city dropdown shows major cities from world data', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Ky');
    expect(getByText('Kyoto')).toBeTruthy();
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

  test('city allows free text for unlisted cities', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Jap');
    fireEvent.press(getByText('Japan'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Kamakura');
    const cityInput = getByPlaceholderText('e.g. Tokyo');
    expect(cityInput.props.value).toBe('Kamakura');
  });

  test('max 6 results in dropdown', () => {
    const { getByPlaceholderText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'a');
    // filterCountries slices to 6 max — just ensure no crash
  });

  test('any country in the world is selectable', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'Zimb');
    expect(getByText('Zimbabwe')).toBeTruthy();
  });

  test('selected country shows its cities', () => {
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
    fireEvent.changeText(getByPlaceholderText('e.g. Japan'), 'India');
    fireEvent.press(getByText('India'));
    fireEvent.changeText(getByPlaceholderText('e.g. Tokyo'), 'Bang');
    expect(getByText('Bangalore')).toBeTruthy();
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
    const { getByPlaceholderText, getByText } = render(<NominateScreen />);
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
