import Engine from '../src';
import { IStepOptions } from '../src/types';
import { get } from 'lodash';
import * as path from 'path';

describe('执行step全部成功', () => {
  test('获取某一步的outputs', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"' },
    ] as IStepOptions[];
    const engine = new Engine(steps);
    const res = await engine.start();
    expect(get(res, 'steps.xhello.outputs.code')).toBe(0);
  });

  test('模版可以识别{{steps.xhello.outputs.code === 0}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        run: 'echo "world"',
        if: '{{ steps.xhello.outputs.code === 0 }}',
        id: 'xworld',
      },
      { run: 'echo "end"', id: 'xend' },
    ] as IStepOptions[];
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的outputs
    expect(get(res, 'steps.xhello.outputs.code')).toBe(0);
    // 步骤2执行成功说明模版识别成功
    expect(get(res, 'steps.xworld.status')).toBe('success');
  });

  test('模版可以识别{{steps.xhello.outputs.code !== 0}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      {
        run: 'echo "world"',
        if: '{{ steps.xhello.outputs.code !== 0 }}',
        id: 'xworld',
      },
      { run: 'echo "end"', id: 'xend' },
    ] as IStepOptions[];
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的outputs
    expect(get(res, 'steps.xhello.outputs.code')).toBe(0);
    // 步骤2的执行状态为skip，说明模版识别成功
    expect(get(res, 'steps.xworld.status')).toBe('skipped');
  });

  test('模版可以识别{{steps.xhello.outputs.code === 0 && steps.xworld.outputs.code === 0}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"', id: 'xworld' },
      {
        run: 'echo "end"',
        if: '{{ steps.xhello.outputs.code === 0 && steps.xworld.outputs.code === 0 }}',
        id: 'xend',
      },
    ] as IStepOptions[];
    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的outputs
    expect(get(res, 'steps.xhello.outputs.code')).toBe(0);
    // 获取步骤2的outputs
    expect(get(res, 'steps.xworld.outputs.code')).toBe(0);

    // 步骤3执行成功说明模版识别成功
    expect(get(res, 'steps.xend.status')).toBe('success');
  });

  test('模版可以识别{{steps.xhello.outputs.code === 0 && steps.xworld.outputs.code !== 0}}', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'echo "world"', id: 'xworld' },
      {
        run: 'echo "end"',
        if: '{{ steps.xhello.outputs.code === 0 && steps.xworld.outputs.code !== 0 }}',
        id: 'xend',
      },
    ] as IStepOptions[];

    const engine = new Engine(steps);
    const res = await engine.start();
    // 获取步骤1的outputs
    expect(get(res, 'steps.xhello.outputs.code')).toBe(0);

    // 获取步骤2的outputs
    expect(get(res, 'steps.xworld.outputs.code')).toBe(0);
    // 步骤3的执行状态为skip，说明模版识别成功
    expect(get(res, 'steps.xend.status')).toBe('skipped');
  });
});

describe('某一步执行失败', () => {
  test('后续步骤执行状态为skip', async () => {
    const steps = [
      { run: 'echo "hello"', id: 'xhello' },
      { run: 'npm run error', id: 'xerror' },
      { run: 'echo "world"', id: 'xworld' },
    ] as IStepOptions[];

    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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

    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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
    const engine = new Engine(steps);
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
  const engine = new Engine(steps);
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
    const engine = new Engine(steps);
    engine.on('success', (data) => {
      expect(data).toEqual([
        { run: 'echo "hello"', id: 'xhello', status: 'success' },
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
    const engine = new Engine(steps);
    engine.on('failure', (data) => {
      expect(data).toEqual([
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
    ] as IStepOptions[];
    const engine = new Engine(steps);
    const callback = jest.fn(() => {
      engine.cancel();
    });
    lazy(callback);
    engine.on('cancelled', (data) => {
      expect(data).toEqual([
        { run: 'echo "hello"', status: 'success' },
        {
          run: 'node packages/engine/__tests__/cancel-test.js',
          status: 'cancelled',
        },
      ]);
    });
    engine.start();
    setTimeout(() => {
      expect(callback).toBeCalled();
      done();
    }, 3001);
  });
});

//TODO：后续可以用真实应用测试
test.only('uses：应用测试返回值', async () => {
  const steps = [
    { run: 'echo "hello"', id: 'xhello' },
    { uses: '/Users/shihuali/workspace/typescript-app-template/lib/index.js', id: 'xuse' },
  ] as IStepOptions[];
  const engine = new Engine(steps);
  const res = await engine.start();
  expect(get(res, 'steps.xuse.outputs')).toEqual({ success: true });
  // error case
  // expect(get(res, 'steps.xuse.errorMessage').toString()).toMatch('Error');
});
