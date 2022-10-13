import { EngineLogger, artTemplate, fs } from '@serverless-cd/core';
import { createMachine, interpret } from 'xstate';
import {
  IStepOptions,
  IRunOptions,
  IScriptOptions,
  IUsesOptions,
  IStepsStatus,
  IContext,
  IStatus,
  IkeyValue,
  IEngineOptions,
  IPublicContext,
  ILogConfig,
} from './types';
import { isEmpty, get, each, replace, map, noop } from 'lodash';
import { command } from 'execa';
import { STEP_STATUS, STEP_IF } from './constant';
import * as path from 'path';
import EventEmitter from 'events';
import * as os from 'os';
// @ts-ignore
import * as zx from '@serverless-cd/zx';
import { mark, getScript, getSteps } from './utils';

export { IStepOptions } from './types';
class Engine extends EventEmitter {
  private childProcess: any[] = [];
  public context = {
    status: STEP_STATUS.PENING,
  } as IPublicContext;
  private $context = {
    editStatusAble: true,
  } as IContext;
  private steps: IStepOptions[] = [];
  private logger: any;
  private logConfig: ILogConfig;
  private inputs: IkeyValue | undefined;
  constructor(options: IEngineOptions) {
    const { steps, logConfig = {}, inputs } = options;
    super();
    this.logConfig = logConfig;
    this.inputs = inputs;
    this.steps = getSteps(steps, this.childProcess);
    this.context.steps = map(this.steps as IStepsStatus[], (item) => {
      item.status = STEP_STATUS.PENING;
      return item;
    });
  }
  async start() {
    if (isEmpty(this.steps)) return;
    return new Promise((resolve) => {
      const states: any = {
        init: {
          on: {
            INIT: get(this.steps, '[0].stepCount'),
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
                steps: this.$context.steps,
              });
            },
          },
        },
      };

      each(this.steps, (item, index) => {
        const target = this.steps[index + 1]
          ? get(this.steps, `[${index + 1}].stepCount`)
          : 'final';
        states[item.stepCount] = {
          invoke: {
            id: item.stepCount,
            src: () => {
              // logger
              this.setLogger(item);
              // 记录 context
              this.recordContext(item, { status: STEP_STATUS.RUNNING });
              // 记录环境变量
              this.$context.env = item.env as IkeyValue;
              this.doReplace$(item);
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
        .onTransition((state) => console.log(state.value))
        .start();
      stepService.send('INIT');
    });
  }

  private setLogger(item: IStepOptions) {
    const { customLogger, logPrefix, logLevel } = this.logConfig;
    if (customLogger) {
      return (this.logger = customLogger);
    }
    this.logger = new EngineLogger({
      file: logPrefix && path.join(logPrefix, `step_${item.stepCount}.log`),
      level: logLevel,
    });
  }

  private doReplace$(item: IStepOptions) {
    const runItem = item as IRunOptions;
    const scriptItem = item as IScriptOptions;
    const fn = (str: string) => replace(str, /\${{/g, '{{');
    if (runItem.run) {
      runItem.run = fn(runItem.run);
    }
    if (scriptItem.script) {
      scriptItem.script = fn(scriptItem.script);
    }
    if (item.if) {
      item.if = fn(item.if);
    }
  }
  private recordContext(
    item: IStepOptions,
    { status, errorMessage }: { status?: string; errorMessage?: string },
  ) {
    this.context.stepCount = item.stepCount;
    this.context.steps = map(this.context.steps, (obj) => {
      if (obj.stepCount === item.stepCount) {
        if (status) {
          obj.status = status;
        }
        if (errorMessage) {
          obj.errorMessage = errorMessage;
        }
      }
      return obj;
    });
  }
  cancel() {
    this.context.status = STEP_STATUS.CANCEL as IStatus;
    this.$context.editStatusAble = false;
    // kill child process, 后续的步骤正常执行，但状态标记为cancelled
    each(this.childProcess, (item) => {
      item.kill();
    });
  }
  private getFilterContext() {
    const env = get(this.$context, 'env', {});
    return {
      ...this.inputs,
      status: this.context.status,
      steps: this.$context.steps,
      env,
      secret: env,
    };
  }
  private getSecretFilterContext() {
    const env = this.$context.env;
    const secret = {} as IkeyValue;
    for (const key in env) {
      const val = env[key];
      secret[key] = mark(val);
    }
    return {
      ...this.inputs,
      steps: this.$context.steps,
      env,
      secret,
    };
  }
  private getProcessData(item: IStepOptions) {
    return {
      ...item,
      status: this.$context[item.stepCount].status,
      env: this.$context.env,
    };
  }
  // 每个步骤最后的动作
  private async doFinal(item: IStepOptions) {
    this.recordContext(item, { status: this.context.status });
    const { logPrefix, ossConfig } = this.logConfig;
    if (ossConfig && logPrefix) {
      await this.logger.oss({
        ...ossConfig,
        codeUri: path.join(logPrefix, `step_${item.stepCount}.log`),
      });
    }
  }
  // 将执行终态进行emit
  private doEmit() {
    const data = map(this.steps, (item: IStepsStatus) => {
      item.status = get(this.$context, `${item.stepCount}.status`);
      return item;
    });
    this.emit(this.context.status, data);
    this.context.status = this.context.status;
    this.emit('completed', data);
  }
  private async handleSrc(item: IStepOptions) {
    try {
      const response: any = await this.doSrc(item);
      // 如果已取消且if条件不成功，则不执行该步骤, 并记录状态为 cancelled
      const isCancel = item.if !== 'true' && this.context.status === STEP_STATUS.CANCEL;
      if (isCancel) return this.doCancel(item);
      // 记录全局的执行状态
      if (this.$context.editStatusAble) {
        this.context.status = STEP_STATUS.SUCCESS as IStatus;
      }
      // stepCount 添加状态
      this.$context[item.stepCount] = {
        status: STEP_STATUS.SUCCESS,
      };
      // id 添加状态
      if (item.id) {
        this.$context.steps = {
          ...this.$context.steps,
          [item.id]: {
            status: STEP_STATUS.SUCCESS,
            outputs: response,
          },
        };
      }
    } catch (err: any) {
      const status =
        item['continue-on-error'] === true ? STEP_STATUS.ERROR_WITH_CONTINUE : STEP_STATUS.FAILURE;
      // 记录全局的执行状态
      if (this.$context.editStatusAble) {
        this.context.status = status as IStatus;
      }
      if (status === STEP_STATUS.FAILURE) {
        // 全局的执行状态一旦失败，便不可修改
        this.$context.editStatusAble = false;
      }
      this.$context[item.stepCount] = {
        status,
      };
      if (item.id) {
        this.$context.steps = {
          ...this.$context.steps,
          [item.id]: {
            status,
          },
        };
      }
      if (item['continue-on-error'] !== true) {
        this.emit('process', this.getProcessData(item));
        // step 执行失败，记录 errorMessage
        this.recordContext(item, { errorMessage: err });
        await this.doFinal(item);
        throw err;
      }
    }
    this.emit('process', this.getProcessData(item));
    await this.doFinal(item);
  }
  private async doSrc(_item: IStepOptions) {
    const item = { ..._item };
    const runItem = item as IRunOptions;
    const usesItem = item as IUsesOptions;
    const scriptItem = item as IScriptOptions;
    // run
    if (runItem.run) {
      let execPath = runItem['working-directory'] || process.cwd();
      execPath = path.isAbsolute(execPath) ? execPath : path.join(process.cwd(), execPath);
      this.logName(_item);
      const ifCondition = artTemplate.compile(runItem.run);
      runItem.run = ifCondition(this.getFilterContext());
      const cp = command(runItem.run, { cwd: execPath });
      this.childProcess.push(cp);
      const res = await this.onFinish(cp);
      return res;
    }
    // uses
    if (usesItem.uses) {
      this.logName(item);
      // 本地路径调试时，不在安装依赖
      if (!fs.existsSync(usesItem.uses)) {
        const cp = command(`npm i ${usesItem.uses} --no-save`);
        this.childProcess.push(cp);
        await this.onFinish(cp);
      }
      const app = require(usesItem.uses);
      return usesItem.type === 'run'
        ? await app.run(get(usesItem, 'inputs', {}), this.getFilterContext(), this.logger)
        : await app.postRun(get(usesItem, 'inputs', {}), this.getFilterContext(), this.logger);
    }
    // script
    if (scriptItem.script) {
      this.logName(item);
      return await this.doScript(scriptItem);
    }
  }
  private async doScript(item: IScriptOptions) {
    // 文件路径
    if (fs.existsSync(item.script)) {
      item.script = fs.readFileSync(item.script, 'utf-8');
    }
    const ifCondition = artTemplate.compile(item.script);
    item.script = ifCondition(this.getFilterContext());
    const script = getScript(item.script);
    try {
      const fun = new Function(script);
      const run = fun();
      await run({ ...zx, os, path, logger: this.logger });
      return Promise.resolve({});
    } catch (err) {
      const errorMsg = (err as Error).toString();
      this.logger.info(errorMsg);
      return Promise.reject(errorMsg);
    }
  }
  private async doSkip(item: IStepOptions) {
    // stepCount 添加状态
    this.$context[item.stepCount] = {
      status: STEP_STATUS.SKIP,
    };
    // id 添加状态
    if (item.id) {
      this.$context.steps = {
        ...this.$context.steps,
        [item.id]: {
          status: STEP_STATUS.SKIP,
        },
      };
    }
    this.logName(item);
    this.emit('process', this.getProcessData(item));
    await this.doFinal(item);
    return Promise.resolve();
  }
  private async doCancel(item: IStepOptions) {
    // stepCount 添加状态
    this.$context[item.stepCount] = {
      status: STEP_STATUS.CANCEL,
    };
    // id 添加状态
    if (item.id) {
      this.$context.steps = {
        ...this.$context.steps,
        [item.id]: {
          status: STEP_STATUS.CANCEL,
        },
      };
    }
    this.logName(item);
    this.emit('process', this.getProcessData(item));
    await this.doFinal(item);
    return Promise.resolve();
  }
  private doWarn() {
    let msg = '';
    if (this.inputs?.env && this.inputs?.steps) {
      msg =
        'env and steps are built-in fields, and env and steps fields in the inputs will be ignored.';
    } else if (this.inputs?.env) {
      msg = 'env is a built-in fields, and the env field in the inputs will be ignored.';
    } else if (this.inputs?.steps) {
      msg = 'steps is a built-in fields, and the steps field in the inputs will be ignored.';
    }
    msg && this.logger.warn(msg);
  }
  private logName(item: IStepOptions) {
    // 打印 step 名称
    // serect数据进行加*，此时item修改了原有对象，保证emit callback 数据也是加*的
    const runItem = item as IRunOptions;
    const usesItem = item as IUsesOptions;
    const scriptItem = item as IScriptOptions;
    const isSkip = get(this.$context, `${item.stepCount}.status`) === STEP_STATUS.SKIP;
    let msg = '';
    if (runItem.run) {
      const ifCondition = artTemplate.compile(runItem.run);
      runItem.run = ifCondition(this.getSecretFilterContext());
      msg = runItem.name || `Run ${runItem.run}`;
    }
    if (usesItem.uses) {
      msg = usesItem.name || `${usesItem.type === 'run' ? 'Run' : 'Post Run'} ${usesItem.uses}`;
    }
    if (scriptItem.script) {
      msg = runItem.name || `Run ${scriptItem.script}`;
    }
    this.logger.debug(isSkip ? `[skipped] ${msg}` : msg);
    this.doWarn();
  }
  private onFinish(cp: any) {
    return new Promise((resolve, reject) => {
      const stdout: Buffer[] = [];
      const stderr: Buffer[] = [];
      cp.stdout.on('data', (chunk: Buffer) => {
        this.logger.info(chunk.toString());
        stdout.push(chunk);
      });

      cp.stderr.on('data', (chunk: Buffer) => {
        this.logger.info(chunk.toString());
        stderr.push(chunk);
      });

      cp.on('exit', (code: number) => {
        code === 0 || this.context.status === STEP_STATUS.CANCEL
          ? resolve({})
          : reject(Buffer.concat(stderr).toString());
      });
    });
  }
}

export default Engine;
