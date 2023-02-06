import { getCicdEnv } from './utils';
import { nanoid } from 'nanoid';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import path from 'path';
import fs from 'fs';
const core = require('@serverless-devs/core');
import { get, isEmpty } from 'lodash';

export interface IConfig {
  type?: string;
  subject?: string;
  yamlPath: string;
  data: Record<string, any>;
}

/**
 * 发送tracker请求
 * @param resource
 */
export async function baseTracker(config: IConfig) {
  const { type, subject, data, yamlPath } = config;
  const reportInfo = await getReportInfo(yamlPath);
  if (isEmpty(reportInfo)) return;
  const { trackerUrl, ...rest } = reportInfo;
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
      ...data,
      ...rest,
      platform: getCicdEnv(),
    },
  };

  try {
    await fetch(trackerUrl, {
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

const getReportInfo = async (yamlPath: string) => {
  if (isEmpty(yamlPath)) return;
  const yamlData = await core.getYamlContent(yamlPath);
  // 获取应用名称
  const app = get(yamlData, 'name');
  if (isEmpty(app)) return;
  // 优先从环境变量中获取
  const { SERVERLESS_CD_TRACKER_URL, SERVERLESS_CD_USERID, SERVERLESS_CD_ORG } = process.env;
  if (SERVERLESS_CD_TRACKER_URL && SERVERLESS_CD_USERID) {
    return {
      trackerUrl: SERVERLESS_CD_TRACKER_URL,
      app,
      userId: SERVERLESS_CD_USERID,
      org: SERVERLESS_CD_ORG,
    };
  }
  // 从.devsrc中获取
  const devsrcPath = path.join(core.getRootHome(), '.devsrc');
  if (fs.existsSync(devsrcPath)) {
    const devsrc = await core.getYamlContent(devsrcPath);
    const trackerUrl = get(devsrc, 'trackerUrl');
    const userId = get(devsrc, 'userId');
    const org = get(devsrc, 'org');
    if (trackerUrl && userId) {
      return {
        trackerUrl,
        app,
        userId,
        org,
      };
    }
  }
};
