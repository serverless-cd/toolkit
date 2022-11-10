import crypto from 'crypto';
import BaseEvent from './base';
import { generateSuccessResult, generateErrorResult, getPushInfo, getPrInfo } from '../utils';
import { IGithubTrigger, IEventType, IPushInfo, IBranches } from '../type';
import { has, get, isEmpty, isPlainObject, isArray, each } from 'lodash';
import micromatch from 'micromatch';

export default class Github extends BaseEvent {
  async verify(): Promise<any> {
    if (!has(this.triggers, this.provider)) {
      throw new Error('The triggers does not exist github');
    }

    const github: IGithubTrigger = get(this.triggers, this.provider);

    console.log('verify secret status...');
    const secret = get(github, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (verifySecretStatus) {
      console.log('verify secret success');
    } else {
      throw new Error('Verify secret error');
    }

    const eventType = get(this.headers, 'x-github-event') as IEventType;
    console.log(`get x-github-event value: ${eventType}`);

    if (isEmpty(eventType)) {
      throw new Error("No 'x-github-event' found on request");
    }
    // 检测 push, pr
    // push 检测 分支 和 tag
    if (eventType === 'push') {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(github, info);
    }
    // pr 检测 tag
    if (eventType === 'pull_request') {
      const branch = getPrInfo(this.body);
      console.log(`get pr branch: ${branch}`);
      return this.doPr(github, branch);
    }
  }
  private doPr(github: IGithubTrigger, branch: string) {
    const conditionList = this.getCondition(github, 'pr', 'branch');
    console.log(`get condition list: ${JSON.stringify(conditionList)}`);
    if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
    const valid = micromatch([branch], conditionList as []);
    console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
    if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
    return generateSuccessResult({ ...github, provider: this.provider });
  }

  private doPush(github: IGithubTrigger, info: IPushInfo) {
    if (get(info, 'branch')) {
      const conditionList = this.getCondition(github, 'push', 'branch');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
      const valid = micromatch([info.branch as string], conditionList as []);
      console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
      return generateSuccessResult({ ...github, provider: this.provider });
    }

    if (get(info, 'tag')) {
      const conditionList = this.getCondition(github, 'push', 'tag');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No tag rules configured');
      const valid = micromatch([info.tag as string], conditionList as []);
      console.log(`get tag micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('tag rules do not match');
      return generateSuccessResult({ ...github, provider: this.provider });
    }
    throw new Error('No branch or tag found in push event');
  }
  private doCondition(value: IBranches | undefined) {
    const conditionList: string[] = [];
    //权重规则： exclude, include, prefix, precise
    const exclude = get(value, 'exclude');
    if (isArray(exclude)) {
      each(exclude, (item: string) => {
        conditionList.push(`!${item}`);
      });
    }
    const include = get(value, 'include');
    if (isArray(include)) {
      each(include, (item: string) => {
        conditionList.push(item);
      });
    }
    const prefix = get(value, 'prefix');
    if (isArray(prefix)) {
      each(prefix, (item: string) => {
        conditionList.push(`${item}*`, `${item}/**`);
      });
    }
    const precise = get(value, 'precise');
    if (isArray(precise)) {
      each(precise, (item: string) => {
        conditionList.push(item);
      });
    }
    return conditionList;
  }
  private getCondition(
    github: IGithubTrigger,
    event: 'push' | 'pr',
    type: 'branch' | 'tag',
  ): string[] | undefined {
    console.log(`get github condition: ${JSON.stringify(github)}`);
    const eventVal = get(github, event);
    if (isPlainObject(eventVal)) {
      if (type === 'branch') {
        const branches = get(eventVal, 'branches') as IBranches;
        if (isEmpty(branches)) return;
        console.log(`get github ${event} branches: ${JSON.stringify(branches)}`);
        return this.doCondition(branches);
      }
      if (type === 'tag') {
        const tags = get(eventVal, 'tags');
        if (isEmpty(tags)) return;
        console.log(`get github ${event} tags: ${JSON.stringify(tags)}`);
        return this.doCondition(tags);
      }
    }
  }

  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-hub-signature', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    const sig = Buffer.from(signature);
    const signed = Buffer.from(
      `sha1=${crypto
        .createHmac('sha1', secret as string)
        .update(JSON.stringify(this.body))
        .digest('hex')}`,
    );

    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  }
}
