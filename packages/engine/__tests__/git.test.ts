import Engine, { IStepOptions, IContext } from '../src';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs');

test('git token 加密', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { plugin: path.join(__dirname, 'fixtures', 'success'), id: 'xuse' },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    inputs: {
      git: {
        token: '1234567890123456789',
      },
    },
  });
  const res: IContext | undefined = await engine.start();
  expect(res.status).toBe('success');
});
