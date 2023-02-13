export interface IRepoOutput {
  id: number;
  name: string;
  url: string;
  avatar_url: string;
  owner: string;
  private: boolean;
  description: string;
  default_branch: string;
  source: any;
}

export interface IOrgsOutput {
  org: string;
  id: number;
  source: any;
}

export interface IForkOutput {
  id: number;
  full_name: string;
  url: string;
}

export interface ICreateRepoOutput {
  id: number;
  full_name: string;
  url: string;
}

export interface IHasRepoOutput {
  isExist: boolean;
  id?: number;
  full_name?: string;
  url?: string;
}

export interface IBranchOutput {
  name: string;
  commit_sha: string;
  source: any;
}

export interface ICommitOutput {
  sha: string;
  message: string;
  source: any;
}

export interface ICreateWebhookOutput {
  id: number;
  source: any;
}

export interface IGetWebhookOutput {
  id: number;
  url: string;
  source: any;
}

export interface IGetProtectBranchOutput {
  protected: boolean;
}

export interface ICheckRepoEmptyOutput {
  isEmpty: boolean;
}

export interface IEnsureRepoOutput {
  isNewCreated: boolean;
  url: string;
}

export interface IGetRepoIdOutput {
  id: number;
}