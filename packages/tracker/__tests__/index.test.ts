import tracker from '../src/index';
import path from 'path';
import get from 'lodash.get'
require('dotenv').config({ path: path.join(__dirname, '.env') });

test('tracker test', async () => {
  const data = {
    source: 'darwin',
    resource: {
      fc: [
        {
          uid: '1740298130743624',
          region: 'cn-hangzhou',
          service: 'hello-world-service',
          function: 'custom-cpp-event-function',
        },
        {
          uid: '1740298130743624',
          region: 'cn-hangzhou',
          service: 'hello-world-service',
          function: 'next-custom-cpp-event-function',
        },
      ],
    },
    name: 'git-action-test-yntg',
    env: 'default',
    orgName: 'shl',
  };
  const res = await tracker(data);
  expect(get(res, 'success')).toBe(true);
});
