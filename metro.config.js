const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Simplified configuration to avoid Prebuild issues
config.resolver.assetExts.push("sql");

module.exports = withNativeWind(config, { input: "./app/global.css" });
