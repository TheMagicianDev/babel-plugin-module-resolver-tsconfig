# babel-plugin-module-resolver-tsconfig

You should **"Write the aliases in tsconfig only\"**.

A helper module that provide easy configuration of `babel-plugin-module-resolver` plugin for typescript projects. **To avoid repeating writing the aliases in both tsconfig and .babelrc.js.**

And that by reading automatically the config from the tsconfig.json and set the babel module resolver plugin with that.

Support extending the config as well.

# Examples

```ts
const { setModuleResolverPluginForTsConfig } = require('babel-plugin-module-resolver-tsconfig')

module.export = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    setModuleResolverPluginForTsConfig()
  ]
}
```

With adding extra aliases:

(Aliases are merged and added. Not replaced!)

```ts
const { setModuleResolverPluginForTsConfig } = require('babel-plugin-module-resolver-tsconfig')

module.export = {
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    setModuleResolverPluginForTsConfig({
      alias: {
        '@extra/*': 'src/extra/*',
        // ...
      }
    })
  ]
}
```

The above will resolve to:

```js
[
  require.resolve('babel-plugin-module-resolver'),
  {
    root: tsconfig.compilerOptions.baseUrl,
    alias: {
      ...tsconfig.compilerOptions.paths,
      '@extra/*': 'src/extra/*',
      // ...
    },
  }
]
```
