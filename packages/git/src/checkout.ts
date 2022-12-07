import { Logger, parseRef } from '@serverless-cd/core';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { replace, get, isEmpty } from 'lodash';
import { IConfig } from './types';

class Checkout {
  private logger: Logger;
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
    const { clone_url } = this.config;
    this.existing = fs.existsSync(path.join(this.config.execDir, '.git'));
    this.logger.info(`Existing: ${this.existing}`);
    if (this.existing) {
      this.logger.info(`Updating ${clone_url} into ${this.config.execDir}`);
      await this.git.remote(['set-url', 'origin', this.getCloneUrl() as string]);
      await this.checkout();
    } else {
      await this.clone();
    }
  }
  private getCloneUrl() {
    const { provider, owner, clone_url, token } = this.config;
    const newUrl = replace(clone_url, /http(s)?:\/\//, '');
    if (provider === 'gitee') {
      return `https://${owner}:${token}@${newUrl}`;
    }
    if (provider === 'github') {
      return `https://${token}@${newUrl}`;
    }
    if (provider === 'gitlab') {
      const protocol = clone_url.startsWith('https') ? 'https' : 'http';
      return `${protocol}${owner}:${token}@${newUrl}`;
    }
    if (provider === 'codeup') {
      return `https://${owner}:${token}@${newUrl}`;
    }
  }
  private async clone() {
    const { clone_url } = this.config;
    this.logger.info(`Cloning ${clone_url} into ${this.config.execDir}`);
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
    if (isEmpty(ref)) {
      return { isNothing: true };
    }
    const { type, value } = parseRef(ref);
    if (type === 'tag') {
      return { tag: value, commit };
    }
    if (type === 'branch' && commit) {
      return { branch: value, commit };
    }
    if (commit) {
      return { commit };
    }
    return { isNothing: true };
  }
}

export default Checkout;
