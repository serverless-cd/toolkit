import step from '../src';
import * as path from 'path';
import * as core from '@serverless-cd/core';
import { get } from 'lodash';

test('执行step全部成功，获取某一步的output', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'serverless-pipeline.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  expect(get(res, 'xhello.output')).toEqual({ code: 0, stdout: '"hello"\n' });
});

test('某一步执行失败, 后续步骤不在执行', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'error.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // 步骤2 状态是 failure
  expect(get(res, 'xerror.status')).toBe('failure');
  // 步骤3 未执行
  expect(get(res, 'xworld')).toBeUndefined();
});

test.only('某一步执行失败，但该步骤添加了continue-on-error: true，后续步骤正常执行', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'continue-on-error.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // 步骤2 状态是 error-with-continue
  expect(get(res, 'xerror.status')).toBe('error-with-continue');
  // 步骤3 依然会执行
  expect(get(res, 'xworld.status')).toBe('success');
});

test('执行step失败且加了if字段', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'if.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // TODO: context 目前是空对象。
  expect(res).toEqual({});
});
