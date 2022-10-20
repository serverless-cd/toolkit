import { checkFile } from '../src';

test('check file', async () => {
  const res = await checkFile({
    file: 'README.md',
    url: 'https://gitee.com/shihuali/checkout.git',
    ref: 'refs/heads/main',
  });
  expect(res).toBe(true);
});
