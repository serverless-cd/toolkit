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
export interface IPrInfo {
  target: string;
  source: string;
  type: IPrTypesVal;
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

export enum IGiteeAction {
  open = IPrTypes.OPENED,
  close = IPrTypes.CLOSED,
  reopen = IPrTypes.REOPENED,
  merge = IPrTypes.MERGED,
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

export interface IGiteeTrigger extends ITrigger {
  password?: string;
}

export type ITriggers =
  | {
      github: ITrigger;
    }
  | {
      gitee: IGiteeTrigger;
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
export interface IVerify {
  success: boolean;
  data: {
    url: string;
    provider: IProvider;
    repo_id: number;
    pusher: {
      name: string;
      email: string;
      avatar_url: string;
    };
    push?: {
      ref: string;
      branch?: string;
      tag?: string;
    };
    pull_request?: {
      target_branch: string;
      source_branch: string;
      type: IPrTypesVal;
    };
    commit: {
      id: string;
      message: string;
    };
  };
}
