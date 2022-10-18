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
import { each, includes } from 'lodash';

const duartionRegexp = /([0-9]+ms)/g;
const categoryRegexp = /(\[[\w\-_.:]+\])/g;
const httpMethodRegexp = /(GET|POST|PUT|PATH|HEAD|DELETE) /g;

interface IMeta {
  level: LoggerLevel;
  date: string;
  pid: number;
  hostname: string;
  message: string;
  secrets?: string[];
}

interface MyConsoleTransportOptions extends ConsoleTransportOptions {
  secrets?: string[];
}

interface MyFileTransportOptions extends FileTransportOptions {
  secrets?: string[];
}

function mark(val: string) {
  return val.length > 8
    ? val.slice(0, 3) + '*'.repeat(val.length - 6) + val.slice(val.length - 3, val.length)
    : '***';
}

const formatter = (meta?: object) => {
  const metaObj = meta as IMeta;
  const { secrets = [] } = metaObj;
  let msg = metaObj.message;
  secrets &&
    each(secrets, (str) => {
      do {
        msg = msg.replace(str, mark(str));
      } while (includes(msg, str));
    });

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
  constructor(options: MyConsoleTransportOptions) {
    super({
      formatter: (data: object | undefined) => formatter({ ...data, secrets: options.secrets }),
      ...options,
    });
  }
}

class _FileTransport extends FileTransport {
  constructor(options: MyFileTransportOptions) {
    super({
      formatter: (data: object | undefined) => formatter({ ...data, secrets: options.secrets }),
      ...options,
    });
  }
}

interface IProps {
  file?: string;
  level?: LoggerLevel;
  secrets?: string[];
}
class EngineLogger extends Logger {
  constructor(props: IProps) {
    const { file, level = 'INFO', secrets } = props;
    super({});
    this.set(
      'console',
      new _ConsoleTransport({
        secrets,
        level,
      }),
    );
    file &&
      this.set(
        'file',
        new _FileTransport({
          secrets,
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
  mark,
};
