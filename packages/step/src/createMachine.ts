import { logger } from '@serverless-cd/core';
import { createMachine, interpret } from 'xstate';
import { IStepOptions, IRunOptions, IUsesOptions } from './types';
import { isEmpty, get, each, replace } from 'lodash';
import { command } from 'execa';
import * as path from 'path';
const artTemplate = require('art-template');

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
            // 先判断if条件，成功则执行该步骤。
            if (item.if) {
              // 替换 failure()
              item.if = replace(
                item.if,
                'failure()',
                context.$status === 'failure' ? 'true' : 'false',
              );
              // 替换 success()
              item.if = replace(
                item.if,
                'success()',
                context.$status !== 'failure' ? 'true' : 'false',
              );
              // 替换 success()
              item.if = replace(item.if, 'always()', 'true');
              const ifCondition = artTemplate.compile(item.if);
              return ifCondition(context) === 'true'
                ? handleSrc(item, context)
                : doSkip(item, context);
            }
            // 其次检查全局的执行状态，如果是failure，则不执行该步骤, 并记录状态为 skip
            if (context.$status === 'failure') {
              return doSkip(item, context);
            }
            return handleSrc(item, context);
          },
          onDone: {
            target,
          },
          onError: target,
        },
      };
    });

    const fetchMachine = createMachine({
      predictableActionArguments: true,
      id: 'step',
      initial: 'init',
      context: {
        $status: 'init',
      },
      states,
    });
    const stepService = interpret(fetchMachine)
      .onTransition((state) => console.log(state.value, state.context))
      .start();
    stepService.send('INIT');
  });
};

const handleSrc = async (item: IStepOptions, context: any) => {
  return doSrc(item)
    .then((response: any) => {
      // 记录全局的执行状态
      context.$status = 'success';
      // $stepCount 添加状态
      context[item.$stepCount] = {
        status: 'success',
      };
      // id 添加状态
      if (item.id) {
        context.steps = {
          ...context.steps,
          [item.id]: {
            status: 'success',
            output: response,
          },
        };
      }
    })
    .catch((err: any) => {
      const status = item['continue-on-error'] === true ? 'error-with-continue' : 'failure';
      // 记录全局的执行状态
      context.$status = status;
      context[item.$stepCount] = {
        status,
      };
      if (item.id) {
        context.steps = {
          ...context.steps,
          [item.id]: {
            status,
            output: err,
          },
        };
      }
      if (item['continue-on-error'] !== true) throw err;
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
    logName(item);
    const cp = command(runItem.run, { cwd: execPath });
    const res = await onFinish(cp, logFile);
    return res;
  }
  // uses
  if (usesItem.uses) {
    logName(item);
    const cp = command(`npm i ${usesItem.uses} --save`);
    await onFinish(cp, logFile);
    try {
      return await require(usesItem.uses).run(usesItem.with);
    } catch (e) {
      logger.error(e as string, logFile);
    }
  }
};

const doSkip = async (item: IStepOptions, context: any) => {
  // $stepCount 添加状态
  context[item.$stepCount] = {
    status: 'skip',
  };
  // id 添加状态
  if (item.id) {
    context.steps = {
      ...context.steps,
      [item.id]: {
        status: 'skip',
      },
    };
  }
  logName(item, context);
  return Promise.resolve();
};

function logName(item: IStepOptions, context?: any) {
  const logFile = `step_${item.$stepCount}.log`;
  const runItem = item as IRunOptions;
  const usesItem = item as IUsesOptions;
  const isSkip = get(context, `${item.$stepCount}.status`) === 'skip';
  if (runItem.run) {
    const msg = runItem.name || `Run ${runItem.run}`;
    return logger.info(isSkip ? `[skipped] ${msg}` : msg, logFile);
  }
  if (usesItem.uses) {
    const msg = usesItem.name || `Run ${usesItem.uses}`;
    logger.info(isSkip ? `[skipped] ${msg}` : msg, logFile);
  }
}

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