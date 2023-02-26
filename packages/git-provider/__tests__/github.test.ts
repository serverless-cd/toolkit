import git from '../src';
import _ from 'lodash';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const access_token: string = process.env.GITHUB_ACCESS_TOKEN || '';

const OWNER = 'hazel0928';
const REPO = 'testgithu23';

test(
  'list org and list repo',
  async () => {
    const provider = git('github', {
      access_token,
    });
    const orgs = await provider.listOrgs();
    for (const { org } of orgs) {
      const rows = await provider.listOrgRepos(org);
      for (const row of rows) {
        expect(_.has(row, 'id')).toBeTruthy();
        expect(_.isString(row.name)).toBeTruthy();
        expect(_.has(row, 'source')).toBeTruthy();
        expect(_.isString(row.url) && _.endsWith(row.url, '.git')).toBeTruthy();
      }
    }
  },
  3 * 60 * 1000,
);

test(
  'list repo',
  async () => {
    const provider = git('github', {
      access_token,
    });
    const rows = await provider.listRepos();

    expect(_.isArray(rows)).toBeTruthy();
    for (const row of rows) {
      expect(_.has(row, 'id')).toBeTruthy();
      expect(_.isString(row.name)).toBeTruthy();
      expect(_.has(row, 'source')).toBeTruthy();
      expect(_.isString(row.url) && _.endsWith(row.url, '.git')).toBeTruthy();
    }
  },
  3 * 60 * 1000,
);

test('create or update file', async () => {
  const provider = git('github', {
    access_token,
  });
  await expect(
    (async () => {
      await provider.putFile({
        owner: OWNER,
        repo: REPO,
        path: 'test-push-file2.txt',
        message: 'test 123',
        content: '=====',
      });
    })(),
  ).resolves.not.toThrow();
});

test.only('list branches', async () => {
  const provider = git('github', {
    access_token,
  });
  const rows = await provider.listBranches({ owner: OWNER, repo: REPO });

  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.commit_sha)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test.only('get user', async () => {
  const provider = git('github', {
    access_token,
  });
  const result = await provider.user();
  console.log('result: ', result);
  expect(_.isString(result.login)).toBeTruthy();
});

test('get commit by id', async () => {
  const provider = git('github', {
    access_token,
  });
  const config = await provider.getCommitById({
    owner: OWNER,
    repo: REPO,
    sha: '68b3becf8f6c47d00711b45e923b891e14bb131e',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('get branch commit', async () => {
  const provider = git('github', {
    access_token,
  });
  const config = await provider.getRefCommit({
    owner: OWNER,
    repo: REPO,
    ref: 'refs/heads/tes',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('get tag commit', async () => {
  const provider = git('github', {
    access_token,
  });
  const config = await provider.getRefCommit({
    owner: OWNER,
    repo: REPO,
    ref: 'refs/tags/0.0.1',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('webhook', async () => {
  const url = 'http://test.abc';
  const provider = git('github', { access_token });

  console.log('expect list');
  const rows = await provider.listWebhook({ owner: OWNER, repo: REPO });
  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.isString(row.url)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
    expect(_.has(row, 'id')).toBeTruthy();
  }
  console.log('expect list successfully');

  console.log('expect create');
  const createConfig = await provider.createWebhook({
    owner: OWNER,
    repo: REPO,
    url,
  });
  expect(_.has(createConfig, 'id')).toBeTruthy();
  expect(_.has(createConfig, 'source')).toBeTruthy();
  expect(_.get(createConfig, 'source.events')).toEqual(['push', 'release']);
  console.log('expect create successfully');

  const hook_id: number = _.get(createConfig, 'id');
  await provider.updateWebhook({
    owner: OWNER,
    repo: REPO,
    url,
    hook_id,
  });
  const updateConfig = await provider.getWebhook({ owner: OWNER, repo: REPO, hook_id });
  console.log(updateConfig);
  expect(updateConfig.id).toBe(hook_id);
  expect(_.has(updateConfig, 'source')).toBeTruthy();
  console.log('expect update successfully');

  console.log('expect delete');
  await provider.deleteWebhook({ owner: OWNER, repo: REPO, hook_id });
  await expect(async () => {
    await provider.getWebhook({ owner: OWNER, repo: REPO, hook_id });
  }).rejects.toThrow('Not Found');
  console.log('expect delete successfully');
});

test('create fork', async () => {
  const provider = git('github', {
    access_token,
  });
  const rows = await provider.createFork({ owner: OWNER, repo: REPO });
  expect(_.has(rows, 'id')).toBeTruthy();
  expect(_.has(rows, 'full_name')).toBeTruthy();
  expect(_.has(rows, 'url')).toBeTruthy();
});

test('create a repo', async () => {
  const provider = git('github', {
    access_token,
  });
  const rows = await provider.createRepo({ name: 'testCreateRepo5', private: true, description: 'testetest' });
  expect(_.has(rows, 'id')).toBeTruthy();
  expect(_.has(rows, 'full_name')).toBeTruthy();
  expect(_.has(rows, 'url')).toBeTruthy();
});

test('delete a repo', async () => {
  const provider = git('github', {
    access_token,
  });
  const repo = await provider.hasRepo({ owner: OWNER, repo: REPO });
  console.log(repo);
  expect(_.has(repo, 'id')).toBeTruthy();
  console.log('has repo successfully');

  await provider.deleteRepo({ owner: OWNER, repo: REPO });
  const repoExist = await provider.hasRepo({ owner: OWNER, repo: REPO });
  expect(_.get(repoExist, 'isExist')).toBeFalsy();
  console.log('expect delete successfully');
});

test('check if has a repo', async () => {
  const provider = git('github', {
    access_token,
  });
  const repo = await provider.hasRepo({ owner: OWNER, repo: REPO });
  console.log(repo);
});

test('update a branch protection', async () => {
  const provider = git('github', {
    access_token,
  });
  const branch = 'master';
  await provider.setProtectionBranch({
    owner: OWNER,
    repo: REPO,
    branch: branch,
  });
  const getProtectBranch = await provider.getProtectionBranch({
    owner: OWNER,
    repo: REPO,
    branch: branch,
  });
  expect(_.has(getProtectBranch, 'protected')).toBeTruthy();
  console.log('expect set branch protection successfully');
});

test('check a repo whether is empty', async () => {
  const provider = git('github', {
    access_token,
  });
  const repo = await provider.checkRepoEmpty({ owner: OWNER, repo: REPO });
  console.log(repo);
});

