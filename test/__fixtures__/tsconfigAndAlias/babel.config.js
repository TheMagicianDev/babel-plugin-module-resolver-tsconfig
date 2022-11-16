const { setModuleResolverPluginForTsConfig } = require('../../../lib/index');

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-typescript'],
  plugins: [
    '@babel/plugin-transform-runtime',
    setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      alias: {
        '^@hooks/(.*)': './src/hooks/\\1'
      }
    })
  ]
};
