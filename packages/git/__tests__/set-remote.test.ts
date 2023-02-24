import { IProvider } from '../src/types';
import * as path from 'path';
import * as os from 'os';
const app = require('../src');
const setRemote = app.setRemote;
require('dotenv').config();

const execDir = path.join(os.tmpdir(), 'set-remote');

test.only('set remote test', async () => {
  const config = {
    token: process.env.TOKEN || '',
    provider: 'github' as IProvider,
    execDir,
    repoUrl: '',
  };
  await setRemote(config);
  expect('set-remote').toBe('set-remote');
});
