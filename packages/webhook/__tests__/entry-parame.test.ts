import _ from 'lodash';
import { IHookPayload } from '../src/types';
import webHook from '../src';
import { GITHUB_PAYLOAD } from './mock/github';
import { SECRET } from './mock/multiplex';

const initParame: IHookPayload = {
  ...GITHUB_PAYLOAD,
  secret: SECRET,
  on: '*',
}

describe('入参验证', () => {

  test('入参不是对象', async () => {
    await expect(async () => {
      const parame = [] as unknown as any;
      await webHook(parame);
    }).rejects.toThrow("The parameter format should be object");
  });

  test('入参中 body 异常', async () => {
    const parame = _.cloneDeep(initParame);
    _.set(parame, 'body', undefined);
    await expect(async () => {
      await webHook(parame);
    }).rejects.toThrow("must provide a 'body' option");

    _.set(parame, 'body', '{body: 234}');
    await expect(async () => {
      await webHook(parame);
    }).rejects.toThrow("Body is not a json string");
  });

  test('入参中 on 为空', async () => {
    const parame = _.cloneDeep(initParame);
    _.set(parame, 'on', undefined);
    await expect(async () => {
      await webHook(parame);
    }).rejects.toThrow("must provide a 'on' option");
  });

  test('入参中 headers 为空', async () => {
    const parame = _.cloneDeep(initParame);
    _.set(parame, 'headers', undefined);
    await expect(async () => {
      await webHook(parame);
    }).rejects.toThrow("must provide a 'headers' option");
  });

  test('不支持的产品', async () => {
    const parame = _.cloneDeep(initParame);
    _.set(parame, 'headers.user-agent', 'test-git');
    await expect(async () => {
      await webHook(parame);
    }).rejects.toThrow("Unrecognized product");
  });
});
