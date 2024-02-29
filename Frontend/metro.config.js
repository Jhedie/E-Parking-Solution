// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true
});

// Expo 49 issue: default metro config needs to include "mjs"
// https://github.com/expo/expo/issues/23180
config.resolver.sourceExts.push("mjs");

// Add SVG transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Exclude SVG files from being handled by asset module
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');

// Include SVG files to be handled by react-native-svg-transformer
config.resolver.sourceExts.push('svg');

module.exports = config;
