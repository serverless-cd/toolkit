import EventEmitter from 'events';
import { ListenConfig } from './types';
import { checkType, findHandler, handlerEvents, commonEvent } from './utile';
import getHookKeyword from './git/hookKeyword';
const { BufferListStream } = require('bl');

export { default as events } from './events';

export default class WebHook extends EventEmitter {
  initOptions: ListenConfig | ListenConfig[];

  constructor(initOptions: ListenConfig | ListenConfig[]) {
    if (Array.isArray(initOptions)) {
      for (const option of initOptions) {
        checkType(option);
      }
    } else {
      checkType(initOptions);
    }

    super();
    this.initOptions = initOptions;
  }

  handler (req: any, res: any, callback: Function) {
    const { url, method, headers, protocol } = req;
    console.log('req payload: ', { method, url, headers });

    const listenConfig: ListenConfig = findHandler(url, this.initOptions);
    console.log('获取监听配置: ', listenConfig);

    const { events: listenEvents, path, secret } = listenConfig;
    const events = handlerEvents(listenEvents || []);
    const reqPath = url.split('?').shift();

    if (reqPath !== path || method !== 'POST') {
      return callback();
    }

    const hookKeyword = getHookKeyword(headers, secret);
    console.log('get hookKeyword payload:: ', hookKeyword);
    const { signatureKey, eventKey, idKey, verify } = hookKeyword;
    
    const {
      [signatureKey]: signature,
      [eventKey]: event,
      [idKey]: id,
    } = headers;

    if (!signature) {
      return this.hasError(`No ${signatureKey} found on request`, req, res, callback);
    }

    if (!event) {
      return this.hasError(`No ${event} found on request`, req, res, callback);
    }

    if (!id) {
      return this.hasError(`No ${id} found on request`, req, res, callback);
    }

    if (events.length && events.includes(event)) {
      return this.hasError(`No ${event} found on request`, req, res, callback);
    }

    req.pipe(BufferListStream((err: Error, data: any) => {
      if (err) {
        return this.hasError(err.message, req, res, callback);
      }

      let obj;
      try {
        obj = JSON.parse(data.toString());
      } catch(e: any) {
        return this.hasError(e.toString(), req, res, callback);
      }

      if (!verify(signature, data, obj)) {
        return this.hasError(`${signatureKey} does not match blob signature`, req, res, callback);
      }

      const emitData = {
        path,
        event,
        id,
        protocol,
        url,
        payload: obj,
        host: headers.host,
      };
      console.log('emitData:: ', emitData);

      const emitEvent = commonEvent(event);
      console.log('emitEvent:: ', emitEvent);

      res.writeHead(200, { 'content-type': 'application/json' })
      res.end('{"ok":true}')

      this.emit(emitEvent, emitData)
      this.emit('*', emitData)
    }))
  }

  private hasError (msg: string, req: any, res: any, callback: Function) {
    res.writeHead(400, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: msg }))

    const err = new Error(msg)

    this.emit('error', err, req);
    callback(err)
  }
};

module.exports = WebHook;
// export default (options: ListenConfig | ListenConfig[]) => new WebHook(options);
