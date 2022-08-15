const path = require('path')
const fs = require('fs')
const json5 = require('json5')

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
 * @param {*} config Optional. Allow us to provide any extra config for the plugin. Including extending root (merge array). And alias prop would be merged too.
 * Any other config if it would exist it will be set directly
 * @returns 'babel-plugin-module-resolver' config set to follow typescript tsconfig alias input (baseUrl & paths)
 */
function setModuleResolverPluginForTsConfig(config = {}) {
  let {
    tsconfigPath,
    ...restConfig
  } = config

  tsconfigPath = tsconfigPath || path.join(getRootDir(), 'tsconfig.json')

  if (!fs.existsSync(tsconfigPath)) {
    throw new Error(tsconfigPath + ' does\'t exist!');
  }

  const tsconfigContent = fs.readFileSync(tsconfigPath, { encoding: 'utf8'})
  const tsconfig = json5.parse(tsconfigContent)

  const pluginConfig = {}

  // handle root config
  let rootExtra = restConfig.root || []
  if (!Array.isArray(rootExtra)) {
    rootExtra = [rootExtra]
  }

  let root = []
  if (tsconfig.compilerOptions.baseUrl) {
    root.push(tsconfig.compilerOptions.baseUrl)
  }
  if (rootExtra.length) {
    root = [...root, ...rootExtra]
  }

  if (root.length) {
    pluginConfig.root = root
  }

  // handle alias config
  const convertedTsconfigPaths = Object.entries(tsconfig.compilerOptions.paths).reduce((aliases, [alias, aliasMap]) => {
    if (typeof aliasMap === 'string') {
      aliases[alias] = aliasMap
      return aliases
    }

    if (Array.isArray(aliasMap)) {
      if (aliasMap.length === 1) {
        aliases[alias] = aliasMap[0]
        return aliases
      }

      throw new Error('Use one mapping for each alias (tsconfig.json>compilerOptions.paths). Array of length 1.')
    } 
  }, {})

  pluginConfig.alias = {
    ...convertedTsconfigPaths,
    ...restConfig.alias
  }

  return [
    require.resolve('babel-plugin-module-resolver'),
    {
      ...restConfig,
      ...pluginConfig
    }
  ]
}

module.exports = {
  setModuleResolverPluginForTsConfig
}
