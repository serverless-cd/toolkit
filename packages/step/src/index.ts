import { logger, getYamlContent } from '@serverless-cd/core';
import { get, map, has, uniqueId } from 'lodash';
import * as path from 'path';
import { command } from 'execa';

async function step() {
  const pipelineContent = getYamlContent();
  const steps = map(get(pipelineContent, 'job.steps', []), (item: any) => {
    item.stepCount = uniqueId();
    return item;
  });

  for (const item of steps) {
    const logFile = `step_${item.stepCount}.log`;
    if (has(item, 'run')) {
      let execPath = get(item, 'working-directory') ? item['working-directory'] : process.cwd();
      execPath = path.isAbsolute(execPath) ? execPath : path.join(process.cwd(), execPath);
      logger.info(item.name || item.run, logFile);
      const cp = command(item.run, { cwd: execPath });
      await onFinish(cp, logFile);
    } else if (has(item, 'uses')) {
      logger.info(item.name || item.uses, logFile);
      const cp = command(`npm i ${item.uses} --save`);
      await onFinish(cp, logFile);
      try {
        await require(item.uses).run(get(item, 'with'));
      } catch (e) {
        logger.error(e as string, logFile);
      }
    }
  }
}

function onFinish(cp: any, logFile: string) {
  return new Promise((resolve) => {
    cp.stdout.on('data', (chunk: Buffer) => {
      logger.info(chunk.toString(), logFile);
    });
    cp.on('exit', (code: number) => {
      resolve(code);
    });
  });
}

export default step;
