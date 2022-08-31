import chalk from 'chalk';
import {
  Logger,
  FileTransport,
  ConsoleTransport,
  Transport,
  LoggerLevel,
  LoggerOptions,
} from 'egg-logger';

const duartionRegexp = /([0-9]+ms)/g;
const categoryRegexp = /(\[[\w\-_.:]+\])/g;
const httpMethodRegexp = /(GET|POST|PUT|PATH|HEAD|DELETE) /g;

class LoggerTransport extends Transport {
  constructor(opts: LoggerOptions) {
    super(opts);
  }
  log(level: LoggerLevel, args: any[], meta: object) {
    const msg = super.log(level, args, meta);
    console.log(msg);
  }
}

module.exports = (opts: { file: string; prefix: string; console: boolean }) => {
  const { file, prefix, console = true } = opts;
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
  // if (redisKey) {
  //   logger.set('remote', new RedisTransport({
  //     level: 'DEBUG',
  //     redisKey,
  //     formatter
  //   }));
  // }
  return logger;
};
