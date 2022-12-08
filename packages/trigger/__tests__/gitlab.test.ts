import verifyLegitimacy, { IPrTypes } from '../src';
import {
  pushWithBranch,
  pushWithTag,
  prWithOpened,
  prWithClosed,
  prWithReopened,
  prWithMerged,
} from './mock/gitlab';

test('gitlab webhook push with branch case', async () => {
  const eventConfig = {
    gitlab: {
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
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express:2',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      push: { branch: 'master', tag: undefined, ref: 'master' },
      commit: {
        id: '11f3b6b360d8ae4e5f71ec36422a5b776df02896',
        message: 'Update README.md',
      },
    },
  });
});

test('gitlab webhook push with tag case', async () => {
  const eventConfig = {
    gitlab: {
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
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express:2',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      push: { branch: undefined, tag: 'v0.0.1', ref: 'v0.0.1' },
      commit: {
        id: '11f3b6b360d8ae4e5f71ec36422a5b776df02896',
        message: 'Update README.md',
      },
    },
  });
});

test('gitlab webhook success with pr opened', async () => {
  const eventConfig = {
    gitlab: {
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
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express:2',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      pull_request: { type: 'opened', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        message: 'Draft: Dev',
      },
    },
  });
});
test('gitlab webhook error with pr opened', async () => {
  const eventConfig = {
    gitlab: {
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

test('gitlab webhook success with pr closed', async () => {
  const eventConfig = {
    gitlab: {
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
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express:2',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      pull_request: { type: 'closed', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        message: 'Draft: Dev',
      },
    },
  });
});
test('gitlab webhook error with pr closed', async () => {
  const eventConfig = {
    gitlab: {
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

test('gitlab webhook success with pr reopened', async () => {
  const eventConfig = {
    gitlab: {
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
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express:2',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      pull_request: { type: 'reopened', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        message: 'Draft: Dev',
      },
    },
  });
});
test('gitlab webhook error with pr reopened', async () => {
  const eventConfig = {
    gitlab: {
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

test('gitlab webhook success with pr merged', async () => {
  const eventConfig = {
    gitlab: {
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
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express:2',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      pull_request: { type: 'merged', target_branch: 'master', source_branch: 'dev' },
      commit: { id: 'f3fa5f2fa1b4ae580e694224fcc02f322a5deebf', message: 'Dev' },
    },
  });
});
test('gitlab webhook error with pr merged', async () => {
  const eventConfig = {
    gitlab: {
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
