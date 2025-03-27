module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@assets': './src/assets',
          '@components': './src/components',
          '@navigation': './src/navigation',
          '@scenes': './src/scenes',
          '@context': './src/context',
          '@state': './src/state',
          '@services': './src/services',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@utils/types': './src/utils/types',
          '@styles': './src/styles',
          '@types': './src/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
