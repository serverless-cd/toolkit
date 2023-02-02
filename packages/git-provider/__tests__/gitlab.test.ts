import { IGitConfig } from '../src/types/input';
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import git from '../src';
import _ from 'lodash';

const config: IGitConfig = {
  access_token: process.env.GITLAB_ACCESS_TOKEN || '',
  endpoint: process.env.GITLAB_ENDPOINT || '',
};

const owner = 'hazel928';
const repo = 'testCreateRepo';
const id = 'gitlab-instance-c434bdc1%2Ftest-wss';

test('list branch', async () => {
  const prioverd = git('gitlab', config);
  
  try {
    await prioverd.listBranches({
      // id: 3,
      // id,
      owner,
      repo,
    });
  } catch (err) {
    expect(false).toBeTruthy();
  }
});

test('get commit by id', async () => {
  const sha = 'dce7a1c9ea604aa70372809fab5db921ff05b9f8';
  const prioverd = git('gitlab', config);
  const res = await prioverd.getCommitById({
    owner,
    repo,
    sha,
  });

  expect(res.sha).toBe(sha);
  expect(_.isString(res.message)).toBeTruthy();
  expect(_.has(res, 'source')).toBeTruthy();
});

test('create fork', async () => {
  const prioverd = git('gitlab', config);
  const res = await prioverd.createFork({
    owner,
    repo,
  });
  expect(_.has(res, 'id')).toBeTruthy();
  expect(_.has(res, 'full_name')).toBeTruthy();
  expect(_.has(res, 'url')).toBeTruthy();
});

test('create a repo', async () => {
  const prioverd = git('gitlab', config);
  const res = await prioverd.createRepo({ name: 'testCreateRepo', visibility: 'private', description: 'testtest'});
  console.log(res)
  expect(_.has(res, 'id')).toBeTruthy();
  expect(_.has(res, 'full_name')).toBeTruthy();
  expect(_.has(res, 'url')).toBeTruthy();
});

test('delete a repo', async () => {
  const prioverd = git('gitlab', config);
  const project = await prioverd.hasRepo({ owner: owner, repo: repo });
  console.log(project);
  expect(_.has(project, 'id')).toBeTruthy();
  console.log('has repo successfully');

  await prioverd.deleteRepo({ owner: owner, repo: repo })
  await expect(async () => {
    await prioverd.hasRepo({ owner: owner, repo: repo });
  }).rejects.toThrow('Request failed with status code 404');
  console.log('expect delete successfully');
});

test('set branch protection', async () => {
  const prioverd = git('gitlab', config);
  const branch = 'test'
  await prioverd.setProtectionBranch({
    owner: owner, 
    repo: repo, 
    branch: branch,
  });
  const res =  await prioverd.getProtectionBranch({
    owner: owner, 
    repo: repo, 
    branch: branch,
  });
  expect(_.get(res, 'protected')).toBeTruthy();
  console.log('expect set branch protection successfully')
});

test('check whether a repo exists', async () => {
  const prioverd = git('gitlab', config);
  const res = await prioverd.hasRepo({
    owner: owner, 
    repo: repo, 
  });
  console.log(res)
});

test.only('check whether a repo is empty', async () => {
  const prioverd = git('gitlab', config);
  const res = await prioverd.checkRepoEmpty({
    owner: owner, 
    repo: repo, 
  });
  console.log(res);
  expect(_.has(res,'isEmpty')).toBeTruthy();
});
