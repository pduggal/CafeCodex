import React from 'react';
import { render } from '@testing-library/react-native';
import NominateScreen from '../../screens/NominateScreen';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children, ...props }) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

describe('NominateScreen', () => {
  test('form renders all required field labels', () => {
    const { getByText } = render(<NominateScreen />);
    expect(getByText(/Café name/i)).toBeTruthy();
    expect(getByText(/City/i)).toBeTruthy();
    expect(getByText(/Country/i)).toBeTruthy();
    expect(getByText(/What makes it honest/i)).toBeTruthy();
    expect(getByText(/Must order/i)).toBeTruthy();
    expect(getByText(/Your name/i)).toBeTruthy();
  });

  test('submit button is disabled when fields are empty', () => {
    const { getByText } = render(<NominateScreen />);
    const submitBtn = getByText(/Send to Pallavi/);
    const touchable = submitBtn.parent;
    let current = touchable;
    let isDisabled = false;
    while (current) {
      if (current.props?.disabled || current.props?.accessibilityState?.disabled) {
        isDisabled = true;
        break;
      }
      current = current.parent;
    }
    expect(isDisabled).toBe(true);
  });

  test('Telegram notification is configured in source', () => {
    const fs = require('fs');
    const path = require('path');
    const src = fs.readFileSync(
      path.join(__dirname, '../../screens/NominateScreen.js'),
      'utf-8'
    );
    expect(src).toContain('api.telegram.org');
    expect(src).toContain('sendMessage');
  });
});
