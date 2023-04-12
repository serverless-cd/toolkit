import get from 'lodash.get';
import httpx from 'httpx';
const debug = require('@serverless-cd/debug')('serverless-cd:tracker');


const tracker = async (data: Record<string, any> = {}) => {
  const { jwt = process.env.JWT, ...rest } = data;
  if (!jwt) {
    debug('jwt is empty');
    return;
  };
  const url = get(process.env, 'SERVERLESS_CD_TRACKER_URL', 'https://app.serverless-cd.cn/api/common/tracker')
  debug(`tracker url: ${url}`);
  debug(`tracker data: ${JSON.stringify(rest)}`);
  try {
    const response = await httpx.request(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Cookie: `jwt=${jwt}`,
      },
      timeout: 30000,
      data: JSON.stringify(rest),
    });
    const result = await httpx.read(response, 'utf8');
    debug(`tracker result: ${result}`);
  } catch (error) {
    debug(`tracker error: ${error}`)
  }
};

export default tracker;
