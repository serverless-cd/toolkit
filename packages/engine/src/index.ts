import { logger } from '@serverless-cd/core';
import { createMachine, interpret } from 'xstate';
import { IStepOptions, IRunOptions, IUsesOptions } from './types';
import { isEmpty, get, each, replace } from 'lodash';
import { command } from 'execa';
import { STEP_STATUS, STEP_IF } from './constant';
import * as path from 'path';
import EventEmitter from 'events';
const artTemplate = require('art-template');

class Engine extends EventEmitter {
  private childProcess: any[] = [];
  private canceled = false;
  constructor(private steps: IStepOptions[]) {
    super();
  }
  async start() {
    if (isEmpty(this.steps)) return;
    return new Promise((resolve) => {
      const states: any = {
        init: {
          on: {
            INIT: get(this.steps, '[0].$stepCount'),
          },
        },
        final: {
          type: 'final',
          invoke: {
            src: (context: any) => resolve({ status: context.$status, steps: context.steps }),
          },
        },
      };

      each(this.steps, (item, index) => {
        const target = this.steps[index + 1]
          ? get(this.steps, `[${index + 1}].$stepCount`)
          : 'final';
        states[item.$stepCount] = {
          invoke: {
            id: item.$stepCount,
            src: (context: any) => {
              // 如果已经取消，则不执行
              if (this.canceled) return Promise.reject('canceled');
              // 先判断if条件，成功则执行该步骤。
              if (item.if) {
                // 替换 failure()
                item.if = replace(
                  item.if,
                  STEP_IF.FAILURE,
                  context.$status === STEP_STATUS.FAILURE ? 'true' : 'false',
                );
                // 替换 success()
                item.if = replace(
                  item.if,
                  STEP_IF.SUCCESS,
                  context.$status !== STEP_STATUS.FAILURE ? 'true' : 'false',
                );
                // 替换 success()
                item.if = replace(item.if, STEP_IF.ALWAYS, 'true');
                const ifCondition = artTemplate.compile(item.if);
                return ifCondition(context) === 'true'
                  ? this.handleSrc(item, context)
                  : this.doSkip(item, context);
              }
              // 其次检查全局的执行状态，如果是failure，则不执行该步骤, 并记录状态为 skip
              if (context.$status === STEP_STATUS.FAILURE) {
                return this.doSkip(item, context);
              }
              return this.handleSrc(item, context);
            },
            onDone: {
              target,
            },
            onError: this.canceled ? 'final' : target,
          },
        };
      });

      const fetchMachine = createMachine({
        predictableActionArguments: true,
        id: 'step',
        initial: 'init',
        context: {
          $status: 'init',
          $editStatusAble: true, // 记录全局的执行状态是否可修改（一旦失败，便不可修改）
        },
        states,
      });
      const stepService = interpret(fetchMachine)
        .onTransition((state) => console.log(state.value, state.context))
        .start();
      stepService.send('INIT');
    });
  }
  cancel() {
    this.canceled = true;
    // 终止退出码为2
    process.exitCode = 2;
    each(this.childProcess, (item) => {
      item.kill();
    });
  }
  private async handleSrc(item: IStepOptions, context: any) {
    return this.doSrc(item)
      .then((response: any) => {
        // 记录全局的执行状态
        if (context.$editStatusAble) {
          context.$status = STEP_STATUS.SUCCESS;
        }
        // $stepCount 添加状态
        context[item.$stepCount] = {
          status: STEP_STATUS.SUCCESS,
        };
        // id 添加状态
        if (item.id) {
          context.steps = {
            ...context.steps,
            [item.id]: {
              status: STEP_STATUS.SUCCESS,
              output: response,
            },
          };
        }
      })
      .catch((err: any) => {
        const status =
          item['continue-on-error'] === true
            ? STEP_STATUS.ERROR_WITH_CONTINUE
            : STEP_STATUS.FAILURE;
        // 记录全局的执行状态
        if (context.$editStatusAble) {
          context.$status = status;
        }
        if (status === STEP_STATUS.FAILURE) {
          // 全局的执行状态一旦失败，便不可修改
          context.$editStatusAble = false;
        }
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
  }
  private async doSrc(item: IStepOptions) {
    const logFile = `step_${item.$stepCount}.log`;
    const runItem = item as IRunOptions;
    const usesItem = item as IUsesOptions;
    // run
    if (runItem.run) {
      let execPath = runItem['working-directory'] || process.cwd();
      execPath = path.isAbsolute(execPath) ? execPath : path.join(process.cwd(), execPath);
      this.logName(item);
      const cp = command(runItem.run, { cwd: execPath });
      this.childProcess.push(cp);
      const res = await this.onFinish(cp, logFile);
      return res;
    }
    // uses
    if (usesItem.uses) {
      this.logName(item);
      const cp = command(`npm i ${usesItem.uses} --save`);
      this.childProcess.push(cp);
      await this.onFinish(cp, logFile);
      try {
        return await require(usesItem.uses).run(usesItem.with);
      } catch (e) {
        logger.error(e as string, logFile);
      }
    }
  }
  private async doSkip(item: IStepOptions, context: any) {
    // $stepCount 添加状态
    context[item.$stepCount] = {
      status: STEP_STATUS.SKIP,
    };
    // id 添加状态
    if (item.id) {
      context.steps = {
        ...context.steps,
        [item.id]: {
          status: STEP_STATUS.SKIP,
        },
      };
    }
    this.logName(item, context);
    return Promise.resolve();
  }
  private logName(item: IStepOptions, context?: any) {
    const logFile = `step_${item.$stepCount}.log`;
    const runItem = item as IRunOptions;
    const usesItem = item as IUsesOptions;
    const isSkip = get(context, `${item.$stepCount}.status`) === STEP_STATUS.SKIP;
    if (runItem.run) {
      const msg = runItem.name || `Run ${runItem.run}`;
      return logger.info(isSkip ? `[skipped] ${msg}` : msg, logFile);
    }
    if (usesItem.uses) {
      const msg = usesItem.name || `Run ${usesItem.uses}`;
      logger.info(isSkip ? `[skipped] ${msg}` : msg, logFile);
    }
  }
  private onFinish(cp: any, logFile: string) {
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
}

export default Engine;
