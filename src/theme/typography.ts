import { TextStyle } from 'react-native';

/** Shared text styles. Spread into `StyleSheet.create` entries. */
export const typography = {
  h1: { fontSize: 20, fontWeight: '700' } as TextStyle,
  title: { fontSize: 16, fontWeight: '600' } as TextStyle,
  body: { fontSize: 14, fontWeight: '400' } as TextStyle,
  caption: { fontSize: 12, fontWeight: '400' } as TextStyle,
  price: { fontSize: 15, fontWeight: '700' } as TextStyle,
} as const;
