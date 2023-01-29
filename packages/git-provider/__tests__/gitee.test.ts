import git from '../src';
import _ from 'lodash';
import Gitee from '../src/providers/gitee';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const access_token: string = process.env.GITEE_ACCESS_TOKEN || '';
const OWNER = 'wss-gitee';
const REPO = 'git-action-test';

test('list repo', async () => {
  const prioverd = git('gitee', { access_token });
  const rows = await prioverd.listRepos();

  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.has(row, 'id')).toBeTruthy();
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.url) && _.endsWith(row.url, '.git')).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test('list branchs', async () => {
  const prioverd = git('gitee', { access_token });
  const rows = await prioverd.listBranches({ owner: OWNER, repo: REPO });

  expect(_.isArray(rows)).toBeTruthy();

  for (const row of rows) {
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.commit_sha)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test('get commit by id', async () => {
  const prioverd = git('gitee', { access_token });
  const sha = '1816c284614dede42d0e0c7eaace00166adc79f0';
  const config = await prioverd.getCommitById({
    owner: OWNER,
    repo: REPO,
    sha,
  });

  expect(config.sha).toBe(sha);
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('get branch commit', async () => {
  const prioverd = git('gitee', { access_token });
  const config = await prioverd.getRefCommit({
    owner: OWNER, repo: REPO,
    // ref: 'tes',
    ref: 'refs/heads/tes',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('get tag commit', async () => {
  const prioverd = git('gitee', { access_token });
  const config = await prioverd.getRefCommit({
    owner: OWNER, repo: REPO,
    ref: 'refs/tags/0.0.1',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('webhook', async () => {
  const url = 'http://test.abc';
  const prioverd = git('gitee', { access_token }) as Gitee;

  console.log('expect list');
  const rows = await prioverd.listWebhook({ owner: OWNER, repo: REPO  });
  console.log(rows);
  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.isString(row.url)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
    expect(_.has(row, 'id')).toBeTruthy();
  }
  console.log('expect list successfully');

  console.log('expect create');
  const createConfig = await prioverd.createWebhook({
    owner: OWNER, repo: REPO, url,
  });
  expect(_.has(createConfig, 'id')).toBeTruthy();
  expect(_.has(createConfig, 'source')).toBeTruthy();
  expect(_.get(createConfig, 'source.push_events')).toBeTruthy();
  expect(_.get(createConfig, 'source.tag_push_events')).toBeTruthy();
  expect(_.get(createConfig, 'source.tag_push_events')).toBeTruthy();
  console.log('expect create successfully');

  const hook_id: number = _.get(createConfig, 'id');
  await prioverd.updateWebhook({
    owner: OWNER, repo: REPO,
    url,
    hook_id,
    events: ['release'],
  });
  const updateConfig = await prioverd.getWebhook({ owner: OWNER, repo: REPO, hook_id });
  expect(updateConfig.id).toBe(hook_id);
  expect(_.has(updateConfig, 'source')).toBeTruthy();
  expect(_.get(updateConfig, 'source.push_events')).toBeFalsy();
  expect(_.get(updateConfig, 'source.tag_push_events')).toBeTruthy();
  console.log('expect update successfully');

  console.log('expect delete');
  await prioverd.deleteWebhook({ owner: OWNER, repo: REPO, hook_id, });
  await expect(async () => {
    await prioverd.getWebhook({ owner: OWNER, repo: REPO, hook_id });
  }).rejects.toThrow('Request failed with status code 404');
  console.log('expect delete successfully');
});

test('create fork', async () => {
  const prioverd = git('gitee', { access_token });
  const createFork = await prioverd.createFork({ owner: OWNER, repo: REPO });
  console.log(createFork)
  expect(_.has(createFork, 'id')).toBeTruthy();
  expect(_.has(createFork, 'full_name')).toBeTruthy();
  expect(_.has(createFork, 'url')).toBeTruthy();
  console.log('expect create successfully');  
});

test.only('create a  repo', async () => {
  const prioverd = git('gitee', { access_token });
  const createFork = await prioverd.createRepo({ name: 'testCreateRepo1' });
  console.log(createFork)
  expect(_.has(createFork, 'id')).toBeTruthy();
  expect(_.has(createFork, 'full_name')).toBeTruthy();
  expect(_.has(createFork, 'url')).toBeTruthy();
  console.log('expect create successfully');  
});

test('delete a repo', async () => {
  const prioverd = git('gitee', { access_token });
  const repo = await prioverd.hasRepo({ owner: OWNER, repo: REPO });
  console.log(repo);
  expect(_.has(repo, 'id')).toBeTruthy();
  console.log('has repo successfully');

  await prioverd.deleteRepo({ owner: OWNER, repo: REPO })
  await expect(async () => {
    await prioverd.hasRepo({ owner: OWNER, repo: REPO });
  }).rejects.toThrow('Request failed with status code 404');
  console.log('expect delete successfully');
});
