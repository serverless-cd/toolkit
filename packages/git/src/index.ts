import { IProvider, IGitConfig } from './types/input';
import _ from 'lodash';
import Base from './providers/base';
import providers from './providers';


export = function (provider: IProvider, config: IGitConfig) {
  const ProviderGit = _.get(providers, provider);

  const isExtendsBase = _.get(ProviderGit, 'prototype') instanceof Base;
  if (!isExtendsBase) {
    throw new Error(`Provider ${provider} does not support`);
  }

  return new ProviderGit(config);
}
