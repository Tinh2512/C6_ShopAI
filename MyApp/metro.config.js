const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind }               = require('nativewind/metro');

const config = mergeConfig(getDefaultConfig(__dirname), {
  /* add any custom metro config here */
});

module.exports = withNativeWind(config, {
  input: './global.css',   // NativeWind v4 requires a CSS entry point
});