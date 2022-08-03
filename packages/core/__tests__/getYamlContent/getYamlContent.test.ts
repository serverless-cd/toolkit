import { getYamlContent } from '../../src';
import * as path from 'path';

test('getYamlContent with error', () => {
  process.env['TEMPLATE_PATH'] = path.join(__dirname, 'serverless-pipeline-error.yaml');
  try {
    getYamlContent();
  } catch (error: any) {
    console.log(error.message);
    expect(error).toBeTruthy();
  }
});

test('getYamlContent', () => {
  process.env['TEMPLATE_PATH'] = path.join(__dirname, 'serverless-pipeline.yaml');
  expect(getYamlContent()).toBeTruthy();
});
