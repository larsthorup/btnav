/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'react-native',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  transformIgnorePatterns: [
    `node_modules/(?!(${[
      'react-native',
      '@react-native',
      'react-native-ble-plx',
      'react-native-compass-heading',
      'react-native-input-spinner',
      'react-native-switch-selector',
    ].join('|')})/)`
  ]
};

module.exports = config;
