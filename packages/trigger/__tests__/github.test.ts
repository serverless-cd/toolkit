import verifyLegitimacy, { IPrTypes } from '../src';
import {
  pushWithBranch,
  pushWithTag,
  prWithOpened,
  prWithClosed,
  prWithReopened,
  prWithMerged,
} from './mock/github';

test('no trigger data', async () => {
  const eventConfig = {
    github: {
      secret: '9u6g2w8v7x944qh8',
    },
  };
  const res = await verifyLegitimacy(eventConfig as any, pushWithBranch);
  expect(res?.success).toEqual(false);
});

test('github webhook push with branch prefix is empty(请填写分支前缀，不填默认监听所有分支)', async () => {
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
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {
        name: 'xsahxl',
        email: 'xsahxl@126.com',
      },
      push: {
        branch: 'main',
        tag: undefined,
      },
      commit: {
        id: '6b956d234e19ebf2ab68a5df906d8c7f2afc51d2',
        message: 'Update readme.md',
      },
    },
  });
});

test('github webhook push with branch case', async () => {
  const eventConfig = {
    github: {
      secret: '9u6g2w8v7x944qh8',
      push: {
        branches: {
          prefix: ['feature'],
          precise: ['main'],
          include: ['mian'],
        },
      },
    },
  };

  const res = await verifyLegitimacy(eventConfig, pushWithBranch);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {
        name: 'xsahxl',
        email: 'xsahxl@126.com',
      },
      push: {
        branch: 'main',
        tag: undefined,
      },
      commit: {
        id: '6b956d234e19ebf2ab68a5df906d8c7f2afc51d2',
        message: 'Update readme.md',
      },
    },
  });
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
  console.log(JSON.stringify(res, null, 2));
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {
        name: 'xsahxl',
        email: 'xsahxl@126.com',
      },
      push: {
        branch: undefined,
        tag: 'v0.0.1',
      },
      commit: {
        id: '6b956d234e19ebf2ab68a5df906d8c7f2afc51d2',
        message: 'Update readme.md',
      },
    },
  });
});

test('github webhook success with pr opened', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.OPENED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithOpened);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {},
      pull_request: { type: 'opened', target_branch: 'main', source_branch: 'dev' },
      commit: { id: null, message: 'test pr' },
    },
  });
});
test('github webhook error with pr opened', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.OPENED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          exclude: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithOpened);
  console.log(res);
  expect(res?.success).toEqual(false);
});

test('github webhook success with pr closed', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.CLOSED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithClosed);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {},
      pull_request: { type: 'closed', target_branch: 'main', source_branch: 'dev' },
      commit: {
        id: '6d7a152981ac6877dee45635066de112e08d87c5',
        message: 'test pr',
      },
    },
  });
});
test('github webhook error with pr closed', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.CLOSED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          exclude: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithClosed);
  console.log(res);
  expect(res?.success).toEqual(false);
});

test('github webhook success with pr reopened', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.REOPENED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithReopened);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {},
      pull_request: { type: 'reopened', target_branch: 'main', source_branch: 'dev' },
      commit: {
        id: '6d7a152981ac6877dee45635066de112e08d87c5',
        message: 'test pr',
      },
    },
  });
});
test('github webhook error with pr reopened', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.REOPENED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          exclude: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithReopened);
  console.log(res);
  expect(res?.success).toEqual(false);
});

test('github webhook success with pr merged', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.MERGED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithMerged);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      pusher: {},
      pull_request: { type: 'merged', target_branch: 'main', source_branch: 'dev' },
      commit: {
        id: '347277670e8bcb38452a10f6f6dc98f0555bee1c',
        message: 'test pr',
      },
    },
  });
});
test('github webhook error with pr merged', async () => {
  const eventConfig = {
    github: {
      secret: 'shl123',
      pull_request: {
        types: [IPrTypes.REOPENED],
        branches: {
          prefix: [{ target: 'main', source: 'dev' }],
          precise: [{ target: 'main', source: 'dev' }],
          exclude: [{ target: 'main', source: 'dev' }],
          include: [{ target: 'main', source: 'dev' }],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, prWithMerged);
  console.log(res);
  expect(res?.success).toEqual(false);
});
