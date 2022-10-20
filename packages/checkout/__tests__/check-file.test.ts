import { checkFile } from '../src';

test('check file by gitee', async () => {
  const res = await checkFile({
    file: 'README.md',
    url: 'https://gitee.com/shihuali/checkout.git',
    ref: 'refs/heads/main',
  });
  expect(res).toBe(true);
});

test('check file by github', async () => {
  const res = await checkFile({
    url: 'https://github.com/xsahxl/git-action-test.git',
    ref: 'refs/heads/dev',
    file: 'serverless-pipeline.yaml',
  });
  expect(res).toBe(true);
});

test('check file by tag', async () => {
  const res = await checkFile({
    url: 'https://github.com/xsahxl/git-action-test.git',
    ref: 'refs/tags/0.0.1',
    file: 'serverless-pipeline.yaml',
  });
  expect(res).toBe(true);
});

test.only('check file:yml=>yaml', async () => {
  const res = await checkFile({
    url: 'https://github.com/xsahxl/git-action-test.git',
    ref: 'refs/tags/0.0.1',
    file: 'serverless-pipeline.yml',
  });
  expect(res).toBe(true);
});
