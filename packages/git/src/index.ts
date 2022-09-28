import { IConfig, IProvider } from './interface';
import _ from 'lodash';
import Github from './github';
import Base from './base';

const providers = {
  github: Github,
}

export default function (provider: IProvider, config: IConfig) {
  const ProviderGit = _.get(providers, provider);

  const isExtendsBase = _.get(ProviderGit, 'prototype') instanceof Base;
  if (!isExtendsBase) {
    throw new Error(`Provider ${provider} does not support`);
  }

  return new ProviderGit(config);
}
