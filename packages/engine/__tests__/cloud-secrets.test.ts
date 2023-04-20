import Engine, { IStepOptions } from '../src';
import { lodash } from '@serverless-cd/core';
import * as path from 'path';
const { get } = lodash;
const logPrefix = path.join(__dirname, 'logs');

describe('cloudSecrets 测试', () => {
  test('plugin case', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        plugin: path.join(__dirname, 'fixtures', 'success'),
        id: 'xuse',
        inputs: {
          ak: '${{cloudSecrets.ak}}',
          name: '${{cloudSecrets.name}}',
          obj: {
            name: '${{cloudSecrets.name}}',
            age: '${{env.age}}',
            long: '${{cloudSecrets.long}}',
          },
          array: [
            {
              name: '${{cloudSecrets.name}}',
              age: '${{env.age}}',
            },
          ],
        },
        env: { age: '20' },
      },
    ] as IStepOptions[];
    const engine = new Engine({
      steps,
      logConfig: { logPrefix },
      inputs: { cloudSecrets: { name: 'xiaoming', long: 'iamxiaoming', ak: '12345678891234567889' } },
    });
    const res = await engine.start();
    expect(get(res, 'status')).toBe('success');
  });
});
