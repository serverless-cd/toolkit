import { IProvider } from '../src';
import { EngineLogger } from '@serverless-cd/core';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
const app = require('../src');
const checkout = app.run;

const logger = new EngineLogger(path.join(__dirname, 'logs', 'checkout.log'));
const execDir = path.join(os.tmpdir(), 'checkout-init');

describe('仓库未初始化', () => {
  beforeEach(() => {
    fs.removeSync(execDir);
  });
  test('checkout ref branch case', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      ref: 'refs/heads/test',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout ref tag case', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      ref: 'refs/tags/0.0.2',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout commit', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout with no tag, commit, branch', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });
});

describe('仓库已经初始化', () => {
  test('checkout ref branch case', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      ref: 'refs/heads/test',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout ref tag case', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      ref: 'refs/tags/0.0.4',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout commit', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      commit: '1190412a9252dd618e45e7f87ccabd161c4fd357',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout with no tag, commit, branch', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });
});
