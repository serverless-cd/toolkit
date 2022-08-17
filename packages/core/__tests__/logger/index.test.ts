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

test('debug', (done) => {
  logger.enableDebug();
  const msg = 'debug message';
  logger.on('data', (message: string) => {
    expect(message).toBe(msg);
    done();
  });
  logger.debug(msg);
});
