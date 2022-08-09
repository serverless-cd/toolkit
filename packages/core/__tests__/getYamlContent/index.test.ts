import { getYamlContent } from '../../src';
import * as path from 'path';

test('yaml文件未找到', () => {
  const TEMPLATE_YAML = 'serverless-pipeline-no.yaml';
  process.env['TEMPLATE_PATH'] = path.join(__dirname, TEMPLATE_YAML);
  expect(() => getYamlContent()).toThrow(`${TEMPLATE_YAML} not found`);
});

test('yaml文件内容格式不正确', () => {
  const TEMPLATE_YAML = 'serverless-pipeline-error.yaml';
  process.env['TEMPLATE_PATH'] = path.join(__dirname, TEMPLATE_YAML);
  expect.assertions(1);
  try {
    getYamlContent();
  } catch (e) {
    expect((e as Error).toString()).toMatch(`Error: ${TEMPLATE_YAML} format is incorrect`);
  }
});

test('成功的读取yaml文件', () => {
  process.env['TEMPLATE_PATH'] = path.join(__dirname, 'serverless-pipeline.yaml');
  expect(getYamlContent()).toBeDefined();
});
