
import _ from 'lodash';
import { IListBranchs, IGetConfig } from '../types/input';
import { IBranchOutput, IRepoOutput, ICommitOutput } from '../types/output';

export default abstract class Base {
  constructor(_config: any) { }
  abstract listRepos(): Promise<IRepoOutput[]>;
  abstract listBranchs(params: IListBranchs): Promise<IBranchOutput[]>;
  abstract getRefCommit(params: IGetConfig): Promise<ICommitOutput>;
}