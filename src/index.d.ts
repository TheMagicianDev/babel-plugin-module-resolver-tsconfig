import type { PluginTarget } from '@babel/core';
import type { ParsedTsconfig } from 'typescript';
export declare interface IPluginConfig {
  [configProp: string]: any;
  root?: string;
  alias?: Record<string, string>;
  tsconfigPath?: string;
}

declare function setModuleResolverPluginForTsConfig(
  config?: IPluginConfig
): [PluginTarget, IPluginConfig];

declare function readAndParseTsConfig(tsconfigPath: string): ParsedTsconfig;
