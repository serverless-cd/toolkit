import _ from 'lodash';
import { IHookPayload } from '../../src/types';
import webHook from '../../src';
import { GITHUB_PAYLOAD, ISSUE, PUSH, PULL, TAG } from '../mock/github';
import { SECRET } from '../mock/multiplex';

const eventKey = 'x-github-event';

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
 
    const payload = await webHook(parame);;
    expect(payload).toEqual({
      success: false,
      message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
    });
  });

  test('事件验证匹配', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: _.get(ISSUE, `headers[${eventKey}]`),
    });
 
    const payload = await webHook(parame);;
    expect(payload).toEqual({
      success: true
    });
  });

  test('匹配所有的事件', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: '*',
    });
 
    const payload = await webHook(parame);;
    expect(payload).toEqual({
      success: true
    });
  });

  test('事件配置为数组', async () => {
    const parame = _.cloneDeep({
      ...ISSUE,
      secret: SECRET,
      on: ['push', 'issues'],
    });
 
    const payload = await webHook(parame);;
    expect(payload).toEqual({
      success: true
    });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: true
      });
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
   
      const payload = await webHook(parame);;
      expect(payload).toEqual({
        success: false,
        message: `No ${_.get(parame, `headers[${eventKey}]`)} event was matched`,
      });
    });
  });
});

