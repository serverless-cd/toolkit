import fse from 'fs-extra';
import path from 'path';
import { getServerlessCdVariable } from './variable';

export default class logger {
  static enableDebug() {
    process.env.enable_logger_debug = 'true';
  }

  static closeDebug() {
    process.env.enable_logger_debug = 'false';
  }

  static isDebug() {
    return process.env.enable_logger_debug === 'true';
  }

  static debug(message: string, filePath: string) {
    if (this.isDebug()) {
      this.appendFile(message, filePath);
      console.log(message);
    }
  }

  static info(message: string, filePath: string) {
    this.appendFile(message, filePath);
    console.log(message);
  }

  static error(message: string, filePath: string) {
    this.appendFile(message, filePath);
    console.log(message);
  }

  private static appendFile(message: string, filePath: string) {
    const _filePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(getServerlessCdVariable('LOG_PATH'), filePath);
    fse.ensureFileSync(_filePath);
    fse.appendFileSync(_filePath, `${message}\n`);
  }
}
