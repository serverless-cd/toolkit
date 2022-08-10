import step from '../src';
import * as path from 'path';
import * as core from '@serverless-cd/core';

test('step', async () => {
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  expect(await step()).toBeUndefined();
});
