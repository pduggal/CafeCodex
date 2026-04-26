import '@testing-library/jest-native/extend-expect';

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  const MockIcon = (props) => <Text>{props.name}</Text>;
  return {
    Ionicons: MockIcon,
    MaterialIcons: MockIcon,
    FontAwesome: MockIcon,
  };
});

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key) => Promise.resolve(store[key] || null)),
      setItem: jest.fn((key, value) => { store[key] = value; return Promise.resolve(); }),
      removeItem: jest.fn((key) => { delete store[key]; return Promise.resolve(); }),
      clear: jest.fn(() => { store = {}; return Promise.resolve(); }),
    },
  };
});

jest.mock('./lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
}));
