import { baseTracker } from './baseTracker';
import { each, get } from 'lodash';

interface IConfig {
  appId?: string;
  type: string;
  yamlPath: string;
  data: Record<string, any>;
}

/**
 * aliyun Fc 日志
 */
export async function aliyunFcTracker(config: IConfig) {
  const { type, data, appId, yamlPath } = config;
  const aliyunFc = [] as Record<string, any>[];
  each(data, (item) => {
    aliyunFc.push({
      region: get(item, 'output.region'),
      service: get(item, 'output.service.name'),
      function: get(item, 'output.function.name'),
      url: get(item, 'output.url'),
    });
  });
  await baseTracker({
    type,
    yamlPath,
    data: {
      appId,
      resource: {
        'aliyun.fc': JSON.stringify(aliyunFc),
      },
    },
  });
}
