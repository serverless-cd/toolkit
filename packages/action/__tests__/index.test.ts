import action from '../src';

describe('Action', () => {
  it('测试：Push', (done) => {
    action({
      path: '/gitee',
      method: 'POST',
      headers: {
        'x-git-oschina-event': 'Push Hook',
        'x-gitee-token': '+XQw8bLPsc8Wet0sG7qSmWan5PR10C44PW2Sp1t20GU=',
      },
      body: Buffer.from(
        JSON.stringify({
          before: 'aaaaaaaaa',
          after: 'bbbbbbbbb',
          repository: {
            owner: {
              id: 1,
              name: 'huangfushan',
            },
          },
          project: {
            id: 1,
            path_with_namespace: 'huangfushan/koa',
          },
          ref: 'refs/heads/master',
        }),
      ),
    }).then((res) => {
      console.log('result', res);
      done();
    });
  });
  it('测试：Release', (done) => {
    action({
      path: '/gitee',
      method: 'POST',
      headers: {
        'x-git-oschina-event': 'Tag Push Hook',
        'x-gitee-token': '+XQw8bLPsc8Wet0sG7qSmWan5PR10C44PW2Sp1t20GU=',
      },
      body: Buffer.from(
        JSON.stringify({
          before: 'aaaaaaaaa',
          after: 'bbbbbbbbb',
          repository: {
            owner: {
              id: 1,
              name: 'huangfushan',
            },
          },
          project: {
            id: 1,
            path_with_namespace: 'huangfushan/koa',
          },
          ref: 'refs/heads/v0.0.1',
        }),
      ),
    }).then((res) => {
      console.log('result', res);
      done();
    });
  });
});
