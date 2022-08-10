import { IOption, IRequest, IHookData } from './interface';

// gitlab 的 secret 是明文的。。。。
function hasError(msg: any) {
  var err = new Error(msg);
  throw err;
}

function verify(token: string, sign: string) {
  if (!token) {
    return hasError('No X-Gitlab-Token found on request');
  }
  return token === sign;
}

class Gitlab {
  options: IOption;
  constructor(options: IOption) {
    this.options = options;
  }

  async handler(req: IRequest): Promise<IHookData> {
    if (typeof this.options !== 'object') {
      throw new TypeError('must provide an options object');
    }

    if (typeof this.options.path !== 'string') {
      throw new TypeError("must provide a 'path' option");
    }

    if (this.options.secret && typeof this.options.secret !== 'string') {
      throw new TypeError("must provide a 'secret' option");
    }

    if (this.options.password && typeof this.options.password !== 'string') {
      throw new TypeError("must provide a 'password' option");
    }
    if (req.path !== this.options.path || req.method !== 'POST') {
      throw new Error(`${req.method} ${req.path} api is not supoort`);
    }

    let events;

    if (typeof this.options.events === 'string' && this.options.events !== '*') {
      events = [this.options.events];
    } else if (Array.isArray(this.options.events) && this.options.events.indexOf('*') === -1) {
      events = this.options.events;
    }

    var event = req.headers['x-gitlab-event'];

    if (!event) {
      hasError('No X-Gitlab-Event found on request');
    }

    if (events && events.indexOf(event) === -1) {
      hasError('X-Gitlab-Event is not acceptable');
    }
    const { body } = req;

    let payload;

    try {
      payload = JSON.parse(body.toString());
    } catch (e) {
      hasError(e);
    }

    if (this.options.secret) {
      if (!verify(req.headers['x-gitlab-token'], this.options.secret)) {
        hasError('secret does not match');
      }
    }

    const data = {
      event,
      payload,
      protocol: req.protocol,
      host: req.headers['host'],
      url: req.url,
      path: req.path,
    };
    return data;
  }
}

export default (options: IOption) => new Gitlab(options);
