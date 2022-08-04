import gitHook from '../utils/git-webhook/github';
import { IRequest } from '../utils/git-webhook/interface';
import * as C from '../constants';
import api from '../api';

const githubHook = gitHook({
  path: '/github',
  secret: C.C_HOOKS[C.C_PROVIDER.GITHUB].WEBHOOK_SECRET,
});

export default async (req: IRequest) => {
  const data = await githubHook.handler(req);
  switch (data.event) {
    case 'Push Hook':
      console.info(`【github】push, context:`, JSON.stringify(data, null, 2));
      return await api.github.push(data);
    case 'Tag Push Hook':
      console.info(`【github】release, context:`, JSON.stringify(data, null, 2));
      return await api.github.release(data);
    default:
      console.info(`【github】event`, data.event);
      return;
  }
};
