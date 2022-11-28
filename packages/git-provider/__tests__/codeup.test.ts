require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import git from '../src';
import _ from 'lodash';

const config = {
  access_token: process.env.CODEUP_ACCESS_TOKEN || '',
  accessKeyId: process.env.ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ACCESS_KEY_SECRET || '',
};

test('list branch', async () => {
  const prioverd = git('codeup', config);
  await prioverd.listBranches({
    project_id: 2834398,
    organization_id: '60b045b52c5969c370c5a63e',
  });
});

test.only('get commit by id', async () => {
  const sha = '4af51eea4906c3b8895261f35ba27cca38ad89da';
  const prioverd = git('codeup', config);
  const res = await prioverd.getCommitById({
    project_id: 2834398,
    organization_id: '60b045b52c5969c370c5a63e',
    sha,
  });
  expect(res.sha).toBe(sha);
  expect(_.isString(res.message)).toBeTruthy();
  expect(_.has(res, 'source')).toBeTruthy();
});
