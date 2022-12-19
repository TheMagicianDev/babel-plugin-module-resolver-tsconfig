# babel-plugin-module-resolver-tsconfig

![babel plugin module resolver tsconfig automatic alias banner](./imgs/banner_black.png)

<div align="center">
  <a href="https://www.npmjs.org/package/babel-plugin-module-resolver-tsconfig">
    <img src="https://img.shields.io/npm/v/babel-plugin-module-resolver-tsconfig.svg?style=flat-square" alt="npm version"/>
  </a>
  <a href="https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig/actions?query=workflow%3ACI+branch%3Amaster">
    <img src="https://img.shields.io/github/actions/workflow/status/TheMagicianDev/babel-plugin-module-resolver-tsconfig/ci.yml?branch=master" alt="Build Status">
  </a>
  <a href='https://coveralls.io/github/TheMagicianDev/babel-plugin-module-resolver-tsconfig?branch=master'>
    <img src='https://coveralls.io/repos/github/TheMagicianDev/babel-plugin-module-resolver-tsconfig/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  <a href='LICENSE'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg?style=flat' alt='Coverage Status' />
  </a>
</div>

<div align="center">
  <a href="https://www.npmjs.com/package/babel-plugin-module-resolver-tsconfig">npm page</a>, 
  <a href="https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig">repo page</a>,
  <a href="https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig" style="color: yellow; text-decoration: inherit;">Star me ⭐💫</a>

  
</div>

<hr>

You should **"Write the aliases in tsconfig only. It should be that simple."**.

A helper module that provides easy configuration of [babel-plugin-module-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver) plugin for typescript projects. **To avoid repeating writing the aliases in both tsconfig and .babelrc.js.** (What a blessing)

And that by reading automatically the config from the `tsconfig.json` and setting the `babel` module resolver plugin` with that. After converting and mapping them to the babel resolver format.

Support extending the config as well.

Say goodbye to repetition and also the frustration of it's not working. Why => forget to add it to the other config. **No more of that**.

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

`tsconfig.json` looked up automatically in the same directory as `babel.config.json`.

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

> Note: check the toubleshooting section. Tips that can avoid you trouble.

Main rule: in **tsconfig paths** use `./` for relative paths. (`"./src/*"` instead of `"src/*"`). Go to the Tips section at the end to see more details.

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

## Trouble shooting and tips

Hugely very important. If it's not working. Check your tsconfig paths first.

First tip. Use relative paths with `./`.

**this work** ✅:

```ts
"paths": {
  "*": ["./src/*"]
}
```

this doesn't ❌:

```ts
"paths": {
  "*": ["src/*"]
}
```

Ok why doesn't the module handle that for us !! ??? => Well actually because you may refer to a no path name. Like a package. So you have to be precise. And the small rule above is simple and natural.

## REPO SUPPORT ⭐🌟✨💫 🌠

<hr/>
<div align="center">
  <a href="https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig">repo page</a>
</div>
<hr/>

Any issue. Go to repo.

**WAIT** ... ⭐🌟✨💫 🌠 **YOU HAVEN'T STARED THE REPO YET** ⭐🌟✨💫 🌠
**[TIME TO DO](https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig)** => At least [open the repo](https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig). And when you test the module and be ❤️ 💖 **What a blessing** 💖 ❤️ => That's the **[calling to star](https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig)** moment. And remember to always smile.

Like it => [Star](https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig) => Let know - community picked it. => trust (barrier to use)

Feel free. (Repo => [calling](https://github.com/TheMagicianDev/babel-plugin-module-resolver-tsconfig))

Issues, Questions, Contribution, Feedback. => Repo.

## The Magician project

This plugin was created as a need first and also part of the teaching series at the magician project. The Magician Dev. (The Magician project is about magic for life [in everything], The Magician Dev is about development)

This repo for instance does show
> how to setup a package building project, eslint with prettier, commintlint with lefthook, Setting up CI (github actions), tests, and coverage and documentation badges.

And beginner topics:
> json5, regex, paths, fs, root directory for npm dev tools, calling parent, js + dts ....


More details about those topics in:

[Related content will be shared soon]

Check:

[Coming soon]

Follow us at:

[Coming soon]

Support The Magician Project:

[Coming later]
