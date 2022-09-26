import { checkout, IProvider } from '../src';
import { EngineLogger } from '../src/logger';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

const logger = new EngineLogger(path.join(__dirname, 'logs', 'checkout.log'));

describe('仓库未初始化', () => {
  const execDir = path.join(os.tmpdir(), 'checkout-init');
  beforeEach(() => {
    fs.removeSync(execDir);
  });
  test('checkout branch and commit', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      branch: 'test',
      commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test('checkout tag', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      tag: '0.0.2',
      commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
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
  const execDir = path.join(os.tmpdir(), 'checkout-no-init');
  test('checkout branch and commit', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      branch: 'test',
      commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
    };
    await checkout(config);
    expect('checkout').toBe('checkout');
  });

  test.only('checkout tag', async () => {
    const config = {
      token: 'a78ef09a876600e0448b166b4c8539e0',
      provider: 'gitee' as IProvider,
      logger,
      username: 'shihuali',
      url: 'https://gitee.com/shihuali/checkout.git',
      execDir,
      tag: '0.0.2',
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
