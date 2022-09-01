import chalk from 'chalk';
import {
  Logger,
  FileTransport,
  ConsoleTransport,
  Transport,
  LoggerLevel,
  TransportOptions,
} from 'egg-logger';

const duartionRegexp = /([0-9]+ms)/g;
const categoryRegexp = /(\[[\w\-_.:]+\])/g;
const httpMethodRegexp = /(GET|POST|PUT|PATH|HEAD|DELETE) /g;

interface OssLoggerOptions extends TransportOptions {
  ossKey?: string;
}

//  refer: https://github.com/eggjs/egg-logger-sls/tree/master/lib
//  https://github.com/eggjs/egg-logger
class OssLoggerTransport extends Transport {
  constructor(opts: OssLoggerOptions) {
    super(opts);
    this.ossKey = opts.ossKey;
  }
  log(level: LoggerLevel, args: any[], meta: object) {
    const msg = super.log(level, args, meta);
    // ossClient push文件
    console.log(msg);
  }
}

module.exports = (opts: { ossKey?: string; file?: string; prefix: string; console?: boolean }) => {
  const { ossKey, file, prefix, console = true } = opts;
  const logger = new Logger({});
  let formatter = function (meta?: any) {
    let msg = meta.message;
    if (prefix) {
      msg = prefix + ' ' + msg;
    }
    // @ts-ignore
    if (!chalk.supportsColor) {
      return msg;
    }

    if (meta.level === 'ERROR') {
      return chalk.red(msg);
    } else if (meta.level === 'WARN') {
      return chalk.yellow(msg);
    }

    msg = msg.replace(duartionRegexp, chalk.green('$1'));
    msg = msg.replace(categoryRegexp, chalk.blue('$1'));
    msg = msg.replace(httpMethodRegexp, chalk.cyan('$1 '));
    return msg;
  };

  if (console) {
    logger.set(
      'console',
      new ConsoleTransport({
        level: 'DEBUG',
        formatter,
      }),
    );
  }
  
  if (file) {
    logger.set(
      'file',
      new FileTransport({
        file,
        level: 'INFO',
        formatter,
      }),
    );
  }

  // 远程目录
  if (ossKey) {
    logger.set(
      'remote',
      new OssLoggerTransport({
        level: 'DEBUG',
        ossKey,
        formatter,
      }),
    );
  }
  return logger;
};

/**
 * 使用方式：
 * const baseLogger = new BaseLogger({console: true});
 * logger.info('info');
 */
