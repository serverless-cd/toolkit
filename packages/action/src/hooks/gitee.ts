import gitHook from '../utils/git-webhook/gitee';
import { IRequest } from '../utils/git-webhook/interface';
import * as C from '../constants';
import api from '../api';

const giteeHook = gitHook({
  path: '/gitee',
  secret: C.C_HOOKS[C.C_PROVIDER.GITEE].WEBHOOK_SECRET,
});

export default async (req: IRequest) => {
  const data = await giteeHook.handler(req);
  switch (data.event) {
    case 'Push Hook':
      console.info(`【gitee】push, context:`, JSON.stringify(data, null, 2));
      return await api.gitee.push(data);
    case 'Tag Push Hook':
      console.info(`【gitee】release, context:`, JSON.stringify(data, null, 2));
      return await api.gitee.release(data);
    default:
      console.info(`【gitee】event`, data.event);
      return;
  }
};
