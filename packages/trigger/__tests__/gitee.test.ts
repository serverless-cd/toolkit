import verifyLegitimacy from '../src';
import { pushWithBranch, pushWithTag, prInputs } from './mock/gitee';

test('gitee webhook push with branch case', async () => {
  const eventConfig = {
    gitee: {
      secret: 'shihuali123',
      push: {
        branches: {
          prefix: ['feature'],
          precise: ['master'],
          exclude: ['master'],
          include: ['master'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithBranch);
  expect(res?.success).toEqual(true);
});

test('gitee webhook push with tag case', async () => {
  const eventConfig = {
    gitee: {
      push: {
        tags: {
          prefix: ['feature'],
          precise: ['v0.0.1'],
          exclude: ['1.0.0'],
          include: ['v0.0.1/*'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithTag);
  expect(res?.success).toEqual(true);
});

test('gitee webhook pr case', async () => {
  const eventConfig = {
    gitee: {
      pr: {
        branches: {
          prefix: ['feature'],
          precise: ['master'],
          exclude: ['master'],
          include: ['master'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prInputs);
  expect(res?.success).toEqual(true);
});
