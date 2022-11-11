import BaseEvent from './base';
import { generateSuccessResult, generateErrorResult, getPushInfo, getPrInfo } from '../utils';
import { ITrigger, IGiteeEvent, IPushInfo, IBranches } from '../type';
import { get, isEmpty, isPlainObject, isArray, each, includes } from 'lodash';
import micromatch from 'micromatch';

export default class Gitee extends BaseEvent {
  async verify(): Promise<any> {
    const _gitee: any = get(this.triggers, this.provider);
    if (isEmpty(_gitee)) {
      throw new Error(`No ${this.provider} configuration found`);
    }
    const gitee = _gitee as ITrigger;

    console.log('verify secret status...');
    const secret = get(gitee, 'secret', '');
    const verifySecretStatus = this.verifySecret(secret);
    if (verifySecretStatus) {
      console.log('verify secret success');
    } else {
      throw new Error('Verify secret error');
    }

    const eventType = get(this.headers, 'x-gitee-event') as IGiteeEvent;
    console.log(`get x-gitee-event value: ${eventType}`);

    if (isEmpty(eventType)) {
      throw new Error("No 'x-gitee-event' found on request");
    }
    // 检测 push, pr
    // push 检测 分支 和 tag
    if (includes(['Push Hook', 'Tag Push Hook'], eventType)) {
      const info = getPushInfo(get(this.body, 'ref', ''));
      console.log(`get push info: ${JSON.stringify(info)}`);
      return this.doPush(gitee, info);
    }
    // pr 检测 tag
    if (eventType === 'Merge Request Hook') {
      const branch = getPrInfo(this.body);
      console.log(`get pr branch: ${branch}`);
      return this.doPr(gitee, branch);
    }
  }
  private doPr(gitee: ITrigger, branch: string) {
    const conditionList = this.getCondition(gitee, 'pr', 'branch');
    console.log(`get condition list: ${JSON.stringify(conditionList)}`);
    if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
    const valid = micromatch([branch], conditionList as []);
    console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
    if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
    return generateSuccessResult({ ...gitee, provider: this.provider });
  }

  private doPush(gitee: ITrigger, info: IPushInfo) {
    if (get(info, 'branch')) {
      const conditionList = this.getCondition(gitee, 'push', 'branch');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
      const valid = micromatch([info.branch as string], conditionList as []);
      console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
      return generateSuccessResult({ ...gitee, provider: this.provider });
    }

    if (get(info, 'tag')) {
      const conditionList = this.getCondition(gitee, 'push', 'tag');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No tag rules configured');
      const valid = micromatch([info.tag as string], conditionList as []);
      console.log(`get tag micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('tag rules do not match');
      return generateSuccessResult({ ...gitee, provider: this.provider });
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
    gitee: ITrigger,
    event: 'push' | 'pr',
    type: 'branch' | 'tag',
  ): string[] | undefined {
    console.log(`get github condition: ${JSON.stringify(gitee)}`);
    const eventVal = get(gitee, event);
    if (isPlainObject(eventVal)) {
      if (type === 'branch') {
        const branches = get(eventVal, 'branches') as IBranches;
        if (isEmpty(branches)) return;
        console.log(`get gitee ${event} branches: ${JSON.stringify(branches)}`);
        return this.doCondition(branches);
      }
      if (type === 'tag') {
        const tags = get(eventVal, 'tags');
        if (isEmpty(tags)) return;
        console.log(`get gitee ${event} tags: ${JSON.stringify(tags)}`);
        return this.doCondition(tags);
      }
    }
  }

  private verifySecret(secret: string | undefined): boolean {
    const signature = get(this.headers, 'x-gitee-token', '');
    if (isEmpty(secret) && isEmpty(signature)) {
      return true;
    }
    return signature === secret;
  }
}
