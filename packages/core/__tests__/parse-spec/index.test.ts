import { parseSpec } from '../../src';
import * as path from 'path';

test('yaml文件未找到', () => {
  const TEMPLATE_YAML = 'serverless-pipeline-no.yaml';
  expect(() => parseSpec(path.join(__dirname, TEMPLATE_YAML))).toThrow(
    `${TEMPLATE_YAML} not found`,
  );
});

test('yaml文件内容格式不正确', () => {
  const TEMPLATE_YAML = 'serverless-pipeline-error.yaml';
  expect.assertions(1);
  try {
    parseSpec(path.join(__dirname, TEMPLATE_YAML));
  } catch (e) {
    expect((e as Error).toString()).toMatch(`Error: ${TEMPLATE_YAML} format is incorrect`);
  }
});

test('env 解析', () => {
  const TEMPLATE_YAML = 'serverless-pipeline.yaml';
  const res = parseSpec(path.join(__dirname, TEMPLATE_YAML));
  console.log(JSON.stringify(res, null, 2));
  expect(res?.steps).toEqual([
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
