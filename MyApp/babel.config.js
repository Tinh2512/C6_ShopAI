module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // NativeWind v4 uses a different plugin name
    'nativewind/babel',
  ],
};