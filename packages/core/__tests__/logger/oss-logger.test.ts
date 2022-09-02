import OssLogger from '../../src/logger/oss-logger';
import * as path from 'path';
import OssClient from 'ali-oss';

test('OssLogger', async () => {
  const oss = await new OssLogger({
    // 替换成自己的ak/sk
    accessKeyId: 'xxx',
    accessKeySecret: 'xxx',
    bucket: 'shl-test',
    region: 'cn-chengdu',
    codeUri: path.join(__dirname, 'test'),
  }).init();
  expect(oss).toBeInstanceOf(OssClient);
});
