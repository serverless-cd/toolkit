import { logger } from '@serverless-cd/core';
import { createMachine, interpret } from 'xstate';
import {
  IStepOptions,
  IRunOptions,
  IUsesOptions,
  IStepsStatus,
  IContext,
  IStatus,
  IkeyValue,
} from './types';
import { isEmpty, get, each, replace, map, uniqueId, merge, omit } from 'lodash';
import { command } from 'execa';
import { STEP_STATUS, STEP_IF } from './constant';
import * as path from 'path';
import * as fs from 'fs-extra';
import EventEmitter from 'events';
const artTemplate = require('art-template');

export { IStepOptions } from './types';

class Engine extends EventEmitter {
  private childProcess: any[] = [];
  private context = {
    status: 'success',
    editStatusAble: true,
  } as IContext;
  constructor(private steps: IStepOptions[]) {
    super();
    this.steps = map(steps, (item: IStepOptions) => {
      item.$stepCount = uniqueId();
      return item;
    });
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
            src: () => {
              // 执行终态是 error-with-continue 的时候，改为 success
              const status =
                this.context.status === STEP_STATUS.ERROR_WITH_CONTINUE
                  ? STEP_STATUS.SUCCESS
                  : this.context.status;
              this.context.status = status as IStatus;
              this.doEmit();
              resolve({
                status: this.context.status,
                steps: this.context.steps,
              });
            },
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
            src: () => {
              // 合并环境变量
              this.context.env = item.env as IkeyValue;
              // 先判断if条件，成功则执行该步骤。
              if (item.if) {
                // 替换 failure()
                item.if = replace(
                  item.if,
                  STEP_IF.FAILURE,
                  this.context.status === STEP_STATUS.FAILURE ? 'true' : 'false',
                );
                // 替换 success()
                item.if = replace(
                  item.if,
                  STEP_IF.SUCCESS,
                  this.context.status !== STEP_STATUS.FAILURE ? 'true' : 'false',
                );
                // 替换 success()
                item.if = replace(
                  item.if,
                  STEP_IF.CANCEL,
                  this.context.status === STEP_STATUS.CANCEL ? 'true' : 'false',
                );
                // 替换 always()
                item.if = replace(item.if, STEP_IF.ALWAYS, 'true');
                const ifCondition = artTemplate.compile(item.if);
                item.if = ifCondition(this.getFilterContext());
                return item.if === 'true' ? this.handleSrc(item) : this.doSkip(item);
              }
              // 如果已取消，则不执行该步骤, 并记录状态为 cancelled
              if (this.context.status === STEP_STATUS.CANCEL) return this.doCancel(item);
              // 其次检查全局的执行状态，如果是failure，则不执行该步骤, 并记录状态为 skipped
              if (this.context.status === STEP_STATUS.FAILURE) {
                return this.doSkip(item);
              }
              return this.handleSrc(item);
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
        states,
      });
      const stepService = interpret(fetchMachine)
        .onTransition((state) => console.log(state.value, this.context))
        .start();
      stepService.send('INIT');
    });
  }
  cancel() {
    this.context.status = STEP_STATUS.CANCEL as IStatus;
    this.context.editStatusAble = false;
    // kill child process, 后续的步骤正常执行，但状态标记为cancelled
    each(this.childProcess, (item) => {
      item.kill();
    });
  }
  private getFilterContext() {
    return {
      status: this.context.status,
      steps: this.context.steps,
      env: get(this.context, 'env', {}),
    };
  }
  private getProcessData(item: IStepOptions) {
    return {
      ...omit(item, '$stepCount'),
      status: this.context[item.$stepCount].status,
      env: this.context.env,
    };
  }
  // 将执行终态进行emit
  private doEmit() {
    const data = map(this.steps, (item: IStepsStatus) => {
      item.status = get(this.context, `${item.$stepCount}.status`);
      const { $stepCount, ...rest } = item;
      return rest;
    });
    this.emit(this.context.status, data);
  }
  private async handleSrc(item: IStepOptions) {
    return this.doSrc(item)
      .then((response: any) => {
        // 如果已取消且if条件不成功，则不执行该步骤, 并记录状态为 cancelled
        const isCancel = item.if !== 'true' && this.context.status === STEP_STATUS.CANCEL;
        if (isCancel) return this.doCancel(item);
        // 记录全局的执行状态
        if (this.context.editStatusAble) {
          this.context.status = STEP_STATUS.SUCCESS as IStatus;
        }
        // $stepCount 添加状态
        this.context[item.$stepCount] = {
          status: STEP_STATUS.SUCCESS,
        };
        // id 添加状态
        if (item.id) {
          this.context.steps = {
            ...this.context.steps,
            [item.id]: {
              status: STEP_STATUS.SUCCESS,
              outputs: response,
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
        if (this.context.editStatusAble) {
          this.context.status = status as IStatus;
        }
        if (status === STEP_STATUS.FAILURE) {
          // 全局的执行状态一旦失败，便不可修改
          this.context.editStatusAble = false;
        }
        this.context[item.$stepCount] = {
          status,
        };
        if (item.id) {
          this.context.steps = {
            ...this.context.steps,
            [item.id]: {
              status,
              errorMessage: err,
            },
          };
        }
        if (item['continue-on-error'] !== true) throw err;
      })
      .finally(() => {
        this.emit('process', this.getProcessData(item));
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
      const ifCondition = artTemplate.compile(runItem.run);
      runItem.run = ifCondition(this.getFilterContext());
      const cp = command(runItem.run, { cwd: execPath });
      this.childProcess.push(cp);
      const res = await this.onFinish(cp, logFile);
      return res;
    }
    // uses
    if (usesItem.uses) {
      this.logName(item);
      // 本地路径调试时，不在安装依赖
      if (!fs.existsSync(usesItem.uses)) {
        const cp = command(`npm i ${usesItem.uses} --no-save`);
        this.childProcess.push(cp);
        await this.onFinish(cp, logFile);
      }
      const run = require(usesItem.uses).default;
      return await run({
        inputs: get(usesItem, 'with', {}),
        context: this.getFilterContext(),
      });
    }
  }
  private async doSkip(item: IStepOptions) {
    // $stepCount 添加状态
    this.context[item.$stepCount] = {
      status: STEP_STATUS.SKIP,
    };
    // id 添加状态
    if (item.id) {
      this.context.steps = {
        ...this.context.steps,
        [item.id]: {
          status: STEP_STATUS.SKIP,
        },
      };
    }
    this.logName(item);
    this.emit('process', this.getProcessData(item));
    return Promise.resolve();
  }
  private async doCancel(item: IStepOptions) {
    // $stepCount 添加状态
    this.context[item.$stepCount] = {
      status: STEP_STATUS.CANCEL,
    };
    // id 添加状态
    if (item.id) {
      this.context.steps = {
        ...this.context.steps,
        [item.id]: {
          status: STEP_STATUS.CANCEL,
        },
      };
    }
    this.logName(item);
    return Promise.resolve();
  }
  private logName(item: IStepOptions) {
    const logFile = `step_${item.$stepCount}.log`;
    const runItem = item as IRunOptions;
    const usesItem = item as IUsesOptions;
    const isSkip = get(this.context, `${item.$stepCount}.status`) === STEP_STATUS.SKIP;
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
        stdout.length ? resolve({}) : reject(Buffer.concat(stderr).toString());
      });
    });
  }
}

export default Engine;
