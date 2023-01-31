require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import git from '../src';
import _ from 'lodash';

const config = {
  access_token: process.env.CODEUP_ACCESS_TOKEN || '',
  accessKeyId: process.env.ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ACCESS_KEY_SECRET || '',
};

const project_id = 1843120;
const organization_id = '60b045b52c5969c370c5a63e';

test('list repo', async () => {
  const prioverd = git('codeup', config);
  const rows = await prioverd.listRepos({
    organization_id,
  });
  expect(_.isArray(rows)).toBeTruthy();
  for (const row of rows) {
    expect(_.has(row, 'id')).toBeTruthy();
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.url)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test('list branch', async () => {
  const prioverd = git('codeup', config);
  const rows = await prioverd.listBranches({
    project_id,
    organization_id,
  });
  expect(_.isArray(rows)).toBeTruthy();

  for (const row of rows) {
    expect(_.isString(row.name)).toBeTruthy();
    expect(_.isString(row.commit_sha)).toBeTruthy();
    expect(_.has(row, 'source')).toBeTruthy();
  }
});

test('get commit by id', async () => {
  const sha = '22433a481390b2b1885bebed70177a815800fbfa';
  const prioverd = git('codeup', config);
  const res = await prioverd.getCommitById({
    project_id,
    organization_id,
    sha,
  });
  expect(res.sha).toBe(sha);
  expect(_.isString(res.message)).toBeTruthy();
  expect(_.has(res, 'source')).toBeTruthy();
});

test('create a repo', async () => {
  const name="testCreateRepo";
  const prioverd = git('codeup', config);
  const res = await prioverd.createRepo({
    name,
    organization_id: organization_id
  });
  expect(res.id).toBeTruthy();
  expect(res.full_name).toBeTruthy();
  expect(res.url).toBeTruthy();
})

test('get a repo', async () => {
  const prioverd = git('codeup', config);
  const res = await prioverd.hasRepo({
    project_id: project_id,
    organization_id: organization_id
  });
  expect(res.id).toBeTruthy();
  expect(res.full_name).toBeTruthy();
  expect(res.url).toBeTruthy();
})

test('delete a repo', async () => {
  const prioverd = git('codeup', config);
  const project = await prioverd.hasRepo({ project_id: project_id, organization_id: organization_id });
  console.log(project);
  expect(_.has(project, 'id')).toBeTruthy();
  console.log('has repo successfully');

  await prioverd.deleteRepo({ project_id: project_id, organization_id: organization_id })
  await expect(async () => {
    await prioverd.hasRepo({ project_id: project_id, organization_id: organization_id });
  }).rejects.toThrow('code: 403, 访问的资源无权限!');
  console.log('expect delete successfully');
})

test.only('set a branch protection', async () => {
  const prioverd = git('codeup', config);
  await prioverd.setProtectionBranch({ project_id: project_id, organization_id: organization_id, branch:'master' });
  const project = await prioverd.getProtectionBranch({ project_id: project_id, organization_id: organization_id, branch:'master' });

  expect(_.get(project, 'protected')).toBeTruthy();
  console.log('set branch protection successfully');

})