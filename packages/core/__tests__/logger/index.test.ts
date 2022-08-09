import { logger } from '../../src';
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

describe('logger write data', () => {
  const filePath = path.join(__dirname, 'log.txt');
  beforeAll(() => {
    logger.enableDebug();
  });
  beforeEach(() => {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
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
  afterAll(() => {
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
  });
});
