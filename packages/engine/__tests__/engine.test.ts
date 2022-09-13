import Engine, { IStepOptions } from '../src';
import { get, omit, map } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs', '/tmp/uid/appname/releaseid');

test.skip('logger oss', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '@serverless-cd/ts-app', id: 'xuse', with: { milliseconds: 10 } },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({
    steps,
    logPrefix,
    ossConfig: {
      accessKeyId: 'xxx',
      accessKeySecret: 'xxx',
      bucket: 'shl-test',
      region: 'cn-chengdu',
    },
  });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
});

test('获取某一步的outputs', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '@serverless-cd/ts-app', id: 'xuse', with: { milliseconds: 10 } },
    { run: 'echo "world"' },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
});

describe('if测试', () => {
  test('模版可以识别{{steps.xhello.status === "success"}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        run: 'echo "world"',
        if: '{{ steps.xhello.status === "success" }}',
        id: 'xworld',
      },
      { run: 'echo "end"', id: 'xend' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 获取步骤1的status
    expect(get(res, 'steps.xhello.status')).toBe('success');
    // 步骤2执行成功说明模版识别成功
    expect(get(res, 'steps.xworld.status')).toBe('success');
  });

  test('模版可以识别{{steps.xhello.status !== "success"}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        run: 'echo "world"',
        if: '{{ steps.xhello.status !== "success" }}',
        id: 'xworld',
      },
      { run: 'echo "end"', id: 'xend' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 获取步骤1的status
    expect(get(res, 'steps.xhello.status')).toBe('success');
    // 步骤2的执行状态为skip，说明模版识别成功
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
  });

  test("模版可以识别{{ steps.xhello.status === 'success' && steps.xworld.status === 'success' }}", async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"', id: 'xworld' },
      {
        run: 'echo "end"',
        if: "{{ steps.xhello.status === 'success' && steps.xworld.status === 'success' }}",
        id: 'xend',
      },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 获取步骤1的状态
    expect(get(res, 'steps.xhello.status')).toBe('success');
    // 获取步骤2的状态
    expect(get(res, 'steps.xworld.status')).toBe('success');
    // 步骤3执行成功说明模版识别成功
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test("模版可以识别{{ steps.xhello.status === 'success' && steps.xworld.status !== 'success' }}", async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"', id: 'xworld' },
      {
        run: 'echo "end"',
        if: "{{ steps.xhello.status === 'success' && steps.xworld.status !== 'success' }}",
        id: 'xend',
      },
    ] as IStepOptions[];

    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 获取步骤1的状态
    expect(get(res, 'steps.xhello.status')).toBe('success');
    // 获取步骤2的状态
    expect(get(res, 'steps.xworld.status')).toBe('success');
    // 步骤3的执行状态为skip，说明模版识别成功
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });
  test('模版可以识别 {{env.name === "xiaoming"}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello', if: '{{ env.name === "xiaoming" }}' },
      {
        run: 'echo "world"',
        id: 'xworld',
        if: '{{ env.name === "xiaoming" }}',
        env: { name: 'xiaoming' },
      },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    expect(get(res, 'steps')).toEqual({
      xhello: { status: 'skipped' },
      xworld: { status: 'success', outputs: {} },
    });
  });
});

describe('run测试', () => {
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
      { uses: '@serverless-cd/ts-app', id: 'xuse', with: { milliseconds: 10 } },
      { run: 'echo {{steps.xuse.outputs.success}}' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
  });
});

describe('某一步执行失败', () => {
  test('后续步骤执行状态为skip', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];

    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
  });

  test('但该步骤添加了continue-on-error: true，后续步骤正常执行', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 error-with-continue
    expect(get(res, 'steps.xerror.status')).toBe('error-with-continue');
    // 步骤3 依然会执行
    expect(get(res, 'steps.xworld.status')).toBe('success');
  });

  test('但该步骤添加了continue-on-error: true，但执行步骤的终态是success', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 error-with-continue
    expect(get(res, 'steps.xerror.status')).toBe('error-with-continue');
    // 步骤3 依然会执行
    expect(get(res, 'status')).toBe('success');
  });

  test('后续某步骤标记了if: {{ failure() }}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', id: 'xworld' },
      { run: 'echo "end"', id: 'xend', if: '{{ failure() }}' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 执行成功, 状态为 success
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test('后续多个步骤标记了if: {{ failure() }}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', id: 'xworld', if: '{{ failure() }}' },
      { run: 'echo "end"', id: 'xend', if: '{{ failure() }}' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('success');
    // 步骤4 执行成功, 状态为 success
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test("后续某步骤标记了if: {{ failure() && steps.xerror.status === 'failure' }}", async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', id: 'xworld' },
      {
        run: 'echo "end"',
        id: 'xend',
        if: "{{ failure() && steps.xerror.status === 'failure' }}",
      },
    ] as IStepOptions[];

    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 执行成功, 状态为 success
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test("后续某步骤标记了if: {{ failure() && steps.xerror.status !== 'failure' }}", async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', id: 'xworld' },
      {
        run: 'echo "end"',
        id: 'xend',
        if: "{{ failure() && steps.xerror.status !== 'failure' }}",
      },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 未执行, 状态为 skipped
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });

  test('后续某步骤标记了if: {{ success() }}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', if: '{{ success() }}', id: 'xworld' },
      { run: 'echo "end"', id: 'xend' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 未执行, 状态为 skipped
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
    // 步骤4 未执行, 状态为 skipped
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });

  test('后续某步骤标记了if: {{ always() }}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', if: '{{ always() }}', id: 'xworld' },
      { run: 'echo "end"', id: 'xend' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const res = await engine.start();
    // 步骤2 状态是 failure
    expect(get(res, 'steps.xerror.status')).toBe('failure');
    // 步骤3 依然执行
    expect(get(res, 'steps.xworld.status')).toBe('success');
    // 步骤4 未执行, 状态为 skipped
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });
});

test('cancel测试', (done) => {
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
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const callback = jest.fn(() => {
    engine.cancel();
  });
  lazy(callback);
  engine.start();
  setTimeout(() => {
    expect(callback).toBeCalled();
    done();
  }, 3001);
});

describe('执行终态emit测试', () => {
  test('success', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    engine.on('success', (data) => {
      const newData = map(data, (item) => omit(item, 'stepCount'));

      expect(newData).toEqual([
        {
          run: 'echo "hello"',
          id: 'xhello',
          status: 'success',
        },
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
    const engine = new Engine({ steps, logPrefix });
    engine.on('completed', (data) => {
      const newData = map(data, (item) => omit(item, 'stepCount'));
      expect(newData).toEqual([
        {
          run: 'echo "hello"',
          id: 'xhello',
          status: 'success',
        },
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
    const engine = new Engine({ steps, logPrefix });
    engine.on('failure', (data) => {
      const newData = map(data, (item) => omit(item, 'stepCount'));
      expect(newData).toEqual([
        { run: 'echo "hello"', id: 'xhello', status: 'success' },
        { run: 'npm run error', id: 'xerror', status: 'failure' },
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
      { run: 'echo "end"', if: '{{ cancelled() }}' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
    const callback = jest.fn(() => {
      engine.cancel();
    });
    lazy(callback);
    engine.on('cancelled', (data) => {
      const newData = map(data, (item) => omit(item, 'stepCount'));
      expect(newData).toEqual([
        { run: 'echo "hello"', status: 'success' },
        {
          run: 'node packages/engine/__tests__/cancel-test.js',
          status: 'cancelled',
        },
        { run: 'echo "world"', status: 'cancelled' },
        { run: 'echo "end"', if: 'true', status: 'success' },
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
  test('success, failure, skipped, error-with-continue', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror', 'continue-on-error': true },
      { run: 'echo "world"', id: 'xworld' },
      { run: 'npm run error1', id: 'xerror1' },
      { run: 'echo "world1"', id: 'xworld1' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
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

  test('cancelled', (done) => {
    const lazy = (fn: any) => {
      setTimeout(() => {
        console.log('3s后执行 callback');
        fn();
      }, 3000);
    };
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'node packages/engine/__tests__/cancel-test.js', id: 'xcancel' },
    ] as IStepOptions[];
    const engine = new Engine({ steps, logPrefix });
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
      ]);
      expect(callback).toBeCalled();
      done();
    }, 3001);
  });
});

test('uses：应用测试返回值', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '@serverless-cd/ts-app', id: 'xuse', with: { milliseconds: 10 } },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logPrefix });
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
  // error case
  // expect(get(res, 'steps.xuse.errorMessage').toString()).toMatch('Error');
});
