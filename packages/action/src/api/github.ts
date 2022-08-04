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
  const params: { [key: string]: any } = {
    hookId: `${C.C_PROVIDER.GITHUB}-${get(context, 'payload.repository.owner.id')}`,
    provider: C.C_PROVIDER.GITHUB,
    id: get(context, 'payload.repository.id'),
    path_with_namespace: get(context, 'payload.repository.full_name'),
    uri: 'https://github.com',
    branch: get(context, 'payload.ref', '').replace('refs/heads/', ''),
  };

  for (let key in params) {
    if (!params[key]) {
      throw new Error(`Github repository [${key}] is empty`);
    }
  }

  return await event('push', params);
};

const release = async (context: { [key: string]: any }) => {
  const action = get(context, 'payload.action');
  if (action !== 'created') return;

  const params: { [key: string]: any } = {
    hookId: `${C.C_PROVIDER.GITHUB}-${get(context, 'payload.repository.owner.id')}`,
    provider: C.C_PROVIDER.GITHUB,
    id: get(context, 'payload.repository.id'),
    path_with_namespace: get(context, 'payload.repository.full_name'),
    uri: 'https://github.com',
  };

  for (let key in params) {
    if (!params[key]) {
      throw new Error(`Github repository [${key}] is empty`);
    }
  }
  return await event('release', params);
};

export default { push, release };
