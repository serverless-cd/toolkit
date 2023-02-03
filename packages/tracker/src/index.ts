import { filter, get, includes, isEmpty } from 'lodash';
import { aliyunFcTracker } from './aliyunFcTracker';

export { baseTracker } from './baseTracker';
export { aliyunFcTracker } from './aliyunFcTracker';
export { aliyunFcResource } from './aliyunFcResource';

const isFcComponent = (name: string) => includes(['fc', 'devsapp/fc'], name);

const tracker = async (data: Record<string, any> = {}) => {
  const { command, services } = data;
  const fcService = filter(services, (item) => isFcComponent(item.component));
  if (command === 'deploy' && !isEmpty(fcService)) {
    await aliyunFcTracker({
      type: command,
      data: fcService,
    });
  }
};

export default tracker;
