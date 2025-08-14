const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add support for additional file extensions and platforms
config.resolver.assetExts.push('sql');
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure for Leaflet and web libraries
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  // Add any specific aliases if needed
};

// Ensure proper handling of CSS imports for web
config.transformer.assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';

module.exports = withNativeWind(config, { input: './app/global.css' });
