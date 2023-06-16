import verifyLegitimacy, {IPrTypes, getProvider, verifySignature} from '../src';
import {
  pushWithBranch,
  pushWithTag,
  prWithOpened,
  prWithClosed,
  prWithReopened,
  prWithMerged,
  releaseWithPublished,
} from './mock/github';
import {pushWithBranchBySecret} from "./mock/gitee";

test.only('getProvider 测试', async () => {
  const provider = getProvider(pushWithBranch);
  console.log(provider);
  expect(provider).toBe('github');
});

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
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: 'xsahxl@126.com',
      },
      push: { branch: 'main', tag: undefined, ref: 'refs/heads/main' },
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
  console.log(res);

  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: 'xsahxl@126.com',
      },
      push: { branch: 'main', tag: undefined, ref: 'refs/heads/main' },
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
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: 'xsahxl@126.com',
      },
      push: { branch: undefined, tag: 'v0.0.1', ref: 'refs/tags/v0.0.1' },
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
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: undefined,
      },
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
  console.log(res);

  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: undefined,
      },
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
  console.log(res);

  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: undefined,
      },
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
  console.log(res);

  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://github.com/xsahxl/test-cd.git',
      provider: 'github',
      repo_id: 559774849,
      pusher: {
        avatar_url: 'https://avatars.githubusercontent.com/u/21330840?v=4',
        name: 'xsahxl',
        email: undefined,
      },
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

test('github webhook release 测试返回值', async () => {
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
  const res = await verifyLegitimacy(eventConfig, releaseWithPublished);
  console.log(res);
  expect(res).toEqual({ success: false, message: 'Unsupported event type: release' });
});

test('codeup webhook signature verification success', async () => {
  const res = await verifySignature("shihuali123", pushWithBranchBySecret);
  console.log(res);
  expect(res).toEqual(true);
});
