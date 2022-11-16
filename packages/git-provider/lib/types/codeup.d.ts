export interface IListBranch {
    project_id: number;
    organization_id: string;
    page?: number;
    page_size?: number;
    order?: string;
}
