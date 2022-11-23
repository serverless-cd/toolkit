import Engine, { IStepOptions, IContext } from '../src';
import { get, find } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test('模版可以识别 ${{env.name}}', async () => {
  const steps = [
    { run: 'echo ${{env.name}}', env: { name: 'xiaoming' } },
  ] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('模版可以识别 ${{steps.xuse.outputs.success}}', async () => {
  const steps = [
    { uses: path.join(__dirname, 'fixtures', 'app'), id: 'xuse', inputs: { milliseconds: 10 } },
    { run: 'echo ${{steps.xuse.outputs.success}}' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res: IContext | undefined = await engine.start();
  const data = find(res?.steps, (item) => item.stepCount === res?.stepCount);
  expect(data?.outputs).toEqual({ success: true });
});

test.only('shell 指令支持多个指令执行 && ', async () => {
  const steps = [
    { run: 'echo aa && echo bb' },
  ] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});


test('shell 指令支持多个指令执行 >  ', async () => {
  const steps = [
    { run: `echo aa > ${logPrefix}/pipe.txt` },
  ] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});