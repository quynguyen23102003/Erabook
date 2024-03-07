module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', '.json'],
        alias: {
          'moti/skeleton': 'moti/skeleton/react-native-linear-gradient',
          '@assets': ['./src/assets'],
          '@navigator': ['./src/navigator'],
          '@components': ['./src/components'],
          '@themes': ['./src/themes'],
          '@redux': ['./src/redux'],
          '@screens': ['./src/screens'],
          '@types': ['./src/types'],
          '@utils': ['./src/utils'],
          '@services': ['./src/services'],
          '@hooks': ['./src/hooks'],
          '@translations': ['./src/translations'],
        },
      },
    ],
    'react-native-reanimated/plugin',
    'nativewind/babel',
  ],
};
