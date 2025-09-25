module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Adiciona o plugin do Reanimated.
      // IMPORTANTE: Ele deve ser o último plugin na lista.
      'react-native-reanimated/plugin',
    ],
  };
};