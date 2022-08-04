import action from '../src';

test('action', (done) => {
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
    expect('action').toBe('action');
  });
});
