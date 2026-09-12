module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  // `server/` is a separate Node/Express project with its own `npm test` —
  // without this it gets swept into the app's RN-preset jest run too.
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/server/'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|react-navigation|@react-navigation/.*|@react-native-async-storage/.*|@gorhom/.*|react-native-reanimated|react-native-gesture-handler|react-native-vector-icons|react-native-config|@reduxjs/.*|react-redux|immer))',
  ],
};
