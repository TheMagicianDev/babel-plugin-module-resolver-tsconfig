const path = require('path');
const fs = require("fs");
const json5 = require("json5");

const PWD = process.env.PWD || process.cwd();

function resolveDirPath(pth) {
  if (last(pth) === '/') {
    return pth.substring(0, pth.length - 1)
  }
  return pth
}

function getRootDir() {
  const configFileArgIndex = process.argv.indexOf('--config-file')

  // config file specified in babel command
  if (configFileArgIndex > 0) {
    const babelConfigFilePath = process.argv[configFileArgIndex + 1]
    if (path.isAbsolute(babelConfigFilePath)) {
      return path.dirname(babelConfigFilePath)
    }
    return path.dirname(
      path.join(
        path.dirname(module.parent.filename),
        babelConfigFilePath
      )
    )
  }

  // no config file in command, so it is required that pwd be the project directory where babelrc is defined
  return path.dirname(module.parent.filename) || PWD;
}

function readAndParseTsConfig(tsconfigPath) {
  const tsconfigContent = fs.readFileSync(tsconfigPath, { encoding: 'utf8'})

  return json5.parse(tsconfigContent)
}

function last(arr, backStep = 0) {
  return arr[arr.length - backStep - 1]
}

function resolveRoot(config, tsConfig) {
  // If a function then we pass the tsconfig baseUrl. And let the user form what he want
  if (typeof config?.root === 'function') {
    return config.root(tsConfig.compilerOptions.baseUrl) || []
  }

  // Otherwise we use the baseUrl and merge any extra provided root elements
  let root = []
  if (typeof config?.root === 'string') {
    root = [config.root]
  } else if(Array.isArray(config?.root)) {
    root = [...config.root]
  }

  if (tsConfig.compilerOptions.baseUrl && !root.includes(resolveDirPath(tsConfig.compilerOptions.baseUrl))) {
    root.push(tsConfig.compilerOptions.baseUrl)
  }

  return root
}

function resolveAlias(alias, aliasMap) {
  if (last(alias) === '*') {
    
    return {
      ['^' + alias.replace('*', '(.*)')]: aliasMap[0].replace('*', '\\1')
   }
  } else {
    /**
     * There is no *
     */
    return {
      [alias]: aliasMap[0]
    }
  }
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

  if (tsconfigPath && !path.isAbsolute(tsconfigPath)) {
    tsconfigPath = path.join(path.dirname(module.parent.filename), tsconfigPath)
  }

  tsconfigPath = tsconfigPath || path.join(getRootDir(), 'tsconfig.json')

  if (!fs.existsSync(tsconfigPath)) {
    throw new Error(tsconfigPath + ' does\'t exist!');
  }

  const tsConfig = readAndParseTsConfig(tsconfigPath)

  const pluginConfig = {}

  // handle root config
  const root = resolveRoot(restConfig, tsConfig)

  if (root.length) {
    pluginConfig.root = root
  }

  // handle alias config
  if (tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
    const convertedTsconfigPaths = Object.entries(tsConfig.compilerOptions.paths).reduce((aliases, [alias, aliasMap]) => {
      if (aliasMap.length === 1) {
        aliases = {
          ...aliases,
          ...resolveAlias(alias, aliasMap),
        }
        return aliases
      }
  
      throw new Error('Use one mapping for each alias (tsconfig.json>compilerOptions.paths). Array of length 1.')
    }, {})
  
    pluginConfig.alias = {
      ...convertedTsconfigPaths,
      ...restConfig.alias
    }
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
  setModuleResolverPluginForTsConfig,
  readAndParseTsConfig
}
