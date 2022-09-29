import git from '../src';
import _ from 'lodash';

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const access_token: string = process.env.GITHUB_ACCESS_TOKEN || '';

test('list repo', async () => {
  const prioverd = git('github', {
    access_token,
  });
  const rows = await prioverd.listRepos();

  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.has(row, 'id')).toBeTruthy();
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.url)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test('list branchs', async () => {
  const prioverd = git('github', {
    access_token,
  });
  const rows = await prioverd.listBranchs({
    owner: 'wss-git',
    repo: 'git-action-test',
  });

  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.commit_sha)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test('get branch commit', async () => {
  const prioverd = git('github', {
    access_token,
  });
  const config = await prioverd.getCommit({
    owner: 'wss-git',
    repo: 'git-action-test',
    ref: 'refs/heads/tes',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});

test('get tag commit', async () => {
  const prioverd = git('github', {
    access_token,
  });
  const config = await prioverd.getCommit({
    owner: 'wss-git',
    repo: 'git-action-test',
    ref: 'refs/tags/0.0.1',
  });

  expect(_.isString(config.sha)).toBeTruthy();
  expect(_.isString(config.message)).toBeTruthy();
  expect(_.has(config, 'source')).toBeTruthy();
});