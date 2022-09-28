
import _ from 'lodash';

export default abstract class Base {
  constructor(_config: any) { }
  abstract listRepos(params?: any): Promise<any[]>;
  abstract listBranchs(params: any): Promise<any[]>;
  abstract getCommit(params: any): Promise<any>;
}