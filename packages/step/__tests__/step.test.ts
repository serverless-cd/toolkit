import step from '../src';
import * as path from 'path';
import * as core from '@serverless-cd/core';
import { get } from 'lodash';

test.only('执行step全部成功，获取step id为demo的output', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'serverless-pipeline.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  expect(get(res, 'demo.output')).toEqual({ code: 0, stdout: '"hello"\n' });
});

test('执行step失败', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'error.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // TODO: context 目前是空对象。
  expect(res).toEqual({});
});

test('执行step失败且加了if字段', async () => {
  core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'if.yaml'));
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // TODO: context 目前是空对象。
  expect(res).toEqual({});
});
