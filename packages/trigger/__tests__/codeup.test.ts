import verifyLegitimacy from '../src';
import { pushWithBranch, pushWithTag, prInputs } from './mock/codeup';

test('codeup webhook push with branch case', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
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

test('codeup webhook push with tag case', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
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

test.only('codeup webhook pr case', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
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