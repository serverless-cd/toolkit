import { startsWith, replace, get, isEmpty, includes } from 'lodash';
import { ITrigger, IPrTypes, IPrTypesVal, IGiteeAction } from './type';
// 最终返回失败结果
export const generateErrorResult = (message: any) => ({
  success: false,
  message,
});

// 最终返回成功结果
export const generateSuccessResult = (inputs: any, body: any) => {
  const key = get(inputs, 'key') as string;
  const data: any = {
    url: get(body, 'repository.clone_url'),
    provider: get(inputs, 'provider'),
    pusher: {},
    [key]: {},
    commit: {},
  };
  if (get(body, 'pusher')) {
    data.pusher['name'] = get(body, 'pusher.name');
    data.pusher['email'] = get(body, 'pusher.email');
  }
  if (key === 'push') {
    data[key]['branch'] = get(inputs, 'branch');
    data[key]['tag'] = get(inputs, 'tag');
    data.commit['id'] = get(body, 'head_commit.id');
    data.commit['message'] = get(body, 'head_commit.message');
  }
  if (key === 'pull_request') {
    data[key]['type'] = get(inputs, 'type');
    data[key]['target_branch'] = get(inputs, 'target_branch');
    data[key]['source_branch'] = get(inputs, 'source_branch');
    data.commit['id'] = get(body, 'pull_request.merge_commit_sha');
    data.commit['message'] = get(body, 'pull_request.title');
  }
  return {
    success: true,
    data,
  };
};

export const getPushInfo = (ref: string) => {
  if (startsWith(ref, 'refs/heads/')) {
    return { branch: replace(ref, 'refs/heads/', '') };
  }
  if (startsWith(ref, 'refs/tags/')) {
    return { tag: replace(ref, 'refs/tags/', '') };
  }
  throw new Error(`Unsupported ref: ${ref}, push event only support branch or tag`);
};

export const getPushInfoWithGitlab = (body: any) => {
  const ref = get(body, 'ref', '');
  const tag = get(body, 'tag', false);
  return { [tag ? 'tag' : 'branch']: ref };
};

export const getPrInfo = (body: any) => {
  const target = get(body, 'pull_request.base.ref');
  if (isEmpty(target)) {
    throw new Error('body.pull_request.base.ref is empty');
  }
  const source = get(body, 'pull_request.head.ref');
  if (isEmpty(source)) {
    throw new Error('body.pull_request.head.ref is empty');
  }
  return { target, source };
};

export const getPrInfoWithCodeup = (body: any) => {
  const target = get(body, 'object_attributes.target_branch');
  if (isEmpty(target)) {
    throw new Error('body.object_attributes.target_branch is empty');
  }
  const source = get(body, 'object_attributes.source_branch');
  if (isEmpty(source)) {
    throw new Error('body.object_attributes.source_branch is empty');
  }
  return { target, source };
};

export const checkTypeWithCodeup = (codeup: ITrigger, body: any) => {
  const action = get(body, 'object_attributes.action', '') as IPrTypesVal;
  console.log(`get pull_request type: ${action}`);
  const types = get(codeup, 'pull_request.types', []) as IPrTypesVal[];
  let valid = false;
  let message = '';
  const newAction = get(IGiteeAction, action, action);
  if (includes([IPrTypes.OPENED, IPrTypes.REOPENED], newAction)) {
    valid = includes(types, newAction);
    message = `pr type is ${action}, but only ${types} is allowed`;
  }
  if (newAction === IPrTypes.CLOSED) {
    valid = includes(types, IPrTypes.CLOSED);
    message = `pr type is ${newAction}, but only ${types} is allowed`;
  }
  if (newAction === IPrTypes.MERGED) {
    valid = includes(types, IPrTypes.MERGED);
    message = `pr type is ${newAction}, but only ${types} is allowed`;
  }
  if (valid) {
    console.log('check type success');
    return { success: true, message, type: newAction };
  }
  console.log('check type error');
  return { success: false, message, type: newAction };
};
