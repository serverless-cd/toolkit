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
