import Client from '../src';

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ACCESS_KEY_SECRET || '',
};

const client = new Client(config);
client.getFc2({ region: 'cn-hangzhou' });
