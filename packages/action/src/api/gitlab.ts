import * as C from '../constants';
import get from 'lodash.get';
import event from './event';

const push = async (context: { [key: string]: any }) => {
  const before = get(context, 'payload.before');
  const after = get(context, 'payload.after');
  if (
    before === '0000000000000000000000000000000000000000' ||
    after === '0000000000000000000000000000000000000000'
  ) {
    return {
      message: 'New branch',
    }; // 首次push，发生在初始化、或 创建release 版本
  }

  const path_with_namespace = get(context, 'payload.project.path_with_namespace', '');
  const uri = get(context, 'payload.project.homepage', '').replace(`/${path_with_namespace}`, '');
  const params: { [key: string]: any } = {
    provider: C.C_PROVIDER.GITLAB,
    id: get(context, 'payload.project.id'),
    path_with_namespace: get(context, 'payload.project.path_with_namespace'),
    uri,
    branch: get(context, 'payload.ref', '').replace('refs/heads/', ''),
  };
  for (let key in params) {
    if (!params[key]) {
      throw new Error(`${C.C_PROVIDER.GITLAB} repository [${key}] is empty`);
    }
  }
  return await event('push', params);
};

const release = async (context: { [key: string]: any }) => {
  const path_with_namespace = get(context, 'payload.project.path_with_namespace', '');
  const uri = get(context, 'payload.project.homepage', '').replace(`/${path_with_namespace}`, '');
  const params: { [key: string]: any } = {
    provider: C.C_PROVIDER.GITLAB,
    id: get(context, 'payload.project.id'),
    path_with_namespace: get(context, 'payload.project.path_with_namespace'),
    uri,
  };

  for (let key in params) {
    if (!params[key]) {
      throw new Error(`${C.C_PROVIDER.GITLAB} repository [${key}] is empty`);
    }
  }

  return await event('release', params);
};

export default { push, release };
