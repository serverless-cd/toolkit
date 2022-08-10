import crypto from 'crypto';
import { IOption, IRequest, IHookData } from './interface';

function hasError(msg: any) {
  var err = new Error(msg);
  throw err;
}

class Github {
  options: IOption;
  constructor(options: IOption) {
    this.options = options;
  }

  async handler(req: IRequest): Promise<IHookData> {
    return {
      event: '',
      payload: '',
      protocol: '',
      host: '',
      url: '',
      path: '',
    };
  }
}

export default (options: IOption) => new Github(options);
