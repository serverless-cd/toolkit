import { checkFile } from '../src';

describe('gitee', () => {
  const token = 'xxx';
  const provider = 'gitee';
  const owner = 'shihuali';
  test('check file by gitee', async () => {
    const res = await checkFile({
      token,
      provider,
      owner,
      file: 'README.md',
      clone_url: 'https://gitee.com/shihuali/checkout.git',
      ref: 'refs/heads/main',
    });
    expect(res).toBe(true);
  });
  test('check file by gitee', async () => {
    const res = await checkFile({
      token,
      provider,
      owner,
      file: 'README.md',
      clone_url: 'https://gitee.com/shihuali/checkout.git',
      ref: 'refs/heads/test',
    });
    expect(res).toBe(false);
  });
});

describe('git', () => {
  const token = 'xxx';
  const provider = 'github';
  const owner = 'xsahxl';
  test.only('check file by private github', async () => {
    const res = await checkFile({
      token,
      provider,
      owner,
      clone_url: 'https://github.com/xsahxl/test-cd.git',
      ref: 'refs/heads/main',
      file: 'serverless-pipeline.yaml',
    });
    expect(res).toBe(false);
  });

  test('check file by github', async () => {
    const res = await checkFile({
      token,
      provider,
      owner,
      clone_url: 'https://github.com/xsahxl/git-action-test.git',
      ref: 'refs/heads/dev',
      file: 'serverless-pipeline.yaml',
    });
    expect(res).toBe(true);
  });

  test('check file by tag', async () => {
    const res = await checkFile({
      token,
      provider,
      owner,
      clone_url: 'https://github.com/xsahxl/git-action-test.git',
      ref: 'refs/tags/0.0.1',
      file: 'serverless-pipeline.yaml',
    });
    expect(res).toBe(true);
  });

  test('check file:yml=>yaml', async () => {
    const res = await checkFile({
      token,
      provider,
      owner,
      clone_url: 'https://github.com/xsahxl/git-action-test.git',
      ref: 'refs/tags/0.0.1',
      file: 'serverless-pipeline.yml',
    });
    expect(res).toBe(true);
  });
});
