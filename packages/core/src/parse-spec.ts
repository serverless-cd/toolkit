import * as path from 'path';
import * as yaml from 'js-yaml';
import * as fs from 'fs-extra';
import { get, map, merge } from 'lodash';

// 解析配置文件
function parseSpec(filePath: string) {
  const filename = path.basename(filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`${filename} not found`);
  }

  try {
    const res = yaml.load(fs.readFileSync(filePath, 'utf8'));
    if (res) {
      return {
        ...res,
        steps: map(get(res, 'steps'), (step: any) => {
          step.env = merge({}, get(res, 'env'), get(step, 'env'));
          return step;
        }),
      };
    }
  } catch (error) {
    const e = error as Error;
    let message = `${filename} format is incorrect`;
    if (e.message) {
      message += `: ${e.message}`;
    }
    throw new Error(message);
  }
}

export default parseSpec;
