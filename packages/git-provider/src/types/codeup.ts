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

export interface ICreateRepo {
  name: string;
  organization_id: string;
  visibility_level?: string;
  description?: string;
}

export interface IDeleteRepo {
  project_id: string;
  organization_id: string;
}

export interface IHasRepo {
  project_id: string;
  organization_id: string;
}

export interface ISetProtectBranch {
  project_id: string;
  organization_id: string;
  branch: string;
}

export interface IGetProtectBranch {
  project_id: string;
  organization_id: string;
  branch: string,
}

export interface ICheckRepoEmpty {
  project_id: string;
  organization_id: string;
}

export interface IEnsureEmptyRepo {
  name: string;
  organization_id: string;
}