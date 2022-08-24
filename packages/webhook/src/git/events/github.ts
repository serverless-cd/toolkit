import _ from 'lodash';
import { IOnEvents, IGitEventObjct, IObject } from '../../types';
import { patternMatch } from './utils';

const PUSH = 'push';
const PULL_REQUEST = 'pull_request';

export default function (event: string, body: IObject, eventsConfig: IOnEvents): string | void {
  if (_.isString(eventsConfig)) {
    return handlerString(event, eventsConfig);
  }

  if (_.isArray(eventsConfig)) {
    return handlerArray(event, eventsConfig);
  }

  return handlerObject(event, body, eventsConfig);
}

// 事件为 araay: 
function handlerArray (event: string, eventsConfig: string[]): string | void {
  for (const item of eventsConfig) {
    const adopt = handlerString(event, item);
    if (adopt) {
      return adopt;
    }
  }
}

// 事件为 string: 
function handlerString (event: string, eventsConfig: string): string | void {
  if (eventsConfig === '*') {
    return event;
  }

  if (eventsConfig === event) {
    return event;
  }
}

// 事件为 object:
function handlerObject(event: string, body: IObject, eventsConfig: IGitEventObjct): string | void {
  const eventConfig = _.get(eventsConfig, event);
  if (_.isEmpty(eventConfig)) {
    return;
  }

  // on.<event_name>.types (webhook body 的 action)
  const filterTypes = _.keys(eventConfig);
  for (const filterType of filterTypes) {
    if (filterType === 'types') {
      if (_.includes(eventConfig.types, body.action)) {
        return event;
      }
    }
  }

  if (event === PUSH) {
    return push(body, eventConfig);
  }

  if (event === PULL_REQUEST) {
    return pullRequest(body, eventConfig);
  }

  console.log(`${event} does not support this kind of writing`);
}

// on.push.<paths|paths-ignore|branches|tags|branches-ignore|tags-ignore> 
function push(body: IObject, pushConfig: { [key: string]: string[] }): string | void {
  const {
    added = [],
    removed = [],
    modified = [],
  } = body.head_commit || {};
  const updateFiles: string[] = _.concat(added, removed, modified);
  const ref = _.get(body, 'ref', '');
  const branch = _.replace(ref, 'refs/heads/', '');
  const tag = _.replace(ref, 'refs/tags/', '');

  if (_.has(pushConfig, 'paths')) {
    const flag = patternMatch(updateFiles, pushConfig.paths)
    if (flag) {
      return PUSH;
    }
  }

  if (_.has(pushConfig, 'paths-ignore')) {
    const flag = !patternMatch(updateFiles, pushConfig['paths-ignore']);
    if (flag) {
      return PUSH;
    }
  }

  if (_.has(pushConfig, 'branches')) {
    const flag = patternMatch([branch], pushConfig.branches);
    if (flag) {
      return PUSH;
    }
  }

  if (_.has(pushConfig, 'branches-ignore')) {
    const flag = !patternMatch([branch], pushConfig['branches-ignore']);
    if (flag) {
      return PUSH;
    }
  }

  if (_.has(pushConfig, 'tags')) {
    const flag = patternMatch([tag], pushConfig.tags);
    if (flag) {
      return PUSH;
    }
  }

  if (_.has(pushConfig, 'tags-ignore')) {
    const flag = !patternMatch([tag], pushConfig['tags-ignore']);
    if (flag) {
      return PUSH;
    }
  }
}

// on.pull_request.<branches|branches-ignore> 
function pullRequest(body: IObject, pullRequestConfig: { [key: string]: string[] }): string | void {
  const branch = _.get(body, 'pull_request.head.ref', '');
  if (_.has(pullRequestConfig, 'branches')) {
    const flag = patternMatch([branch], pullRequestConfig.branches);
    if (flag) {
      return PULL_REQUEST;
    }
  }

  if (_.has(pullRequestConfig, 'branches-ignore')) {
    const flag = !patternMatch([branch], pullRequestConfig['branches-ignore']);
    if (flag) {
      return PULL_REQUEST;
    }
  }
}
