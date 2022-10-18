import Engine, { IStepOptions } from '../src';
import { map } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

describe('执行终态emit测试', () => {
  test('success', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    engine.on('success', (data) => {
      const newData = map(data, (item) => ({ run: item.run, status: item.status }));
      expect(newData).toEqual([
        { run: 'echo "hello"', status: 'success' },
        { run: 'echo "world"', status: 'success' },
      ]);
    });
    await engine.start();
  });
  test('completed', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    engine.on('completed', (data) => {
      const newData = map(data, (item) => ({ run: item.run, status: item.status }));
      expect(newData).toEqual([
        { run: 'echo "hello"', status: 'success' },
        { run: 'echo "world"', status: 'success' },
      ]);
    });
    await engine.start();
  });
  test('failure', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    engine.on('failure', (data) => {
      const newData = map(data, (item) => ({ run: item.run, status: item.status }));
      expect(newData).toEqual([
        { run: 'echo "hello"', status: 'success' },
        { run: 'npm run error', status: 'failure' },
      ]);
    });
    await engine.start();
  });

  test('cancelled', (done) => {
    const lazy = (fn: any) => {
      setTimeout(() => {
        console.log('3s后执行 callback');
        fn();
      }, 3000);
    };
    const steps = [
      { run: 'echo "hello"' },
      { run: 'node packages/engine/__tests__/cancel-test.js' },
      { run: 'echo "world"' },
      { run: 'echo "end"', if: '${{ cancelled() }}' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    const callback = jest.fn(() => {
      engine.cancel();
    });
    lazy(callback);
    engine.on('cancelled', (data) => {
      const newData = map(data, (item) => ({ run: item.run, status: item.status }));
      expect(newData).toEqual([
        { run: 'echo "hello"', status: 'success' },
        {
          run: 'node packages/engine/__tests__/cancel-test.js',
          status: 'cancelled',
        },
        { run: 'echo "world"', status: 'cancelled' },
        { run: 'echo "end"', status: 'success' },
      ]);
    });
    engine.start();
    setTimeout(() => {
      expect(callback).toBeCalled();
      done();
    }, 3001);
  });
});

describe('步骤执行过程中emit测试', () => {
  test('uses throw error on failture', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        uses: path.join(__dirname, 'fixtures', 'error'),
        id: 'xuse',
        inputs: { milliseconds: 10 },
      },
      {
        uses: path.join(__dirname, 'fixtures', 'error'),
        id: 'xuse',
        inputs: { milliseconds: 10 },
      },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    engine.on('failure', (data) => {
      const newData = map(data, (item) => {
        const obj: any = {
          status: item.status,
        };
        if (item.errorMessage) {
          obj['errorMessage'] = item.errorMessage;
        }
        return obj;
      });
      expect(newData).toEqual([
        { status: 'success' },
        { status: 'failure', errorMessage: 'my error' },
        { status: 'skipped' },
        { status: 'skipped' },
      ]);
    });
    await engine.start();
  });
  test('uses throw error on process', async () => {
    const steps = [
      {
        uses: path.join(__dirname, 'fixtures', 'error'),
        id: 'xerror',
        inputs: { milliseconds: 10 },
      },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    const newData: any = [];
    engine.on('process', (data) => {
      const obj: any = {
        status: data.status,
      };
      if (data.errorMessage) {
        obj['errorMessage'] = data.errorMessage;
      }
      if (data.outputs) {
        obj['outputs'] = data.outputs;
      }
      newData.push(obj);
    });
    await engine.start();
    expect(newData).toEqual([
      { status: 'failure', errorMessage: 'my error' },
      { status: 'skipped' },
    ]);
  });
  test('uses success on process', async () => {
    const steps = [
      {
        uses: path.join(__dirname, 'fixtures', 'success'),
        id: 'xapp',
        inputs: { milliseconds: 10 },
      },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    const newData: any = [];
    engine.on('process', (data) => {
      const obj: any = {
        status: data.status,
      };
      if (data.errorMessage) {
        obj['errorMessage'] = data.errorMessage;
      }
      if (data.outputs) {
        obj['outputs'] = data.outputs;
      }
      newData.push(obj);
    });
    await engine.start();
    expect(newData).toEqual([
      { status: 'success', outputs: { success: true } },
      { status: 'success', outputs: {} },
    ]);
  });
  test('success, failure, skipped, error-with-continue', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
      { run: 'echo "world"', id: 'xworld' },
      { run: 'npm run error1', id: 'xerror1' },
      { run: 'echo "world1"', id: 'xworld1' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    const newData: any = [];
    engine.on('process', (data) => {
      newData.push({
        run: data.run,
        id: data.id,
        status: data.status,
      });
    });
    await engine.start();
    expect(newData).toEqual([
      { run: 'echo "hello"', id: 'xhello', status: 'success' },
      { run: 'npm run error', id: 'xerror', status: 'error-with-continue' },
      { run: 'echo "world"', id: 'xworld', status: 'success' },
      { run: 'npm run error1', id: 'xerror1', status: 'failure' },
      { run: 'echo "world1"', id: 'xworld1', status: 'skipped' },
    ]);
  });

  test.skip('cancelled', (done) => {
    const lazy = (fn: any) => {
      setTimeout(() => {
        console.log('3s后执行 callback');
        fn();
      }, 3000);
    };
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'node packages/engine/__tests__/cancel-test.js', id: 'xcancel' },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logConfig: { logPrefix } });
    const callback = jest.fn(() => {
      engine.cancel();
    });
    lazy(callback);
    const newData: any = [];
    engine.on('process', (data) => {
      newData.push({
        run: data.run,
        id: data.id,
        status: data.status,
      });
    });
    engine.start();
    setTimeout(() => {
      expect(newData).toEqual([
        { run: 'echo "hello"', id: 'xhello', status: 'success' },
        {
          run: 'node packages/engine/__tests__/cancel-test.js',
          id: 'xcancel',
          status: 'cancelled',
        },
        { run: 'echo "world"', id: 'xworld', status: 'cancelled' },
      ]);
      expect(callback).toBeCalled();
      done();
    }, 3001);
  });
});
