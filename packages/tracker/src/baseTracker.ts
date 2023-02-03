import { getCicdEnv } from './utils';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';

export interface IConfig {
  type?: string;
  subject?: string;
  data: Record<string, any>;
}

/**
 * 发送tracker请求
 * @param resource
 */
export async function baseTracker(config: IConfig) {
  const { type, subject, data } = config;
  const { resource, ...restData } = data;
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3500);

  const payload = {
    specversion: '1.0',
    id: nanoid(),
    source: 'serverless-devs:osac',
    type, // 事件类型，描述事件源相关的事件类型
    subject,
    data: {
      platform: getCicdEnv(),
      resource,
      ...restData,
    },
  };

  const telemetryUrl = '';

  try {
    await fetch(telemetryUrl, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      signal: controller.signal,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log('request error');
  } finally {
    clearTimeout(timeout);
  }
}
