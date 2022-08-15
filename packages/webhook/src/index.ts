import EventEmitter from 'events';
import { ListenConfig } from './types';
import { checkType, findHandler, handlerEvents, commonEvent } from './utile';
import getHookKeyword from './git/hookKeyword';
import events from './events';

class WebHook extends EventEmitter {
  initOptions: ListenConfig | ListenConfig[];

  static events = events;

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

  handler (req: any, callback: Function = () => {}) {
    const { url, method, headers, protocol, body } = req;
    console.log('req payload: ', { method, url, headers });

    const listenConfig: ListenConfig = findHandler(url, this.initOptions);
    console.log('获取监听配置: ', listenConfig);

    const { events: listenEvents, path, secret } = listenConfig;
    const events = handlerEvents(listenEvents || []);
    console.log('监听的事件: ', events);
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
      return this.hasError(`No ${signatureKey} found on request`, callback);
    }

    if (!event) {
      return this.hasError(`No ${event} found on request`, callback);
    }

    if (!id) {
      return this.hasError(`No ${id} found on request`, callback);
    }

    if (events.length && events.includes(event)) {
      return this.hasError(`No ${event} found on request`, callback);
    }

    let obj;
    try {
      obj = JSON.parse(body.toString());
    } catch(e: any) {
      return this.hasError(e.toString(), callback);
    }

    if (!verify(signature, body, obj)) {
      return this.hasError(`${signatureKey} does not match blob signature`, callback);
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

    this.emit(emitEvent, emitData);
    if (!events.length) {
      this.emit('*', emitData);
    }

    callback(null, emitData);
  }

  private hasError (msg: string, callback: Function) {
    const err = new Error(msg);
    this.emit('error', err);
    callback(err);
  }
};

export = WebHook;
