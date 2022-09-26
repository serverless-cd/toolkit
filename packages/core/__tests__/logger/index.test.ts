import { Logger, FileTransport, ConsoleTransport, EngineLogger } from '../../src/logger/index';
import * as path from 'path';
import OssClient from 'ali-oss';

test('Logger', () => {
  const logger = new Logger({});
  logger.set(
    'file',
    new FileTransport({
      file: 'test.log',
      level: 'INFO',
    }),
  );
  logger.set(
    'console',
    new ConsoleTransport({
      level: 'DEBUG',
    }),
  );
  logger.debug('debug foo'); // only output to stdout
  logger.info('GET /foo/bar 200ms');
  logger.info('[abc]123');
  logger.warn('warn foo');
  logger.error(new Error('error foo'));
});

test.skip('EngineLogger', async () => {
  const logger = new EngineLogger(path.join(__dirname, 'logs', 'engine.log'));
  logger.debug('debug foo'); // only output to stdout
  logger.info('GET /foo/bar 200ms');
  logger.info('[abc]123');
  logger.warn('warn foo');
  logger.error(new Error('error foo'));
  // const res = await logger.oss({
  //   accessKeyId: 'xxx',
  //   accessKeySecret: 'xxx',
  //   bucket: 'shl-test',
  //   region: 'cn-chengdu',
  //   codeUri: path.join(__dirname, 'test'),
  // });
  // expect(res).toBeInstanceOf(OssClient);
});
