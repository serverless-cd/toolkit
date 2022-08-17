import EventEmitter from 'events';

class Logger extends EventEmitter {
  constructor() {
    super();
  }
  enableDebug() {
    process.env.enable_logger_debug = 'true';
  }

  closeDebug() {
    process.env.enable_logger_debug = 'false';
  }

  isDebug() {
    return process.env.enable_logger_debug === 'true';
  }

  debug(message: string, ...rest: any[]) {
    if (this.isDebug()) {
      this.emit('data', message, ...rest);
      console.log(message);
    }
  }

  info(message: string, ...rest: any[]) {
    this.emit('data', message, ...rest);
    console.log(message);
  }

  error(message: string, ...rest: any[]) {
    this.emit('data', message, ...rest);
    console.log(message);
  }
}

const logger = new Logger();

export default logger;
