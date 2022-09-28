import git from '../src';
import _ from 'lodash';

const access_token: string = process.env.GITHUB_ACCESS_TOKEN || '';

test('list repo', async () => {
  const prioverd = git('github', {
    access_token,
  });
  const rows = await prioverd.listRepos();
  expect(_.isArray(rows)).toBeTruthy();
});

test.only('list branchs', async () => {
  const prioverd = git('github', {
    access_token,
  });
  const rows = await prioverd.listBranchs({
    owner: 'wss-git',
    repo: 'git-action-test',
  });
  // console.log(rows);
  expect(_.isArray(rows)).toBeTruthy();
});
