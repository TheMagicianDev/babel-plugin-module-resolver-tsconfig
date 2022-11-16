# babel-plugin-module-resolver-tsconfig

![babel plugin module resolver tsconfig automatic alias banner](./imgs/banner_black.svg)

<div align="center">
  <a href="https://www.npmjs.org/package/babel-plugin-module-resolver-tsconfig" alt="npm version">
    <img src="https://img.shields.io/npm/v/babel-plugin-module-resolver-tsconfig.svg?style=flat-square"/>
  </a>
  <a href="https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig/actions?query=workflow%3ACI+branch%3Amain">
    <img src="https://img.shields.io/github/workflow/status/TheMagicianDev/babel-plugin-module-resolver-tsconfig/CI/main" alt="Build Status">
  </a>
  <a href='https://coveralls.io/github/TheMagicianDev/babel-plugin-module-resolver-tsconfig?branch=main'>
    <img src='https://coveralls.io/repos/github/TheMagicianDev/babel-plugin-module-resolver-tsconfig/badge.svg?branch=main' alt='Coverage Status' />
  </a>
  <a href='LICENSE'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg?style=flat' alt='Coverage Status' />
  </a>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/swc-command">npm page</a>, 
  <a href="https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig">repo page</a>
</div>

<hr>

You should **"Write the aliases in tsconfig only\"**.

A helper module that provides easy configuration of [babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver) plugin for typescript projects. **To avoid repeating writing the aliases in both tsconfig and .babelrc.js.** (What a blessing)

And that by reading automatically the config from the `tsconfig.json` and setting the `babel` module resolver plugin` with that. After converting and mapping them to the babel resolver format.

Support extending the config as well.

See how simple it becomes.

## First basic example

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

it's that simple. Instead of manually adding and repeating all of the aliases. No more of `it shouldn't be like this` and `frustration`.

`tsconfig.json` locked up automatically in the same directory as `babel.config.json`.

### Signature

```ts
export declare interface IPluginConfig {
  [configProp: string]: any;
  root?: string | string[] | ((tsConfigBaseUrl: string) => string | string[]);
  alias?: Record<string, string>;
  tsconfigPath?: string;
}

declare function setModuleResolverPluginForTsConfig(
  config?: IPluginConfig
): [PluginTarget, IPluginConfig];

declare function readAndParseTsConfig(tsconfigPath: string): ParsedTsconfig;
```

If you like to know the details. Go to the end of the document.

Here bellow more examples first. For a quick start.

## Examples

Most of the time you should go with the no config option already shared above.

### tsconfig.json path

Relative path to the calling `babel.config.json`

Check the API details for how the relative resolution happens.

```js
setModuleResolverPluginForTsConfig({
  tsconfigPath: './tsconfig.json'
})
```

Absolute path

```js
setModuleResolverPluginForTsConfig({
  tsconfigPath: path.resolve(__dirname, './tsconfig.json')
})
```

### root

The root value is very important. By default, it is deduced from `tsConfig.compilerOptions.baseUrl`.

One value

```js
setModuleResolverPluginForTsConfig({
  tsconfigPath: './tsconfig.json',
  root: '.'
});
```

Multiple values

```js
setModuleResolverPluginForTsConfig({
  root: ['.', './another']
});
```

Dynamic function

```js
setModuleResolverPluginForTsConfig({
  root: (tsconfigBaseUrl) => {
    if (someCheck(tsconfigBaseUrl)) {
      return '.' // return a string
    }
    return ['.', './another'] // or array
  }
});
```

> When you provide a root value. It would not override the typescript one. But rather be merged and take precedence (come first) `root: './some' => babel result => root: ['./some', './tsConfgBaseUrlValue']`. 

### Extra aliases 

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
    root: [tsconfig.compilerOptions.baseUrl],
    alias: {
      ...<resolved converted mapped typescript paths>,
      '@extra/*': 'src/extra/\\1',
      // ...
    },
  }
]
```

## Api details

### tsconfigPath option 

You can provide the tsconfigPath manually. Relative or absolute.

The Relative works relatively to the calling module file. Here it should be `babel.config.js`.

If you are building a module (or package) and wrapping this package to extend it. Then you should use absolute path instead. As the calling module in such a case become your new module. `module.parent.filename` was used internally to give you an idea.

If not provided. `tsconfig.json` would be looked up automatically. By trying to get the babel config file path from CLI if provided. Otherwise the calling module (babel config file).

If no config file is provided in the babel CLI command. The module calling the method directory would be taken.


### root

The root is a `string`, `array`, or `((tsConfigBaseUrl: string) => string | string[])`

Whatever the option. It will resolve to a string array. That what `babel-resolver` expect.

If the root option is not provided. The module automatically gets it from `tsconfig.compilerOptions.baseUrl`.

If provided. It will still get the `tsconfig baseUrl`. However, it will take precedence. The final resolution will go as follow: `[...<userRoot>, <tsconfigBaseUrl>]`.


### Alias

It will resolve to

```js
{
  ...tsconfigConvertedPaths,
  ...userAlias
}
```

