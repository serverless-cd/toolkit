import verifyLegitimacy, { IPrTypes, getProvider } from '../src';
import {
  pushWithBranch,
  pushWithBranch15,
  pushWithTag,
  prWithOpened,
  prWithClosed,
  prWithReopened,
  prWithMerged,
  prWithMerged1,
  DataWithNoUserAgent,
} from './mock/gitlab';

test('getProvider 测试', async () => {
  const provider = getProvider(pushWithBranch);
  console.log(provider);
  expect(provider).toBe('gitlab');
});

test.only('DataWithNoUserAgent', async () => {
  const eventConfig = {
    gitlab: {
      secret: 'serverless-devs',
      push: {
        branches: {
          precise: ['master'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, DataWithNoUserAgent);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'http://git.greedyint.com/amall-fc/amall-assistant.git',
      provider: 'gitlab',
      repo_id: 'http://git.greedyint.com/amall-fc/amall-assistant:2095',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/f3975a8978bcf7543bdd29cb9994a659?s=80&d=identicon',
        name: 'amall-fc',
        email: '',
      },
      push: { branch: 'master', tag: undefined, ref: 'refs/heads/master' },
      commit: {
        id: '505113a53f3e4f34bb92d88e81f2b44228b3d7f9',
        message: 'Update s.yaml 指定镜像源',
      },
    },
  });
});

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

test('gitlab 15.7 webhook push with branch case', async () => {
  const eventConfig = {
    gitlab: {
      secret: 'serverless-devs',
      push: {
        branches: {
          precise: ['6348-feat'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithBranch15);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://gitlab.com/zsqk/Zsqk.git',
      provider: 'gitlab',
      repo_id: 'https://gitlab.com/zsqk/Zsqk:3499914',
      pusher: {
        avatar_url: 'https://gitlab.com/uploads/-/system/user/avatar/1681820/avatar.png',
        name: '2ni',
        email: '',
      },
      push: {
        branch: '6348-feat',
        tag: undefined,
        ref: 'refs/heads/6348-feat',
      },
      commit: {
        id: '25b702b4f846d523d23ef6cedcb30dd12c3a24a3',
        message: 'opt: 新增模拟数据及 API 数据类型\n',
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

test('gitlab new case webhook success with pr merged', async () => {
  const eventConfig = {
    gitlab: {
      secret: 'serverless-devs',
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
  const res = await verifyLegitimacy(eventConfig, prWithMerged1);
  console.log(res);
  expect(res).toEqual({
    success: true,
    data: {
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
      provider: 'gitlab',
      repo_id:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt:8',
      pusher: {
        avatar_url:
          'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
        name: 'Administrator',
        email: 'serverles-cd@163.com',
      },
      pull_request: { type: 'merged', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '52e1e9084304509220fe27a0b434b8cdb658cbdc',
        message: 'Update s.yaml',
      },
    },
  });
});
