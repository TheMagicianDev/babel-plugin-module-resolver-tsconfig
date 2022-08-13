const path = require('path')

const PWD = process.env.PWD || process.cwd();

function getRootDir() {
  const configFileArgIndex = process.argv.indexOf('--config-file')

  // config file specified in babel command
  if (configFileArgIndex > 0) {
    const configFilePath = process.argv[configFileArgIndex + 1]
    return path.dirname(configFilePath)
  }

  // no config file in command, so it is required that pwd be the project directory where babelrc is defined
  return PWD;
}

/**
 * @param {*} config Optional. Allow us to provide any extra config for the plugin. Including overriding root. And alias prop would be merged instead of override
 * @returns 'babel-plugin-module-resolver' config set to follow typescript tsconfig alias input (baseUrl & paths)
 */
function setModuleResolverPluginForTsConfig(config = {}) {
  let {
    tsconfigPath,
    ...restConfig
  } = config

  tsconfigPath = tsconfigPath || path.join(getRootDir(), 'tsconfig.json')
  const tsconfig = require(tsconfigPath)

  return [
    require.resolve('babel-plugin-module-resolver'),
    {
      root: tsconfig.compilerOptions.baseUrl,
      ...restConfig,
      alias: {
        ...tsconfig.compilerOptions.paths,
        ...restConfig.alias
      },
    }
  ]
}

module.exports = {
  setModuleResolverPluginForTsConfig
}
