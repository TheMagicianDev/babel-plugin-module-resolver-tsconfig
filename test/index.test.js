/* eslint-disable no-undef */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { setModuleResolverPluginForTsConfig } = require('../lib');

describe('General test', () => {
  function runTest(pluginObj, expectedConfig) {
    expect(pluginObj.length).toBe(2);
    expect(typeof pluginObj[0]).toBe('string');
    expect(pluginObj[1]).toEqual(expectedConfig);
  }

  test('Wrong tsconfig file', () => {
    try {
      setModuleResolverPluginForTsConfig({
        tsconfigPath: './wrongPath'
      });
      fail('Wrong path an error is expected!');
    } catch (err) {
      expect(err.message).toContain("does't exist!");
    }
  });

  test('test no tsconfig [automatic root detection]', () => {
    /**
     * The way it is expected is that if not precised in the cli.
     * It would take the caller module directory and take tsconfig.json if there it works.
     * If not it will fail with an error.
     */

    /**
     * testing when no cli config file arg provided
     */
    const pluginObj = setModuleResolverPluginForTsConfig();

    runTest(pluginObj, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });

    /**
     * testing when cli arg provided
     */

    // case: relative path
    const oldArgv = process.argv;
    process.argv = [
      ...(process.argv || []),
      '--config-file',
      './tsconfig.json'
    ];
    const pluginObj2 = setModuleResolverPluginForTsConfig();
    runTest(pluginObj2, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
    process.argv = oldArgv;

    // case: absolute path
    process.argv = [
      ...(process.argv || []),
      '--config-file',
      path.resolve(__dirname, './tsconfig.json')
    ];
    const pluginObj3 = setModuleResolverPluginForTsConfig();
    runTest(pluginObj3, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
    process.argv = oldArgv;
  });

  test('test tsconfig and alias', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@hooks/(.*)': './src/hooks/\\1'
      }
    });

    runTest(pluginObj, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1',
        '^@hooks/(.*)': './src/hooks/\\1'
      }
    });
  });

  test('test tsconfig and alias', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@hooks/(.*)': './src/hooks/\\1'
      }
    });

    runTest(pluginObj, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1',
        '^@hooks/(.*)': './src/hooks/\\1'
      }
    });
  });

  test('test tsconfig and same root as tsconfig', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      root: '.'
    });

    runTest(pluginObj, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
  });

  test('test tsconfig and different root as tsconfig', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      root: './someDifferent'
    });

    runTest(pluginObj, {
      root: ['./someDifferent', '.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
  });

  test('test tsconfig and and root function', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      root: (/* tsBaseUrl */) => './someDifferent'
    });

    runTest(pluginObj, {
      root: ['./someDifferent'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });

    const pluginObj2 = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      root: (/* tsBaseUrl */) => ['./someDifferent']
    });

    runTest(pluginObj2, {
      root: ['./someDifferent'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
  });

  test('test tsconfig and and root array', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json',
      root: ['./someDifferent', './another']
    });

    runTest(pluginObj, {
      root: ['./someDifferent', './another', '.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
  });

  test('test tsconfig only', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.json'
    });

    runTest(pluginObj, {
      root: ['.'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
  });

  test('test tsconfig base url with slash at the end', () => {
    const pluginObj = setModuleResolverPluginForTsConfig({
      tsconfigPath: './tsconfig.baseUrlWithSlash.json'
    });

    runTest(pluginObj, {
      root: ['./'],
      alias: {
        '@fonts': './src/fonts/index.ts',
        '^@utils/(.*)': './src/utils/\\1'
      }
    });
  });

  test('Path alias as an array of multiple values [throw error]', () => {
    try {
      setModuleResolverPluginForTsConfig({
        tsconfigPath: 'tsconfig.invalidAlias.json'
      });
      fail(
        'Expected to fail as there will be multiple values! babel resolver support only one!'
      );
    } catch (err) {
      expect(err.message).toContain(
        'Use one mapping for each alias (tsconfig.json>compilerOptions.paths). Array of length 1.'
      );
    }
  });
});

describe('Test fixtures', () => {
  test('that utils alias worked well', () => {
    const fixturesDir = path.join(__dirname, '__fixtures__');

    [
      'noTsconfig',
      'tsconfigAndAlias',
      'tsconfigAndRoot',
      'tsconfigOnly'
    ].forEach((fixtureDirName) => {
      const fixtureDir = path.join(fixturesDir, fixtureDirName);
      const distDir = path.join(fixtureDir, 'dist');

      execSync(
        `cd ${fixtureDir} && npx rimraf ${distDir} && npx babel src --out-dir dist --extensions ".ts"`
      );

      const indexFilePath = path.join(distDir, 'index.js');
      expect(fs.existsSync(indexFilePath)).toBeTruthy();

      const indexFileContent = fs.readFileSync(indexFilePath, {
        encoding: 'utf8'
      });
      /**
       * NOTE: the webpack configuration and version need to not change.
       * NOTE: Otherwise you may need to change the bellow condition [code style ...]
       */
      expect(indexFileContent).toContain('require("./utils/logger")');
    });
  });
  test('that hooks custom added alias worked well', () => {
    const fixturesDir = path.join(__dirname, '__fixtures__');

    ['tsconfigAndAlias'].forEach((fixtureDirName) => {
      const fixtureDir = path.join(fixturesDir, fixtureDirName);
      const distDir = path.join(fixtureDir, 'dist');

      execSync(
        `cd ${fixtureDir} && npx rimraf ${distDir} && npx babel src --out-dir dist --extensions ".ts"`
      );

      const indexFilePath = path.join(distDir, 'index.js');
      expect(fs.existsSync(indexFilePath)).toBeTruthy();

      const indexFileContent = fs.readFileSync(indexFilePath, {
        encoding: 'utf8'
      });
      /**
       * NOTE: the webpack configuration and version need to not change.
       * NOTE: Otherwise you may need to change the bellow condition [code style ...]
       */
      expect(indexFileContent).toContain(
        'require("./hooks/someSpecialBanana")'
      );
    });
  });
});
