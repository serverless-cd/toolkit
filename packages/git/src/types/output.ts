export interface IRepoOutput {
  id: number;
  name: string;
  url: string;
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
