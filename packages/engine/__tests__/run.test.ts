import Engine, { IStepOptions } from '../src';
import { get } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test('模版可以识别 {{env.name}}', async () => {
  const steps = [
    { run: 'echo {{env.name}}', env: { name: 'xiaoming' } },
  ] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});
test('模版可以识别 {{steps.xuse.outputs.success}}', async () => {
  const steps = [
    { uses: '@serverless-cd/ts-app', id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo {{steps.xuse.outputs.success}}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
});
