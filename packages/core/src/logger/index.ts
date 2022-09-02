import {
  Logger,
  FileTransport,
  ConsoleTransport,
  Transport,
  LoggerLevel,
  TransportOptions,
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'egg-logger';
import chalk from 'chalk';
import * as fs from 'fs';

const duartionRegexp = /([0-9]+ms)/g;
const categoryRegexp = /(\[[\w\-_.:]+\])/g;
const httpMethodRegexp = /(GET|POST|PUT|PATH|HEAD|DELETE) /g;

interface IMeta {
  level: LoggerLevel;
  date: string;
  pid: number;
  hostname: string;
  message: string;
}
const formatter = (meta?: object) => {
  const metaObj = meta as IMeta;
  let msg = metaObj.message;
  if (metaObj.level === 'ERROR') {
    return chalk.red(msg);
  } else if (metaObj.level === 'WARN') {
    return chalk.yellow(msg);
  }
  msg = msg.replace(duartionRegexp, chalk.green('$1'));
  msg = msg.replace(categoryRegexp, chalk.blue('$1'));
  msg = msg.replace(httpMethodRegexp, chalk.cyan('$1 '));
  return msg;
};

class _ConsoleTransport extends ConsoleTransport {
  constructor(options: ConsoleTransportOptions) {
    super({
      formatter,
      ...options,
    });
  }
}

class _FileTransport extends FileTransport {
  constructor(options: FileTransportOptions) {
    super({
      formatter,
      ...options,
    });
  }
}

interface OssTransportOptions extends TransportOptions {
  //   region: '<oss region>',
  //   accessKeyId: '<Your accessKeyId>',
  //   accessKeySecret: '<Your accessKeySecret>',
  //   bucket: '<Your bucket name>',
}
class OssTransport extends Transport {
  constructor(options: OssTransportOptions) {
    super({
      formatter,
      ...options,
    });
  }
  log(level: LoggerLevel, args: any[], meta: object) {
    const msg = super.log(level, args, meta);
    console.log('msg===', msg);
    // TODO: upload to oss
    // const OSS = require('ali-oss');
    // const client = new OSS({
    //   region: '<oss region>',
    //   accessKeyId: '<Your accessKeyId>',
    //   accessKeySecret: '<Your accessKeySecret>',
    //   bucket: '<Your bucket name>',
    // });
  }
}

class EngineLogger extends Logger {
  constructor(file: string) {
    super({});
    this.set(
      'file',
      new _FileTransport({
        file,
        level: 'INFO',
      }),
    );

    this.set(
      'console',
      new _ConsoleTransport({
        level: 'DEBUG',
      }),
    );
  }
}

export {
  EngineLogger,
  Logger,
  formatter,
  Transport,
  OssTransport,
  _ConsoleTransport as ConsoleTransport,
  _FileTransport as FileTransport,
};
