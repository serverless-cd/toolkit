import Engine, { IStepOptions } from '../src';
import { get } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs');

describe('${{secret.name}} => 日志需要为 ***', () => {
  test('plugin case', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        plugin: path.join(__dirname, 'fixtures', 'success'),
        id: 'xuse',
        inputs: {
          name: '${{secrets.name}}',
          obj: {
            name: '${{secrets.name}}',
            age: '${{env.age}}',
            long: '${{secrets.long}}',
          },
          array: [
            {
              name: '${{secrets.name}}',
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
      inputs: { secrets: { name: 'xiaoming', long: 'iamxiaoming' } },
    });
    const res = await engine.start();
    expect(get(res, 'status')).toBe('success');
  });
});
