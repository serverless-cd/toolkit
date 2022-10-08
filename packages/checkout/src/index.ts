import { EngineLogger } from '@serverless-cd/core';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { replace, get, startsWith } from 'lodash';

export type IProvider = 'github' | 'gitee' | 'gitlab' | 'codeup';

export interface IConfig {
  token: string;
  provider: IProvider;
  logger: EngineLogger;
  username: string;
  url: string;
  execDir: string;
  ref?: string;
  commit?: string;
}
export async function run(config: IConfig) {
  await new Checkout(config).run();
}

class Checkout {
  private logger: EngineLogger;
  private git: SimpleGit;
  private existing: boolean = false;
  constructor(private config: IConfig) {
    this.logger = config.logger;
    const execDir = config.execDir || os.tmpdir();
    this.config.execDir = path.isAbsolute(execDir) ? execDir : path.join(process.cwd(), execDir);
    this.logger.info(`execDir: ${this.config.execDir}`);
    fs.ensureDirSync(this.config.execDir);
    this.git = simpleGit(this.config.execDir);
  }
  async run() {
    await this.init();
  }
  async init() {
    const { url } = this.config;
    this.existing = fs.existsSync(path.join(this.config.execDir, '.git'));
    this.logger.info(`Existing: ${this.existing}`);
    if (this.existing) {
      this.logger.info(`Updating ${url} into ${this.config.execDir}`);
      await this.git.remote(['set-url', 'origin', this.getCloneUrl() as string]);
      await this.checkout();
    } else {
      await this.clone();
    }
  }
  private getCloneUrl() {
    const { provider, username, url, token } = this.config;
    const newUrl = replace(url, /http(s)?:\/\//, '');
    if (provider === 'gitee') {
      return `https://${username}:${token}@${newUrl}`;
    }
    if (provider === 'github') {
      return `https://${token}@${newUrl}`;
    }
    if (provider === 'gitlab') {
      const protocol = url.startsWith('https') ? 'https' : 'http';
      return `${protocol}${username}:${token}@${newUrl}`;
    }
    if (provider === 'codeup') {
      return `https://${username}:${token}@${newUrl}`;
    }
  }
  private async clone() {
    const { url } = this.config;
    this.logger.info(`Cloning ${url} into ${this.config.execDir}`);
    const cloneUrl = this.getCloneUrl() as string;
    const inputs = this.checkInputs();
    this.logger.info(`clone params: ${JSON.stringify(inputs)}`);
    if (inputs.isNothing) {
      await this.git.clone(cloneUrl, this.config.execDir, ['--depth', '1']);
    } else {
      await this.git.clone(cloneUrl, this.config.execDir, ['--no-checkout']);
      await this.checkout();
    }
    this.logger.info('Cloned successfully');
  }
  private async checkout() {
    const { tag, branch, commit } = this.checkInputs() as any;
    if (tag) {
      this.logger.info(`Checking out tag ${tag}`);
      await this.git.checkout(tag, ['--force']);
      commit && (await this.git.reset(['--hard', commit]));
    } else if (branch && commit) {
      this.logger.info(`Checking out branch ${branch} and commit ${commit}`);
      await this.git.checkout(['--force', '-B', branch, commit]);
    } else if (commit) {
      this.logger.info(`Checking out commit ${commit}`);
      await this.git.checkout(['--force', commit]);
    }
    const res = await this.git.log(['--no-color', '-n', '1', "--format='HEAD is now at %h %s'"]);
    this.logger.info(get(res, 'latest.hash'));
  }
  private checkInputs() {
    const { commit, ref = '' } = this.config;
    const branch = startsWith(ref, 'refs/heads/') ? replace(ref, 'refs/heads/', '') : undefined;
    const tag = startsWith(ref, 'refs/tags/') ? replace(ref, 'refs/tags/', '') : undefined;

    if (tag) {
      return { tag, commit };
    }
    if (branch && commit) {
      return { branch, commit };
    }
    if (commit) {
      return { commit };
    }
    return { isNothing: true };
  }
}
