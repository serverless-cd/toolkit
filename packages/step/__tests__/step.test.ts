import step from '../src';
import * as path from 'path';
import * as core from '@serverless-cd/core';

test('执行step成功', async () => {
  process.env['TEMPLATE_PATH'] = path.join(__dirname, 'serverless-pipeline.yaml');
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // TODO: context 目前是空对象。
  expect(res).toEqual({});
});

test('执行step失败', async () => {
  process.env['TEMPLATE_PATH'] = path.join(__dirname, 'error.yaml');
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // TODO: context 目前是空对象。
  expect(res).toEqual({});
});

test('执行step失败且加了if字段', async () => {
  process.env['TEMPLATE_PATH'] = path.join(__dirname, 'if.yaml');
  core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));
  const res = await step();
  // TODO: context 目前是空对象。
  expect(res).toEqual({});
});
