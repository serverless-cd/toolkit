import { getCicdEnv } from './util';
import { nanoid } from 'nanoid';
import fetch, { AbortError } from 'node-fetch';
import AbortController from 'abort-controller';

/**
 * 发送tracker请求
 * @param resource
 */
export async function tracker({
  type,
  subject,
  data,
}: {
  type?: string;
  subject?: string;
  data: Record<string, any>;
}) {
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
    if (error instanceof AbortError) {
      console.log('request was aborted');
    }
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * aliyun Fc 日志
 */
export function aliyunFcTracker(appId: string, inputs: any) {
  tracker({
    data: {
      appId,
      resource: {
        'aliyun.fc.function':
          "[{region:'cn-hangzhou', service: 'web-framework', function: 'start-egg'}]",
      },
    },
  });
}

/**
 * 从DB获取AliyunFc的资源信息，用于前端数据展示
 */
export function aliyunFcResource(appId: string) {}
