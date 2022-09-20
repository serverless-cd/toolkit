import _ from 'lodash';
import Github from './github';

const getTriggerEvent = (payload: unknown): 'Github' => {
  const ua: string = _.get(payload, 'headers[user-agent]', '');
  if (_.startsWith(ua, 'GitHub-Hookshot')) {
    return 'Github';
  }

  throw new Error('Unrecognized trigger type');
};

export default {
  Github,
  getTriggerEvent,
}
