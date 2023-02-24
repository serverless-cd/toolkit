import { IProvider } from '../src/types';
import * as path from 'path';
import * as os from 'os';
const app = require('../src');
const addCommit = app.addCommit;
require('dotenv').config();

const execDir = path.join(os.tmpdir(), 'add-commit');

test.only('test', async () => {
  const config = {
    token: process.env.TOKEN || '',
    Endpoint: process.env.GITLAB_ENDPOINT || '',
    provider: 'github' as IProvider,
    execDir,
    branch: 'master',
  };

  await addCommit(config);
  expect('add-commit').toBe('add-commit');
});
