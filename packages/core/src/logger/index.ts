import {
  Logger,
  FileTransport,
  ConsoleTransport,
  Transport,
  LoggerLevel,
  ConsoleTransportOptions,
  FileTransportOptions,
} from 'egg-logger';
import chalk from 'chalk';
import OssLogger, { IOssConfig } from './oss-logger';

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

interface IProps {
  file?: string;
  level?: LoggerLevel;
}
class EngineLogger extends Logger {
  constructor(props: IProps) {
    const { file, level = 'INFO' } = props;
    super({});
    this.set(
      'console',
      new _ConsoleTransport({
        level,
      }),
    );
    file &&
      this.set(
        'file',
        new _FileTransport({
          file,
          level,
        }),
      );
  }
  async oss(ossConfig: IOssConfig) {
    return await new OssLogger(ossConfig).init();
  }
}

export {
  EngineLogger,
  Logger,
  formatter,
  Transport,
  _ConsoleTransport as ConsoleTransport,
  _FileTransport as FileTransport,
  IOssConfig,
  LoggerLevel,
};
