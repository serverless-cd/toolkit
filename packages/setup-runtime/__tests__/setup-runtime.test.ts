require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import path from 'path';
import Setup from '../src';
import { execSync } from 'child_process';
import { RUNTIME } from '../src/types';

const credentials = {
  accountId: process.env.ACCOUNT_ID as string,
  accessKeyId: process.env.ACCESS_KEY_ID as string,
  accessKeySecret: process.env.ACCESS_KEY_SECRET as string,
};

test('nodejs14', async () => {
  const setup = new Setup({
    runtimes: [RUNTIME.NODEJA14],
    credentials,
    region: 'cn-shenzhen',
    dest: path.join(__dirname, '/opt')
  });
  await setup.run();

  // execSync('npm -v', { env: process.env, encoding: 'utf-8', stdio: 'inherit' })
})
