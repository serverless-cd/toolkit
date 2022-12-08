import verifyLegitimacy, { IPrTypes } from '../src';
import {
  pushWithBranch,
  pushWithBranchBySecret,
  pushWithTag,
  prWithOpened,
  prWithClosed,
  prWithReopened,
  prWithMerged,
} from './mock/gitee';

test('gitee webhook push with branch case', async () => {
  const eventConfig = {
    gitee: {
      password: 'shihuali123',
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
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      push: { branch: 'master', tag: undefined, ref: 'refs/heads/master' },
      commit: {
        id: 'e5ae1e4776fcdffc8098b420be940cf5565b1404',
        message:
          'update s_en.yaml.\n' + '\n' + 'Signed-off-by: shihuali &lt;shihuali5257@126.com&gt;',
      },
    },
  });
});

test('gitee webhook push with branch case (签名密钥)', async () => {
  const eventConfig = {
    gitee: {
      secret: 'shihuali123',
      push: {
        branches: {
          prefix: ['feature'],
          precise: ['master'],
          include: ['master'],
        },
      },
    },
  };
  const res = await verifyLegitimacy(eventConfig, pushWithBranchBySecret);
  console.log(res);

  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      push: { branch: 'master', tag: undefined, ref: 'refs/heads/master' },
      commit: {
        id: 'e5ae1e4776fcdffc8098b420be940cf5565b1404',
        message:
          'update s_en.yaml.\n' + '\n' + 'Signed-off-by: shihuali &lt;shihuali5257@126.com&gt;',
      },
    },
  });
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
  console.log(res);

  expect(res).toEqual({
    success: true,
    data: {
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      push: { branch: undefined, tag: 'v0.0.1', ref: 'refs/tags/v0.0.1' },
      commit: {
        id: 'f808ff5622d7fa38fb4800c543b49fccb7ad969b',
        message: 'update s_en.yaml. 33\n\nSigned-off-by: shihuali <shihuali5257@126.com>',
      },
    },
  });
});

test('gitee webhook success with pr opened', async () => {
  const eventConfig = {
    gitee: {
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
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      pull_request: { type: 'opened', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '886a5e8dfdfe5d3699406ceda62c096a38312fe7',
        message: 'test pr',
      },
    },
  });
});
test('gitee webhook error with pr opened', async () => {
  const eventConfig = {
    gitee: {
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

test('gitee webhook success with pr closed', async () => {
  const eventConfig = {
    gitee: {
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
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      pull_request: { type: 'closed', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '886a5e8dfdfe5d3699406ceda62c096a38312fe7',
        message: 'test pr',
      },
    },
  });
});
test('gitee webhook error with pr closed', async () => {
  const eventConfig = {
    gitee: {
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

test('gitee webhook success with pr reopened', async () => {
  const eventConfig = {
    gitee: {
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
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      pull_request: { type: 'reopened', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '886a5e8dfdfe5d3699406ceda62c096a38312fe7',
        message: 'test pr',
      },
    },
  });
});
test('gitee webhook error with pr reopened', async () => {
  const eventConfig = {
    gitee: {
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

test('gitee webhook success with pr merged', async () => {
  const eventConfig = {
    gitee: {
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
      url: 'https://gitee.com/shihuali/start-express-ff.git',
      provider: 'gitee',
      repo_id: 23408082,
      pusher: {
        avatar_url: 'https://gitee.com/assets/no_portrait.png',
        name: 'shihuali',
        email: 'shihuali5257@126.com',
      },
      pull_request: { type: 'merged', target_branch: 'master', source_branch: 'dev' },
      commit: {
        id: '5066770d86b75b7b3dd2e6775d0bcab4fc5db2f8',
        message: 'test pr',
      },
    },
  });
});
test('gitee webhook error with pr merged', async () => {
  const eventConfig = {
    gitee: {
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
