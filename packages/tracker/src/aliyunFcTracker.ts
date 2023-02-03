import { baseTracker } from './baseTracker';
import { each } from 'lodash';

interface IConfig {
  appId?: string;
  type: string;
  data: Record<string, any>;
}

/**
 * aliyun Fc 日志
 */
export async function aliyunFcTracker(config: IConfig) {
  const { type, data, appId } = config;
  const aliyunFc = [] as Record<string, any>[];
  each(data, (item) => {
    aliyunFc.push(item.output);
  });
  await baseTracker({
    type,
    data: {
      appId,
      resource: {
        'aliyun.fc': JSON.stringify(aliyunFc),
      },
    },
  });
}
