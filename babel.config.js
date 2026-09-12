module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:@react-native/babel-preset'],
    // `react-native-worklets/plugin` must be listed LAST. It powers
    // Reanimated v4, which @gorhom/bottom-sheet depends on.
    plugins: ['react-native-worklets/plugin'],
  };
};
