import gitHook from '../utils/git-webhook/gitlab';
import { IRequest } from '../utils/git-webhook/interface';
import * as C from '../constants';
import api from '../api';

const gitlabHook = gitHook({
  path: '/gitlab',
  secret: C.C_HOOKS[C.C_PROVIDER.GITHUB].WEBHOOK_SECRET,
});

export default async (req: IRequest) => {
  const data = await gitlabHook.handler(req);
  switch (data.event) {
    case 'Push Hook':
      console.info(`【gitlab】push, context:`, JSON.stringify(data, null, 2));
      return await api.gitlab.push(data);
    case 'Tag Push Hook':
      console.info(`【gitlab】release, context:`, JSON.stringify(data, null, 2));
      return await api.gitlab.release(data);
    default:
      console.info(`【gitlab】event`, data.event);
      return;
  }
};
