/**
 * @param {*} config Optional. Allow us to provide any extra config for the plugin. Including overriding root. And alias prop would be merged instead of override
 * @returns 'babel-plugin-module-resolver' config set to follow typescript tsconfig alias input (baseUrl & paths)
 */
function setModuleResolverPluginForTsConfig(config) {
  const tsconfig = require('./tsconfig.json')
  config = config || {}

  return [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: tsconfig.compilerOptions.baseUrl,
      ...config,
      alias: {
        ...tsconfig.compilerOptions.paths,
        ...config.alias
      },
    }
  ]
}

module.exports = {
  setModuleResolverPluginForTsConfig
}
