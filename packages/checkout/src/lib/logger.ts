import { logger } from '@serverless-cd/core';

const C_TIME = {
  Y: 'YYYY',
  M: 'YYYY-MM',
  D: 'YYYY-MM-DD',
  H: 'YYYY-MM-DD HH',
  m: 'YYYY-MM-DD HH:mm',
  s: 'YYYY-MM-DD HH:mm:ss',
  q: 0, // 季度
  S: 0, // 毫秒
};
const timeFmt = (time = new Date(), fmt = C_TIME.D) => {
  const date = new Date(time);
  const value: any = {
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };

  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (let k in value) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? value[k] : ('00' + value[k]).substr(('' + value[k]).length),
      );
    }
  }
  return fmt;
};

class Logger extends logger {
  constructor(private logPath: string) {
    super();
  }

  info(message: string) {
    const time = timeFmt(new Date(), C_TIME.s);
    logger.info(`${time}【INFO】${message}`, this.logPath);
  }

  error(message: string) {
    const time = timeFmt(new Date(), C_TIME.s);
    logger.error(`${time}【ERROR】${message}`, this.logPath);
  }
}

export default Logger;
