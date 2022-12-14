import { parseRef } from '@serverless-cd/core';
import { startsWith, replace, get, isEmpty, includes, find } from 'lodash';
import { ITrigger, IPrTypes, IPrTypesVal, IGiteeAction, IProvider, IUserAgent } from './type';
// 最终返回失败结果
export const generateErrorResult = (message: any) => ({
  success: false,
  message,
});

// 最终返回成功结果
export const generateSuccessResult = (inputs: any, body: any) => {
  const key = get(inputs, 'key') as string;
  const provider = get(inputs, 'provider') as IProvider;
  const data: any = {
    url: get(body, 'repository.clone_url'),
    provider: get(inputs, 'provider'),
    repo_id: get(body, 'repository.id'),
    pusher: {},
    [key]: {},
    commit: {},
  };
  if (key === 'push') {
    data[key]['branch'] = get(inputs, 'branch');
    data[key]['tag'] = get(inputs, 'tag');
    data[key]['ref'] = get(body, 'ref');
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
  data.pusher['avatar_url'] = get(body, 'sender.avatar_url');
  data.pusher['name'] = get(body, 'pusher.name') || get(body, 'sender.login');
  data.pusher['email'] = get(body, 'pusher.email') || get(body, 'sender.email');
  if (provider === IUserAgent.GITLAB) {
    if (key === 'push') {
      data.url = get(body, 'repository.git_http_url');
      data.repo_id = `${get(body, 'repository.homepage')}:${get(body, 'project_id')}`;
      data.commit['id'] = get(body, 'commit.sha');
      data.commit['message'] = get(body, 'commit.message');
      // 兼容gitlab 15.7
      if (isEmpty(data.commit['id'])) {
        const commitObj = find(get(body, 'commits'), (obj) => obj.id === get(body, 'after'));
        if (commitObj) {
          data.commit['id'] = commitObj.id;
          data.commit['message'] = commitObj.message;
        }
      }
    }
    if (key === 'pull_request') {
      data.url = get(body, 'project.http_url');
      data.repo_id = `${get(body, 'repository.homepage')}:${get(body, 'project.id')}`;
      data.commit['id'] =
        get(body, 'object_attributes.merge_commit_sha') ||
        get(body, 'object_attributes.last_commit.id');
      data.commit['message'] = get(body, 'object_attributes.title');
    }
    data.pusher['avatar_url'] = get(body, 'user.avatar_url') || get(body, 'user_avatar');
    data.pusher['name'] = get(body, 'user.name') || get(body, 'user_name');
    data.pusher['email'] = get(body, 'user.email') || get(body, 'user_email');
  }
  if (provider === IUserAgent.CODEUP) {
    if (key === 'push') {
      const commitObj = find(get(body, 'commits'), (obj) => obj.id === get(body, 'after'));
      if (commitObj) {
        data.commit['id'] = commitObj.id;
        data.commit['message'] = commitObj.message;
      }
      data.repo_id = get(body, 'project_id');
    }
    if (key === 'pull_request') {
      data.repo_id = get(body, 'object_attributes.source_project_id');
      data.commit['id'] = get(body, 'object_attributes.last_commit.id');
      data.commit['message'] =
        get(body, 'object_attributes.last_commit.message') || get(body, 'object_attributes.title');
      data.pusher['name'] = get(body, 'object_attributes.last_commit.author.name');
      data.pusher['email'] = get(body, 'object_attributes.last_commit.author.email');
    }
    data.url = get(body, 'repository.git_http_url') || get(body, 'project.http_url');
    data.pusher['name'] = data.pusher['name'] || get(body, 'user_name') || get(body, 'user.name');
    data.pusher['email'] = data.pusher['email'] || get(body, 'user_email');
    data.pusher['avatar_url'] = get(body, 'user.avatar_url');
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

export const getPushInfoWithGitlab = (eventType: string, body: any) => {
  const ref = get(body, 'ref', '');
  if (eventType === 'Job Hook') {
    const tag = get(body, 'tag', false);
    return { [tag ? 'tag' : 'branch']: ref };
  }
  const { type, value } = parseRef(ref);
  return { [type]: value };
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

export const getPrInfoWithCodeupOrGitlab = (body: any) => {
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

export const checkTypeWithCodeupOrGitlab = (codeup: ITrigger, body: any) => {
  const action = get(body, 'object_attributes.action', '') as IPrTypesVal;
  console.log(`get pull_request type: ${action}`);
  const types = get(codeup, 'pull_request.types', []) as IPrTypesVal[];
  let valid = false;
  let message = '';
  const newAction = get(IGiteeAction, action, action);
  if (includes([IPrTypes.OPENED, IPrTypes.REOPENED], newAction)) {
    valid = includes(types, newAction);
    message = `pull_request type is ${action}, but only ${types} is allowed`;
  }
  if (newAction === IPrTypes.CLOSED) {
    valid = includes(types, IPrTypes.CLOSED);
    message = `pull_request type is ${newAction}, but only ${types} is allowed`;
  }
  if (newAction === IPrTypes.MERGED) {
    valid = includes(types, IPrTypes.MERGED);
    message = `pull_request type is ${newAction}, but only ${types} is allowed`;
  }
  if (valid) {
    console.log('check type success');
    return { success: true, message, type: newAction };
  }
  console.log('check type error');
  return { success: false, message, type: newAction };
};
