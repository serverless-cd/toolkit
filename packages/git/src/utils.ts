import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
const debug = require('debug')('serverless-cd:util');

export const ensureDir = (dir: string) => {
  const myDir = dir || os.tmpdir();
  const realDir: string = path.isAbsolute(myDir) ? myDir : path.join(process.cwd(), myDir);
  debug(`execDir: ${realDir}`);
  fs.ensureDirSync(realDir);
  return realDir;
};
