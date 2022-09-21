import Engine, { IStepOptions } from '../src';
import { get, omit, map } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

describe('{{secret.name}} => 日志需要为 ***', () => {
  test('uses case', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        uses: path.join(__dirname, 'fixtures', 'app'),
        id: 'xuse',
        inputs: {
          name: '{{secret.name}}',
          obj: {
            name: '{{secret.name}}',
            age: '{{env.age}}',
            long: '{{secret.long}}',
          },
          array: [
            {
              name: '{{secret.name}}',
              age: '{{env.age}}',
            },
          ],
        },
        env: { name: 'xiaoming', age: '20', long: 'iamxiaoming' },
      },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    expect(get(res, 'steps.xuse.status')).toBe('success');
  });

  test('run case', async () => {
    const steps = [
      {
        run: 'echo "s config add --AccessKeyID {{secret.AccessKeyID}} --AccessKeySecret {{secret.AccessKeySecret}}"',
        id: 'xrun',
        env: {
          AccessKeyID: '123',
          AccessKeySecret: '456',
        },
      },
    ] as unknown as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    expect(get(res, 'steps.xrun.status')).toBe('success');
  });
  test('emit complete', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        run: 'echo "s config add --AccessKeyID {{secret.AccessKeyID}} --AccessKeySecret {{secret.AccessKeySecret}}"',
        id: 'xrun',
        env: {
          AccessKeyID: '123',
          AccessKeySecret: '456',
        },
      },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    engine.on('completed', (data) => {
      const newData = map(data, (item) => omit(item, 'stepCount'));
      expect(newData).toEqual([
        { run: 'echo "hello"', id: 'xhello', status: 'success' },
        {
          run: 'echo "s config add --AccessKeyID *** --AccessKeySecret ***"',
          id: 'xrun',
          env: { AccessKeyID: '123', AccessKeySecret: '456' },
          status: 'success',
        },
      ]);
    });
    await engine.start();
  });
});
