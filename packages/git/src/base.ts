import { Octokit } from '@octokit/core';
import _ from 'lodash';
import { IConfig } from './interface';

export default abstract class Base {
  readonly octokit: Octokit;

  constructor(config: IConfig) {
    const access_token = _.get(config, 'access_token');
    if (_.isEmpty(access_token)) {
      throw new Error('Access token is required');
    }

    this.octokit = new Octokit({ auth: access_token });
  }

  abstract listRepos(): Promise<any>;
}