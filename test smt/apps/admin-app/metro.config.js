const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.entry = './index.js';

module.exports = config;
