import _ from 'lodash';
import { IHookPayload } from '../../src/types';
import webHook from '../../src';
import { GITHUB_PAYLOAD } from '../mock/github';
import { SECRET } from '../mock/multiplex';

describe('signature 验证', () => {
  const initParame: IHookPayload = {
    ...GITHUB_PAYLOAD,
    secret: SECRET,
    on: '*',
  }

  test('x-hub-signature 匹配异常', async () => {
    const signatureKey = 'x-hub-signature';
    const parame = _.cloneDeep(initParame);
    _.set(parame, `headers[${signatureKey}]`, undefined);
 
    await expect(async () => {
      await webHook(parame);
    }).rejects.toThrow(`${signatureKey} does not match blob signature`);
  });

  test('secret 为空匹配正常', async () => {
    const signatureKey = 'x-hub-signature';
    const parame = _.cloneDeep(initParame);
    _.set(parame, `headers[${signatureKey}]`, undefined);
    _.set(parame, 'secret', undefined);
    _.set(parame, `headers[${signatureKey}]`, undefined);
 
    await webHook(parame);
    expect(true).toBeTruthy();
  });

  test('验证正常', async () => {
    const signatureKey = 'x-hub-signature';
    const parame = _.cloneDeep(initParame);
    _.set(parame, `headers[${signatureKey}]`, undefined);
    _.set(parame, 'secret', undefined);
    _.set(parame, `headers[${signatureKey}]`, undefined);
 
    await webHook(parame);
    expect(true).toBeTruthy();
  });
})
