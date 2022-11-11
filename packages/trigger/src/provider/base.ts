import _ from 'lodash';
import { IPayload, ITriggers, IProvider } from '../type';
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

  doPr(trigger: ITrigger, branch: string) {
    const conditionList = this.getCondition(trigger, 'pr', 'branch');
    console.log(`get condition list: ${JSON.stringify(conditionList)}`);
    if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
    const valid = micromatch([branch], conditionList as []);
    console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
    if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
    return generateSuccessResult({ ...trigger, provider: this.provider });
  }

  doPush(trigger: ITrigger, info: IPushInfo) {
    if (get(info, 'branch')) {
      const conditionList = this.getCondition(trigger, 'push', 'branch');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No branch rules configured');
      const valid = micromatch([info.branch as string], conditionList as []);
      console.log(`get branch micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('Branch rules do not match');
      return generateSuccessResult({ ...trigger, provider: this.provider });
    }

    if (get(info, 'tag')) {
      const conditionList = this.getCondition(trigger, 'push', 'tag');
      console.log(`get condition list: ${JSON.stringify(conditionList)}`);
      if (isEmpty(conditionList)) return generateErrorResult('No tag rules configured');
      const valid = micromatch([info.tag as string], conditionList as []);
      console.log(`get tag micromatch: ${JSON.stringify(valid)}`);
      if (isEmpty(valid)) return generateErrorResult('tag rules do not match');
      return generateSuccessResult({ ...trigger, provider: this.provider });
    }
    throw new Error('No branch or tag found in push event');
  }
  doCondition(value: IBranches | undefined) {
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
  getCondition(
    trigger: ITrigger,
    event: 'push' | 'pr',
    type: 'branch' | 'tag',
  ): string[] | undefined {
    console.log(`get trigger value: ${JSON.stringify(trigger)}`);
    const eventVal = get(trigger, event);
    if (isPlainObject(eventVal)) {
      if (type === 'branch') {
        const branches = get(eventVal, 'branches') as IBranches;
        if (isEmpty(branches)) return;
        console.log(`get ${event} branches: ${JSON.stringify(branches)}`);
        return this.doCondition(branches);
      }
      if (type === 'tag') {
        const tags = get(eventVal, 'tags');
        if (isEmpty(tags)) return;
        console.log(`get ${event} tags: ${JSON.stringify(tags)}`);
        return this.doCondition(tags);
      }
    }
  }
}
