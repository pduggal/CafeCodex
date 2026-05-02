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

jest.mock('./lib/supabase', () => {
  const mockSelect = jest.fn(() => {
    const chain = {
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      order: jest.fn(() => Promise.resolve({ data: [], error: null })),
    };
    return chain;
  });
  return {
    supabase: {
      from: jest.fn(() => ({
        select: mockSelect,
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      auth: {
        getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
        onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
        signUp: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-uid' } }, error: null })),
        signInWithPassword: jest.fn(() => Promise.resolve({ data: { session: { user: { id: 'test-uid' } } }, error: null })),
        signOut: jest.fn(() => Promise.resolve({ error: null })),
      },
    },
  };
});

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');
  const mockChainable = () => {
    const handler = {};
    const methods = ['activeOffsetX', 'failOffsetY', 'maxDuration', 'enabled',
      'onBegin', 'onUpdate', 'onEnd', 'onStart', 'onFinalize'];
    methods.forEach((m) => { handler[m] = () => handler; });
    return handler;
  };
  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }) => children,
    Gesture: {
      Pan: mockChainable,
      Tap: mockChainable,
      Race: () => ({}),
      Exclusive: () => ({}),
    },
  };
});

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  const Reanimated = {
    View,
    Text: require('react-native').Text,
    createAnimatedComponent: (comp) => comp,
  };
  return {
    __esModule: true,
    default: Reanimated,
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withTiming: (val) => val,
    withSpring: (val) => val,
    interpolate: () => 0,
    runOnJS: (fn) => fn,
    Extrapolation: { CLAMP: 'clamp' },
  };
});
