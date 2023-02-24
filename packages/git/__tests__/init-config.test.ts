import { IProvider } from '../src/types';
import * as path from 'path';
import * as os from 'os';
const app = require('../src');
const setRemote = app.setRemote;
require('dotenv').config();

const execDir = path.join(os.tmpdir(), 'init-config');

test.only('init-config test', async () => {
  const config = {
    token: process.env.TOKEN || '',
    Endpoint: process.env.GITLAB_ENDPOINT || 'https://gitlab.com/',
    provider: 'github' as IProvider,
    execDir,
    userName: '',
    userEmail: '',
  };

  await setRemote(config);
  expect('init-config').toBe('init-config');
});
