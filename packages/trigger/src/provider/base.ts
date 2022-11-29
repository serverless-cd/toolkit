import _ from 'lodash';
import { IPayload, ITriggers, IProvider, IPrefix, IPrefixFromWebhook } from '../type';
import { generateSuccessResult, generateErrorResult } from '../utils';
import { ITrigger, IPushInfo, IBranches } from '../type';
import { get, isEmpty, isPlainObject, isArray, each } from 'lodash';
import micromatch from 'micromatch';

// webhook
export default abstract class BaseEvent {
  readonly triggers: ITriggers;
  readonly headers: { [key: string]: string };
  readonly body: string;
  readonly requestPayload: any;
  readonly provider: IProvider;

  constructor(triggers: ITriggers, requestPayload: IPayload, provider: IProvider) {
    const headers = _.get(requestPayload, 'headers');
    if (_.isEmpty(headers)) {
      throw new TypeError("must provide a 'headers' option");
    }
    const body = _.get(requestPayload, 'body');
    if (!_.isPlainObject(body)) {
      throw new Error('Body is not a json');
    }

    this.provider = provider;
    this.triggers = triggers;
    this.headers = headers;
    this.requestPayload = requestPayload;
    this.body = body;
  }

  abstract verify(): Promise<any>;

  doPr(trigger: ITrigger, branchInfo: IPrefixFromWebhook) {
    console.log(`get trigger value: ${JSON.stringify(trigger)}`);
    const eventVal = get(trigger, 'pull_request');
    if (isPlainObject(eventVal)) {
      const branches = get(eventVal, 'branches') as IBranches;
      if (isEmpty(branches)) return;
      console.log(`get pull_request branches: ${JSON.stringify(branches)}`);
      // 权重规则：exclude > precise > prefix > include
      const exclude = get(branches, 'exclude', []) as IPrefix[];
      if (exclude.length > 0) {
        for (const item of exclude) {
          // webhook是否命中 精确排除 规则，值存在说明命中，返回错误
          const validTarget = micromatch([branchInfo.target], [item.target]);
          const validSource = micromatch(
            [branchInfo.source],
            item.source ? [item.source] : ['*', '**'],
          );
          const bol = validTarget.length > 0 && validSource.length > 0;
          if (bol) {
            console.log('webhook match pr exclude rules');
            return generateErrorResult('webhook match pr exclude rules');
          }
        }
      }
      const precise = get(branches, 'precise', []) as IPrefix[];
      if (precise.length > 0) {
        for (const item of precise) {
          // webhook是否命中 精确匹配 规则，值存在说明命中，返回成功
          const validTarget = micromatch([branchInfo.target], [item.target]);
          const validSource = micromatch(
            [branchInfo.source],
            item.source ? [item.source] : ['*', '**'],
          );
          const bol = validTarget.length > 0 && validSource.length > 0;
          if (bol) {
            console.log('webhook match pr precise rules');
            return generateSuccessResult({ ...trigger, provider: this.provider });
          }
        }
      }
      const prefix = get(branches, 'prefix', []) as IPrefix[];
      if (prefix.length > 0) {
        for (const item of prefix) {
          // webhook是否命中 前缀匹配 规则，值存在说明命中，返回成功
          const validTarget = micromatch(
            [branchInfo.target],
            [`${item.target}*`, `${item.target}/**`],
          );
          const validSource = micromatch(
            [branchInfo.source],
            item.source ? [`${item.source}*`, `${item.source}/**`] : ['*', '**'],
          );
          const bol = validTarget.length > 0 && validSource.length > 0;
          if (bol) {
            console.log('webhook match pr prefix rules');
            return generateSuccessResult({ ...trigger, provider: this.provider });
          }
        }
      }
      const include = get(branches, 'include', []) as IPrefix[];
      if (include.length > 0) {
        for (const item of include) {
          // webhook是否命中 前缀匹配 规则，值存在说明命中，返回成功
          const validTarget = micromatch([branchInfo.target], [item.target]);
          const validSource = micromatch(
            [branchInfo.source],
            item.source ? [item.source] : ['*', '**'],
          );
          const bol = validTarget.length > 0 && validSource.length > 0;
          if (bol) {
            console.log('webhook match pr include rules');
            return generateSuccessResult({ ...trigger, provider: this.provider });
          }
        }
      }
    }
    return generateErrorResult('webhook not match pr rules');
  }
  doPush(trigger: ITrigger, info: IPushInfo) {
    if (get(info, 'branch')) {
      const conditionList = this.getPushCondition(trigger, 'branch');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
      const valid = micromatch([info.branch as string], conditionList as []);
      console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
      return generateSuccessResult({ ...trigger, provider: this.provider });
    }

    if (get(info, 'tag')) {
      const conditionList = this.getPushCondition(trigger, 'tag');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No tag rules configured');
      const valid = micromatch([info.tag as string], conditionList as []);
      console.log(`get tag micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('tag rules do not match');
      return generateSuccessResult({ ...trigger, provider: this.provider });
    }
    throw new Error('No branch or tag found in push event');
  }
  doPushCondition(value: IBranches | undefined) {
    const conditionList: string[] = [];
    // 权重规则：exclude > precise > prefix > include
    const include = get(value, 'include');
    if (isArray(include)) {
      each(include, (item: string) => {
        conditionList.push(item);
      });
    }
    const prefix = get(value, 'prefix');
    if (isArray(prefix)) {
      if (isEmpty(prefix)) {
        conditionList.push(`*`, '**');
      } else {
        each(prefix, (item: string) => {
          conditionList.push(`${item}*`, `${item}/**`);
        });
      }
    }
    const precise = get(value, 'precise');
    if (isArray(precise)) {
      each(precise, (item: string) => {
        conditionList.push(item);
      });
    }
    const exclude = get(value, 'exclude');
    if (isArray(exclude)) {
      each(exclude, (item: string) => {
        conditionList.push(`!${item}`);
      });
    }
    return conditionList;
  }
  getPushCondition(trigger: ITrigger, type: 'branch' | 'tag'): string[] | undefined {
    console.log(`get trigger value: ${JSON.stringify(trigger)}`);
    const eventVal = get(trigger, 'push');
    if (isPlainObject(eventVal)) {
      if (type === 'branch') {
        const branches = get(eventVal, 'branches') as IBranches;
        if (isEmpty(branches)) return;
        console.log(`get push branches: ${JSON.stringify(branches)}`);
        return this.doPushCondition(branches);
      }
      if (type === 'tag') {
        const tags = get(eventVal, 'tags');
        if (isEmpty(tags)) return;
        console.log(`get push tags: ${JSON.stringify(tags)}`);
        return this.doPushCondition(tags);
      }
    }
  }
}
