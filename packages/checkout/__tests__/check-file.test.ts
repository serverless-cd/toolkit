import { checkFile } from '../src';

test('check file', async () => {
  const res = await checkFile({
    file: 'README.md',
    url: 'https://gitee.com/shihuali/checkout.git',
    ref: 'refs/heads/main',
  });
  expect(res).toBe(true);
});

test('check file 2', async () => {
  const res = await checkFile({
    url: 'https://github.com/xsahxl/git-action-test.git',
    ref: 'refs/heads/dev',
    file: 'serverless-pipeline.yaml',
  });
  expect(res).toBe(true);
});
