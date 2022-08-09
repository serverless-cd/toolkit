import { logger, setServerlessCdVariable, getServerlessCdVariable } from '../../src';
import * as path from 'path';
import * as fs from 'fs-extra';

test('enableDebug', () => {
  logger.enableDebug();
  expect(process.env.enable_logger_debug).toBe('true');
});

test('closeDebug', () => {
  logger.closeDebug();
  expect(process.env.enable_logger_debug).toBe('false');
});

test('isDebug', () => {
  process.env.enable_logger_debug = 'true';
  expect(logger.isDebug()).toBeTruthy();
});

describe('通过绝对路径写入日志文件', () => {
  const filePath = path.join(__dirname, 'log.txt');
  beforeAll(() => {
    logger.enableDebug();
  });
  test('debug', () => {
    logger.debug('debug message ', filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
  test('info', () => {
    logger.info('info message ', filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
  test('error', () => {
    logger.error('error message ', filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
  afterEach(() => {
    fs.unlinkSync(filePath);
  });
});

describe('通过环境变量LOG_PATH写入日志文件', () => {
  const filePath = 'log2.txt';
  beforeAll(() => {
    setServerlessCdVariable('LOG_PATH', process.cwd());
    logger.enableDebug();
  });
  test('debug', () => {
    logger.debug('debug message ', filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
  test('info', () => {
    logger.info('info message ', filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
  test('error', () => {
    logger.error('error message ', filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
  });
  afterEach(() => {
    const deletePath = path.join(getServerlessCdVariable('LOG_PATH'), filePath);
    fs.unlinkSync(deletePath);
  });
});
