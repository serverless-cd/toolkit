import Engine, { IStepOptions } from '../src';
import { get, omit, map } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

describe('${{secret.name}} => 日志需要为 ***', () => {
  test.only('uses case', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        uses: path.join(__dirname, 'fixtures', 'success'),
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
