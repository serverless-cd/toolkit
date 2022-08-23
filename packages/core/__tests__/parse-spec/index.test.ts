import { parseSpec, setServerlessCdVariable } from '../../src';
import * as path from 'path';

test('yaml文件未找到', () => {
  const TEMPLATE_YAML = 'serverless-pipeline-no.yaml';
  setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, TEMPLATE_YAML));
  expect(() => parseSpec()).toThrow(`${TEMPLATE_YAML} not found`);
});

test('yaml文件内容格式不正确', () => {
  const TEMPLATE_YAML = 'serverless-pipeline-error.yaml';
  setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, TEMPLATE_YAML));
  expect.assertions(1);
  try {
    parseSpec();
  } catch (e) {
    expect((e as Error).toString()).toMatch(`Error: ${TEMPLATE_YAML} format is incorrect`);
  }
});

test('env 解析', () => {
  const TEMPLATE_YAML = 'serverless-pipeline.yaml';
  setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, TEMPLATE_YAML));
  const res = parseSpec();
  expect(res.steps).toEqual([
    {
      run: "echo 'Hi {{ env.name }}'",
      env: {
        name: 'Heimanba',
        age: 30,
      },
    },
    {
      run: "echo 'Hi {{ env.name }}'",
      env: {
        name: 'Tony',
        age: 30,
      },
    },
  ]);
});
