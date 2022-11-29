export interface IBranches {
  prefix?: string[];
  precise?: string[];
  exclude?: string[];
  include?: string[];
}

export interface IPrefix {
  target: string;
  source?: string;
}
export interface IPrefixFromWebhook {
  target: string;
  source: string;
}

export interface IPrBranches {
  prefix?: IPrefix[];
  precise?: IPrefix[];
  exclude?: IPrefix[];
  include?: IPrefix[];
}

export enum IPrTypes {
  OPENED = 'opened',
  CLOSED = 'closed',
  REOPENED = 'reopened',
  MERGED = 'merged',
}

export type IPrTypesVal = `${IPrTypes}`;
export interface ITrigger {
  secret?: string;
  push?: {
    branches?: IBranches;
    tags?: IBranches;
  };
  pull_request?: {
    types: IPrTypesVal[];
    branches?: IPrBranches;
  };
}

export type ITriggers =
  | {
      github: ITrigger;
    }
  | {
      gitee: ITrigger;
    }
  | {
      codeup: ITrigger;
    }
  | {
      gitlab: ITrigger;
    };

export type IPayload = {
  headers: {
    [key: string]: string;
  };
  body: any;
};

export enum IUserAgent {
  GITHUB = 'github',
  GITEE = 'gitee',
  CODEUP = 'codeup',
  GITLAB = 'gitlab',
}

export type IProvider = `${IUserAgent}`;

export type IGithubEvent = 'push' | 'pull_request';
export type IGiteeEvent = 'Push Hook' | 'Tag Push Hook' | 'Merge Request Hook';
export type ICodeupEvent = IGiteeEvent;
export type IGitlabEvent = 'Job Hook' | 'Merge Request Hook';

export interface IPushInfo {
  branch?: string;
  tag?: string;
}
