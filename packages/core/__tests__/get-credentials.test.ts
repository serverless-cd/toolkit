import { getCredentials } from '../src';
import path from 'path';
require('dotenv').config({ path: path.join(__dirname, '.env') });

test('getCredentials accountId 存在', async () => {
  const res = await getCredentials(
    {
      accessKeyId: '123',
      accessKeySecret: '456',
      securityToken: '789',
      accountId: '123456',
    },
    {}
  );
  console.log(res);
  expect(res).toEqual({
    accessKeyId: '123',
    accessKeySecret: '456',
    securityToken: '789',
    accountId: '123456'
  });
});

test.only('getCredentials accountId 不存在', async () => {
  const res = await getCredentials(
    {
      accessKeyId: process.env.ACCESS_KEY_ID,
      accessKeySecret: process.env.ACCESS_KEY_SECRET,
    },
    {}
  );
  console.log(res);
  expect(res.accountId).toEqual(process.env.ACCOUNT_ID);
});

