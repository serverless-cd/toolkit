import * as path from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';
import { getServerlessCdVariable } from './variable';

const TEMPLATE_YAML = 'serverless-pipeline.yaml';

export function getYamlContent() {
  const filePath = getYamlPath();
  const filename = path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filename} not found`);
  }

  try {
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    const e = error as Error;
    let message = `${filename} format is incorrect`;
    if (e.message) {
      message += `: ${e.message}`;
    }
    throw new Error(message);
  }
}

export function getYamlPath() {
  const templatePath = getServerlessCdVariable('TEMPLATE_PATH');
  return templatePath || path.join(process.cwd(), TEMPLATE_YAML);
}
