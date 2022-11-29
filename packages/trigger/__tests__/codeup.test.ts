import verifyLegitimacy, { IPrTypes } from '../src';
import {
  pushWithBranch,
  pushWithTag,
  prWithOpened,
  prWithClosed,
  prWithReopened,
  prWithMerged,
} from './mock/codeup';

test('codeup webhook push with branch case', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      push: {
        branches: {
          prefix: ['feature'],
          precise: ['master'],
          include: ['master'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithBranch);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://codeup.aliyun.com/60b045b52c5969c370c5a63e/mamba/fc-node12.git',
      provider: 'codeup',
      pusher: { name: 'dankun_simplemvc', email: 'yuankun.yk@alibaba-inc.com' },
      push: { branch: 'master', tag: undefined },
      commit: {
        id: '4fe524d23668336a778eb02ef79aee7f362a1940',
        message: '更新 a.js',
      },
    },
  });
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
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://codeup.aliyun.com/60b045b52c5969c370c5a63e/mamba/fc-node12.git',
      provider: 'codeup',
      pusher: { name: 'dankun_simplemvc', email: 'yuankun.yk@alibaba-inc.com' },
      push: { branch: undefined, tag: 'v0.0.1' },
      commit: {
        id: '4fe524d23668336a778eb02ef79aee7f362a1940',
        message: '更新 a.js',
      },
    },
  });
});

test('codeup webhook success with pr opened', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.OPENED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithOpened);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://codeup.aliyun.com/60b045b52c5969c370c5a63e/mamba/fc-node12.git',
      provider: 'codeup',
      pusher: { name: 'dankun_simplemvc', email: undefined },
      pull_request: { type: 'opened', target_branch: 'master', source_branch: 'dev' },
      commit: { id: undefined, message: '更新 a.js' },
    },
  });
});
test('codeup webhook error with pr opened', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.OPENED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          exclude: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithOpened);
  console.log(res);
  expect(res?.success).toEqual(false);
});

test('codeup webhook success with pr closed', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.CLOSED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithClosed);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://codeup.aliyun.com/60b045b52c5969c370c5a63e/mamba/fc-node12.git',
      provider: 'codeup',
      pusher: { name: 'dankun_simplemvc', email: 'yuankun.yk@alibaba-inc.com' },
      pull_request: { type: 'closed', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '4ffd0402c3e1d6b04685df7012993b6a7452eea9',
        message: '更新 a.js',
      },
    },
  });
});
test('codeup webhook error with pr closed', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.CLOSED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          exclude: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithClosed);
  console.log(res);
  expect(res?.success).toEqual(false);
});

test('codeup webhook success with pr reopened', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.REOPENED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithReopened);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://codeup.aliyun.com/60b045b52c5969c370c5a63e/mamba/fc-node12.git',
      provider: 'codeup',
      pusher: { name: 'dankun_simplemvc', email: 'yuankun.yk@alibaba-inc.com' },
      pull_request: { type: 'reopened', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '4ffd0402c3e1d6b04685df7012993b6a7452eea9',
        message: '更新 a.js',
      },
    },
  });
});
test('codeup webhook error with pr reopened', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.REOPENED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          exclude: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithReopened);
  console.log(res);
  expect(res?.success).toEqual(false);
});

test('codeup webhook success with pr merged', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.MERGED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithMerged);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://codeup.aliyun.com/60b045b52c5969c370c5a63e/mamba/fc-node12.git',
      provider: 'codeup',
      pusher: { name: 'dankun_simplemvc', email: 'yuankun.yk@alibaba-inc.com' },
      pull_request: { type: 'merged', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '4ffd0402c3e1d6b04685df7012993b6a7452eea9',
        message: '更新 a.js',
      },
    },
  });
});
test('codeup webhook error with pr merged', async () => {
  const eventConfig = {
    codeup: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.REOPENED],
        branches: {
          prefix: [{ target: 'master', source: 'dev' }],
          precise: [{ target: 'master', source: 'dev' }],
          exclude: [{ target: 'master', source: 'dev' }],
          include: [{ target: 'master', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithMerged);
  console.log(res);
  expect(res?.success).toEqual(false);
});
