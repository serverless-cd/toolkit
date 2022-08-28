import _ from 'lodash';
import { IHookPayload } from '../../src/types';
import webHook from '../../src';
import { GITHUB_PAYLOAD, ISSUE, PUSH, PULL, TAG } from '../mock/github';
import { SECRET } from '../mock/multiplex';

const eventKey = 'x-github-event';

async function runWebHookSuccess(parame: IHookPayload) {
  const payload = await webHook(parame);;
  expect(payload).toEqual({
    success: true
  });
}

async function runWebHookFail(parame: IHookPayload) {
  const payload = await webHook(parame);;
  expect(payload).toEqual({
    success: false,
    message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
  });
}

test('请求头 x-github-event 异常', async () => {
  const parame: IHookPayload = _.cloneDeep({
    ...GITHUB_PAYLOAD,
    secret: SECRET,
    on: '*',
  });
  _.set(parame, `headers[${eventKey}]`, undefined);

  await expect(async () => {
    await webHook(parame);
  }).rejects.toThrow(`No ${eventKey} found on request`);
});

describe('参数 on 验证', () => {
  test('事件验证不匹配', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: 'push',
    });
 
    await runWebHookFail(parame);
  });

  test('事件验证匹配', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: _.get(ISSUE, `headers[${eventKey}]`),
    });

    await runWebHookSuccess(parame);
  });

  test('匹配所有的事件', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: '*',
    });
 
    await runWebHookSuccess(parame);
  });

  test('事件配置为数组', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: ['push', 'issues'],
    });
 
    await runWebHookSuccess(parame);
  });

  describe('事件配置为对象', () => {
    test('配置 types: 匹配', async () => {
      const parame = _.cloneDeep({
        ...ISSUE,
        secret: SECRET,
        on: {
          issues: {
            types: ['opened']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 types 配置: 未匹配', async () => {
      const parame = _.cloneDeep({
        ...ISSUE,
        secret: SECRET,
        on: {
          issues: {
            types: ['closed']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 push.paths: 匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            paths: ['version.*']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 push.paths: 未匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            paths: ['test.md', 'test2.md']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 push.paths-ignore: 匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            "paths-ignore": ['test.md']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 push.paths-ignore: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            "paths-ignore": ['version.md']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 push.branches: 匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            branches: ['test', 'master', 'main']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 push.branches: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            branches: ['master', 'main']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 push.branches-ignore: 匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            'branches-ignore': ['master', 'main']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 push.branches-ignore: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...PUSH,
        secret: SECRET,
        on: {
          push: {
            'branches-ignore': ['test']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 push.tags: 匹配', async () => {
      const parame = _.cloneDeep({
        ...TAG,
        secret: SECRET,
        on: {
          push: {
            tags: ['0.0.*']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 push.tags: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...TAG,
        secret: SECRET,
        on: {
          push: {
            tags: ['v0.0.*']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 push.tags-ignore: 匹配', async () => {
      const parame = _.cloneDeep({
        ...TAG,
        secret: SECRET,
        on: {
          push: {
            'tags-ignore': ['v0.0.*']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 push.tags-ignore: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...TAG,
        secret: SECRET,
        on: {
          push: {
            'tags-ignore': ['0.0.*']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 pull_request.branches: 匹配', async () => {
      const parame = _.cloneDeep({
        ...PULL,
        secret: SECRET,
        on: {
          pull_request: {
            branches: ['test']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 pull_request.branches: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...PULL,
        secret: SECRET,
        on: {
          issues: {
            types: ['master']
          },
        },
      });
   
      await runWebHookFail(parame);
    });

    test('配置 pull_request.branches-ignore: 匹配', async () => {
      const parame = _.cloneDeep({
        ...PULL,
        secret: SECRET,
        on: {
          pull_request: {
            'branches-ignore': ['master']
          },
        },
      });
   
      await runWebHookSuccess(parame);
    });

    test('配置 pull_request.branches-ignore: 不匹配', async () => {
      const parame = _.cloneDeep({
        ...PULL,
        secret: SECRET,
        on: {
          issues: {
            'branches-ignore': ['test']
          },
        },
      });
   
      await runWebHookFail(parame);
    });
  });
});
