import {
  getEnvVariable,
  setEnvVariable,
  getServerlessCdVariable,
  setServerlessCdVariable,
} from '../src';

describe('环境变量', () => {
  test('getEnvVariable', () => {
    process.env['TEST_ENV'] = 'test';
    expect(getEnvVariable('TEST_ENV')).toBe('test');
  });
  test('setEnvVariable', () => {
    setEnvVariable('TEST_ENV2', 'test2');
    expect(process.env['TEST_ENV2']).toBe('test2');
  });
});

describe('SERVERLESS_CD环境变量', () => {
  test('getServerlessCdVariable', () => {
    (process as any)['SERVERLESS_CD'].TEST_ENV3 = 'test3';
    expect(getServerlessCdVariable('TEST_ENV3')).toBe('test3');
  });
  test('setServerlessCdVariable', () => {
    setServerlessCdVariable('TEST_ENV4', 'test4');
    expect((process as any)['SERVERLESS_CD'].TEST_ENV4).toBe('test4');
  });
});
