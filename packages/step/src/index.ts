import { logger } from '@serverless-cd/core';
import { get, has, uniqueId, map } from 'lodash';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'yaml';
import * as execa from 'execa';

const TEMPLATE_YAML = 'serverless-pipeline.yaml';

async function step() {
  const jobId = `job${Date.now()}`;
  const checkPath = path.join(process.cwd(), jobId, 'check.log');
  fs.ensureFileSync(checkPath);
  checkYaml({ checkPath });
  const doc = getYamlContent({ checkPath });
  const runtime = get(doc, 'job.runtime', 'nodejs14');
  const steps = get(doc, 'job.steps', []).map((o: any) => {
    o.id = uniqueId();
    return o;
  });
  logger.info(`steps params: ${JSON.stringify(steps)}`, checkPath);
  const configPath = path.join(process.cwd(), jobId, runtime, `config.json`);
  fs.ensureFileSync(configPath);
  fs.writeFileSync(
    configPath,
    JSON.stringify({
      status: map(steps, (o) => {
        o.status = 'waiting';
        return o;
      }),
    }),
  );
  for (const item of steps) {
    const logPath = path.join(process.cwd(), jobId, runtime, `step${item.id}.log`);
    fs.ensureFileSync(logPath);
    const preData = map(steps, (o) => {
      if (o.id === item.id) {
        o.status = 'pending';
      }
      return o;
    });
    fs.writeFileSync(configPath, JSON.stringify({ status: preData }));
    if (has(item, 'run')) {
      let execPath = get(item, 'working-directory') ? item['working-directory'] : process.cwd();
      execPath = path.isAbsolute(execPath) ? execPath : path.join(process.cwd(), execPath);
      logger.info(`Executing ${item.run}`, logPath);
      execa.sync(item.run, { stdio: 'inherit', shell: true, cwd: execPath });
    } else if (has(item, 'uses')) {
      logger.info(`Executing ${item.uses}`, logPath);
      execa.sync(`npm i ${item.uses} --save`, { stdio: 'inherit', shell: true });
      try {
        await require(item.uses).run(get(item, 'with'));
      } catch (e) {
        logger.error(e as string, logPath);
      }
    }
    const postData = map(steps, (o) => {
      if (o.id === item.id) {
        o.status = 'complete';
      }
      return o;
    });
    fs.writeFileSync(configPath, JSON.stringify({ status: postData }));
  }
}

function checkYaml({ checkPath }: { checkPath: string }) {
  const filePath = path.join(process.cwd(), TEMPLATE_YAML);
  logger.info(`Checking ${filePath}`, checkPath);
  if (!fs.existsSync(filePath)) {
    logger.error(`${TEMPLATE_YAML} not found`, checkPath);
    throw new Error(`${TEMPLATE_YAML} not found`);
  }
}

function getYamlContent({ checkPath }: { checkPath: string }) {
  const filePath = path.join(process.cwd(), TEMPLATE_YAML);
  logger.info(`Reading ${filePath}`, checkPath);
  try {
    return yaml.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    logger.error(`${TEMPLATE_YAML} format is incorrect`, checkPath);
    throw new Error(`${TEMPLATE_YAML} format is incorrect`);
  }
}

export default step;
