const { setModuleResolverPluginForTsConfig } = require('../../../src/index')

module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/plugin-transform-runtime", setModuleResolverPluginForTsConfig({ tsconfigPath: './tsconfig.json', root: './someOther' })
  ]
}
