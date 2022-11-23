export interface IBranches {
  prefix?: string[];
  precise?: string[];
  exclude?: string[];
  include?: string[];
}
export interface ITrigger {
  secret?: string;
  push?: {
    branches?: IBranches;
    tags?: IBranches;
  };
  pr?: {
    branches?: IBranches;
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
