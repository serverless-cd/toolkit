require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import git from '../src';
import _ from 'lodash';

const config = {
  access_token: process.env.GITEE_ACCESS_TOKEN || '',
  accessKeyId: process.env.ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ACCESS_KEY_SECRET || '',
};

test.only('list branch', async () => {
  const prioverd = git('codeup', config);
  await prioverd.listBranchs({
    project_id: 2834398,
    organization_id: '60b045b52c5969c370c5a63e',
  });
});
