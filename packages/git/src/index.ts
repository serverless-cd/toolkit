import { IProvider, IGitConfig } from './types/input';
import _ from 'lodash';
import Github from './github';
import Gitee from './gitee';
import Base from './base';

const providers = {
  github: Github,
  gitee: Gitee,
}

export default function (provider: IProvider, config: IGitConfig) {
  const ProviderGit = _.get(providers, provider);

  const isExtendsBase = _.get(ProviderGit, 'prototype') instanceof Base;
  if (!isExtendsBase) {
    throw new Error(`Provider ${provider} does not support`);
  }

  return new ProviderGit(config);
}
