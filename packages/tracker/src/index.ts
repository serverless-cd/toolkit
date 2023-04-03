import { get } from 'lodash';
import axios from 'axios';
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
    const res = await axios.post(url, rest, {
      headers: {
        'content-type': 'application/json',
        Cookie: `jwt=${jwt}`,
      },
      timeout: 30000,
    });
    debug(`tracker result: ${JSON.stringify(res.data)}`);
    return res.data;
  } catch (error) {
    debug(`tracker error: ${error}`)
  }
};

export default tracker;
