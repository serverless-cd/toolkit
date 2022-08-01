import fse from 'fs-extra';
import { get } from 'lodash';

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
      this.appendFile(stepId, message);
      console.log(message);
    }
  }

  static info(message: string, stepId: string) {
    this.appendFile(stepId, message);
    console.log(message);
  }

  static error(message: string, stepId: string) {
    this.appendFile(stepId, message);
    console.log(message);
  }

  private static appendFile(message: string, stepId: string) {
    const filePath = get(process.env, stepId, '');
    if (!filePath) {
      throw new Error(`Unable to find step id path ${stepId}`);
    }
    fse.appendFileSync(filePath, message);
  }
}
