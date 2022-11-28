import { IGitConfig } from '../src/types/input';
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import git from '../src';
import _ from 'lodash';

const config: IGitConfig = {
  access_token: process.env.GITLAB_ACCESS_TOKEN || '',
  endpoint: process.env.GITLAB_ENDPOINT || '',
};

const owner = 'gitlab-instance-c434bdc1';
const repo = 'test-wss';
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

test.only('get commit by id', async () => {
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
