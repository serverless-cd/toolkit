export interface IListBranch {
  project_id: number;
  organization_id: string;
  page?: number;
  page_size?: number;
  order?: string;
}

export interface IGetCommitById {
  project_id: number;
  organization_id: string;
  sha: string;
}

export interface IListRepo {
  organization_id: string;
}
