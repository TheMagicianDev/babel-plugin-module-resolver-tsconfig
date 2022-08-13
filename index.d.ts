import type { PluginTarget } from '@babel/core';

declare interface IPluginConfig {
  [configProp?: string]: any;
  root?: string;
  alias?: Record<string, string>;
  tsconfigPath?: string;
}

declare function setModuleResolverPluginForTsConfig(
  config?: IPluginConfig
): [PluginTarget, IPluginConfig];
