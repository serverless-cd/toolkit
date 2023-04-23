import Core from '@alicloud/pop-core';
import { get } from 'lodash';

interface IConfig {
  accessKeyId: string;
  accessKeySecret: string;
  securityToken?: string;
}

export default async (config: IConfig) => {
  const params = {
    ...config,
    endpoint: 'https://sts.cn-hangzhou.aliyuncs.com',
    apiVersion: '2015-04-01',
  };
  const client = new Core(params);

  const result = await client.request(
    'GetCallerIdentity',
    {},
    {
      method: 'POST',
    },
  );
  return get(result, 'AccountId');
};
