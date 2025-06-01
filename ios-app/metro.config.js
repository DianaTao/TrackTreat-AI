// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add basic resolver for Node.js modules
config.resolver.extraNodeModules = {
  // Empty implementations for problematic modules
  net: require.resolve('./src/polyfills/empty-module'),
  tls: require.resolve('./src/polyfills/empty-module'),
  stream: require.resolve('stream-browserify'),
  http: require.resolve('./src/polyfills/empty-module'),
  https: require.resolve('./src/polyfills/empty-module'),
  zlib: require.resolve('./src/polyfills/empty-module'),
  crypto: require.resolve('crypto-browserify'),
};

// Add support for CommonJS modules
config.transformer.allowOptionalDependencies = true;

module.exports = config;
