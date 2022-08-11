import { logger } from '@serverless-cd/core';
import { createMachine, interpret, assign } from 'xstate';
import { IStepOptions, IRunOptions, IUsesOptions } from './types';
import { isEmpty, get, each } from 'lodash';
import { command } from 'execa';
import * as path from 'path';
const ALWAYS = '${{ always() }}';

export default (steps: IStepOptions[]) => {
  if (isEmpty(steps)) return;
  return new Promise((resolve) => {
    const states: any = {
      init: {
        on: {
          INIT: get(steps, '[0].stepCount'),
        },
      },
      final: {
        type: 'final',
        invoke: {
          src: (context: any) => resolve(context),
        },
      },
    };

    each(steps, (item, index) => {
      const target = steps[index + 1] ? get(steps, `[${index + 1}].stepCount`) : 'final';
      states[item.stepCount] = {
        invoke: {
          id: item.stepCount,
          src: async (context: any) => {
            return await doSrc(item, context);
          },
          onDone: {
            target,
          },
          onError: item.if === ALWAYS ? target : 'final',
        },
      };
    });

    const fetchMachine = createMachine({
      predictableActionArguments: true,
      id: 'step',
      initial: 'init',
      context: {},
      states,
    });
    const stepService = interpret(fetchMachine)
      .onTransition((state) => console.log(state.value))
      .start();
    stepService.send('INIT');
  });
};

const doSrc = async (item: IStepOptions, context: any) => {
  const logFile = `step_${item.stepCount}.log`;
  const runItem = item as IRunOptions;
  const usesItem = item as IUsesOptions;
  // run
  if (runItem.run) {
    let execPath = runItem['working-directory'] || process.cwd();
    execPath = path.isAbsolute(execPath) ? execPath : path.join(process.cwd(), execPath);
    logger.info(runItem.name || runItem.run, logFile);
    const cp = command(runItem.run, { cwd: execPath });
    const res = await onFinish(cp, logFile);
    return res;
  }
  // uses
  if (usesItem.uses) {
    logger.info(usesItem.name || usesItem.uses, logFile);
    const cp = command(`npm i ${usesItem.uses} --save`);
    await onFinish(cp, logFile);
    try {
      await require(usesItem.uses).run(usesItem.with);
    } catch (e) {
      logger.error(e as string, logFile);
    }
  }
};

function onFinish(cp: any, logFile: string) {
  return new Promise((resolve, reject) => {
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    cp.stdout.on('data', (chunk: Buffer) => {
      logger.info(chunk.toString(), logFile);
      stdout.push(chunk);
    });

    cp.stderr.on('data', (chunk: Buffer) => {
      logger.info(chunk.toString(), logFile);
      stderr.push(chunk);
    });

    cp.on('exit', (code: number) => {
      stdout.length
        ? resolve({
            code: code,
            stdout: Buffer.concat(stdout),
          })
        : reject({
            code: code,
            stderr: Buffer.concat(stderr),
          });
    });
  });
}
