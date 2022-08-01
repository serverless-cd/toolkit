import fse from 'fs-extra';
import path from 'path';

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

  static debug(message: string, stepId: string) {
    if (this.isDebug()) {
      this.appendFile(message, stepId);
      console.log(message);
    }
  }

  static info(message: string, stepId: string) {
    this.appendFile(message, stepId);
    console.log(message);
  }

  static error(message: string, stepId: string) {
    this.appendFile(message, stepId);
    console.log(message);
  }

  private static appendFile(message: string, stepId: string) {
    const filePath = path.isAbsolute(stepId) ? stepId : path.join(process.cwd(), stepId);
    fse.ensureFileSync(filePath);
    fse.appendFileSync(filePath, `${message}\n`);
  }
}
