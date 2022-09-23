import * as path from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';
import { getServerlessCdVariable } from './variable';
import { get, map, merge } from 'lodash';

const TEMPLATE_YAML = 'serverless-pipeline.yaml';

function parseSpec() {
  const filePath = getYamlPath();
  const filename = path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filename} not found`);
  }

  try {
    const res = yaml.load(fs.readFileSync(filePath, 'utf8'));
    return {
      triggers: get(res, 'triggers'),
      steps: map(get(res, 'steps'), (step) => {
        step.env = merge({}, get(res, 'env'), get(step, 'env'));
        return step;
      }),
    };
  } catch (error) {
    const e = error as Error;
    let message = `${filename} format is incorrect`;
    if (e.message) {
      message += `: ${e.message}`;
    }
    throw new Error(message);
  }
}

function getYamlPath() {
  const templatePath = getServerlessCdVariable('TEMPLATE_PATH');
  return templatePath || path.join(process.cwd(), TEMPLATE_YAML);
}

export default parseSpec;
