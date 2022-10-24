import { IGitConfig } from '../src/types/input';
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import git from '../src';
import _ from 'lodash';

const config: IGitConfig = {
  access_token: process.env.GITLIB_ACCESS_TOKEN || '',
  endpoint: process.env.GITLIB_ENDPOINT || '',
};

test.only('list branch', async () => {
  const prioverd = git('gitlib', config);
  
  try {
    await prioverd.listBranchs({
      // id: 3,
      // id: 'gitlab-instance-c434bdc1%2Ftest-wss',
      owner: 'gitlab-instance-c434bdc1',
      repo: 'test-wss',
    });
  } catch (err) {
    expect(false).toBeTruthy();
  }
});
