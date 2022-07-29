import fse from 'fs-extra';

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
      this.appendFile(filePath, message);
      console.log(message);
    }
  }

  static info(message: string, filePath: string) {
    this.appendFile(filePath, message);
    console.log(message);
  }

  static error(message: string, filePath: string) {
    this.appendFile(filePath, message);
    console.log(message);
  }

  private static appendFile(message: string, filePath: string) {
    fse.appendFileSync(filePath, message);
  }
}
