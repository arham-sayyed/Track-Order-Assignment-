/* eslint-disable @typescript-eslint/no-require-imports -- `jest.mock` factories are
   hoisted above imports, so they must use `require()` for their mock modules. */

// RNTL 13 (needed for React 19.2) removed the `/extend-expect` subpath; importing
// the package entry auto-registers the built-in Jest matchers (toHaveTextContent,
// toBeOnTheScreen, ...) that `/extend-expect` used to provide.
import '@testing-library/react-native';

// `@react-native-async-storage/async-storage` is a real dependency. Use the
// package's bundled Jest mock so tests get an in-memory store.
jest.mock(
  '@react-native-async-storage/async-storage',
  () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// `react-native-config` reads its native module (`RNCConfigModule`) at import
// time, which does not exist under Jest (no native app build). Default to an
// empty config — same as an unset `.env` — so `isRazorpayConfigured` is false
// and the simulated gateway is used, matching the pre-migration default.
jest.mock('react-native-config', () => ({ __esModule: true, default: {} }));

// `react-native-razorpay` constructs a `NativeEventEmitter` at import time,
// which throws under Jest (no native app build). `razorpayGateway.ts` imports
// it statically, so any test that touches `payments/index.ts` (even to reach
// the simulated gateway) needs this mocked — tests that assert on Checkout
// itself override it locally with their own `jest.mock`.
jest.mock('react-native-razorpay', () => ({ __esModule: true, default: { open: jest.fn() } }));

// `react-native-vector-icons` ships real font-glyph components that Jest can't
// render meaningfully in a text-based test tree. Render each family as a plain
// `Text` node so props (accessibilityLabel, testID, ...) still apply and text
// queries keep working — same shape the old @expo/vector-icons mock used.
//
// `jest.mock`'s factory is hoisted above imports and must be an inline function
// literal (not the return value of a helper call), so each family gets its own
// call with the same body inlined.
jest.mock('react-native-vector-icons/Ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name, ...rest }: { name?: string }) =>
    React.createElement(Text, rest, name ?? 'Ionicons');
  Icon.displayName = 'Ionicons';
  return { __esModule: true, default: Icon };
});

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const Icon = ({ name, ...rest }: { name?: string }) =>
    React.createElement(Text, rest, name ?? 'MaterialCommunityIcons');
  Icon.displayName = 'MaterialCommunityIcons';
  return { __esModule: true, default: Icon };
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    State: {},
    Directions: {},
  };
});
