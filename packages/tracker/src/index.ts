import fetch from 'node-fetch';
import AbortController from 'abort-controller';
const debug = require('@serverless-cd/debug')('tracker');

const tracker = async (data: Record<string, any> = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3500);
  const { jwt = process.env.JWT, ...rest } = data;
  if(!jwt) {
    debug('jwt is empty');
    return;
  };
  debug('tracker data',  JSON.stringify(rest));
  try {
    return await fetch('https://app.serverless-cd.cn/api/common/tracker', {
      headers: {
        'content-type': 'application/json',
        Cookie: `jwt=${jwt}`,
      },
      method: 'POST',
      signal: controller.signal,
      body: JSON.stringify(rest),
    });
  } catch (error) {
    console.log('request error');
  } finally {
    clearTimeout(timeout);
  }
};

export default tracker;
