import verifyLegitimacy from '../src';
import { pushWithBranch, pushWithTag, prInputs } from './mock/github';

test('no trigger data', async () => {
  const eventConfig = {
    github: {
      secret: '9u6g2w8v7x944qh8',
    },
  };
  const res = await verifyLegitimacy(eventConfig as any, pushWithBranch);
  expect(res?.success).toEqual(false);
});

test.only('github webhook push with branch prefix is empty(请填写分支前缀，不填默认监听所有分支)', async () => {
  const eventConfig = {
    github: {
      secret: '9u6g2w8v7x944qh8',
      push: {
        branches: {
          prefix: [],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithBranch);
  expect(res?.success).toEqual(true);
});

test('github webhook push with branch case', async () => {
  const eventConfig = {
    github: {
      secret: '9u6g2w8v7x944qh8',
      push: {
        branches: {
          prefix: ['feature'],
          precise: ['main'],
          exclude: ['main'],
          include: ['mian'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithBranch);
  expect(res?.success).toEqual(true);
});

test('github webhook push with tag case', async () => {
  const eventConfig = {
    github: {
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

test('github webhook pr case', async () => {
  const eventConfig = {
    github: {
      pr: {
        branches: {
          prefix: ['feature'],
          precise: ['main'],
          exclude: ['main'],
          include: ['mian'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prInputs);
  expect(res?.success).toEqual(true);
});
