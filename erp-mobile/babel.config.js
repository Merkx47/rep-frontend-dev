module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/navigation': './src/navigation',
            '@/services': './src/services',
            '@/hooks': './src/hooks',
            '@/contexts': './src/contexts',
            '@/store': './src/store',
            '@/types': './src/types',
            '@/utils': './src/utils',
            '@/config': './src/config',
            '@/constants': './src/constants',
            '@/api': './src/api',
            '@/lib': './src/lib',
            '@/assets': './src/assets',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
