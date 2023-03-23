import fetch from 'node-fetch';
import AbortController from 'abort-controller';

const tracker = async (data: Record<string, any> = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 3500);

  const { jwt, ...rest } = data;
  try {
    return await fetch('http://0.0.0.0:9000/api/common/tracker', {
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
