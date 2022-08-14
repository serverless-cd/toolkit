import { logger } from '@serverless-cd/core';
import { createMachine, interpret } from 'xstate';
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
          INIT: get(steps, '[0].$stepCount'),
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
      const target = steps[index + 1] ? get(steps, `[${index + 1}].$stepCount`) : 'final';
      states[item.$stepCount] = {
        invoke: {
          id: item.$stepCount,
          src: (context: any) => {
            return doSrc(item)
              .then((response: any) => {
                // $stepCount 添加状态
                context[item.$stepCount] = {
                  status: 'success',
                };
                // id 添加状态
                if (item.id) {
                  context[item.id] = {
                    status: 'success',
                    output: response,
                  };
                }
              })
              .catch((err: any) => {
                const status =
                  item['continue-on-error'] === true ? 'error-with-continue' : 'failure';
                context[item.$stepCount] = {
                  status,
                };
                if (item.id) {
                  context[item.id] = {
                    status,
                    output: err,
                  };
                }
                if (item['continue-on-error'] !== true) throw err;
              });
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
      .onTransition((state) => console.log(state.value, state.context))
      .start();
    stepService.send('INIT');
  });
};

const doSrc = async (item: IStepOptions) => {
  const logFile = `step_${item.$stepCount}.log`;
  const runItem = item as IRunOptions;
  const usesItem = item as IUsesOptions;
  // run
  if (runItem.run) {
    let execPath = runItem['working-directory'] || process.cwd();
    execPath = path.isAbsolute(execPath) ? execPath : path.join(process.cwd(), execPath);
    logger.info(runItem.name || `Run ${runItem.run}`, logFile);
    const cp = command(runItem.run, { cwd: execPath });
    const res = await onFinish(cp, logFile);
    return res;
  }
  // uses
  if (usesItem.uses) {
    logger.info(usesItem.name || `Run ${usesItem.uses}`, logFile);
    const cp = command(`npm i ${usesItem.uses} --save`);
    await onFinish(cp, logFile);
    try {
      return await require(usesItem.uses).run(usesItem.with);
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
            stdout: Buffer.concat(stdout).toString(),
          })
        : reject({
            code: code,
            stderr: Buffer.concat(stderr).toString(),
          });
    });
  });
}
