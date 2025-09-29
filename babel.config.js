module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Plugin para usar variáveis de ambiente com @env
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
      // Adiciona o plugin do Reanimated.
      // IMPORTANTE: Ele deve ser o último plugin na lista.
      'react-native-reanimated/plugin',
    ],
  };
};