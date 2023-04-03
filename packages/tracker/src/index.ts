import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { get } from 'lodash';
const debug = require('@serverless-cd/debug')('serverless-cd:tracker');

const tracker = async (data: Record<string, any> = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3500);
  const { jwt = process.env.JWT, ...rest } = data;
  if (!jwt) {
    debug('jwt is empty');
    return;
  };
  const url = get(process.env, 'SERVERLESS_CD_TRACKER_URL', 'https://app.serverless-cd.cn/api/common/tracker')
  debug(`tracker url: ${url}`);
  debug(`tracker data: ${JSON.stringify(rest)}`);
  try {
    const res = await fetch(url, {
      headers: {
        'content-type': 'application/json',
        Cookie: `jwt=${jwt}`,
      },
      method: 'POST',
      signal: controller.signal,
      body: JSON.stringify(rest),
    });
    const result = await res.json();
    debug(`tracker result: ${JSON.stringify(result)}`);
    return result;

  } catch (error) {
    debug(`tracker error: ${error}`)
  } finally {
    clearTimeout(timeout);
  }
};

export default tracker;
