import { EngineLogger, artTemplate, fs, lodash } from '@serverless-cd/core';
import { createMachine, interpret } from 'xstate';
import { command } from 'execa';
import {
  IStepOptions,
  IRunOptions,
  IScriptOptions,
  IPluginOptions,
  IRecord,
  IStatus,
  IEngineOptions,
  IContext,
  ILogConfig,
  STEP_STATUS,
  ISteps,
  STEP_IF,
} from './types';
import * as path from 'path';
import * as os from 'os';
// @ts-ignore
import * as zx from '@serverless-cd/zx';
import {
  getScript,
  parsePlugin,
  getProcessTime,
  getDefaultInitLog,
  getLogPath,
  outputLog,
  getPluginRequirePath,
} from './utils';
import {
  INIT_STEP_COUNT,
  INIT_STEP_NAME,
  COMPLETED_STEP_COUNT,
  DEFAULT_COMPLETED_LOG,
} from './constants';
export { IStepOptions, IContext } from './types';

const {
  isEmpty,
  get,
  each,
  replace,
  map,
  find,
  isFunction,
  values,
  has,
  concat,
  includes,
  startsWith,
  endsWith,
} = lodash;

class Engine {
  private childProcess: any[] = [];
  public context = { status: STEP_STATUS.PENING, completed: false } as IContext;
  private record = { status: STEP_STATUS.PENING, editStatusAble: true } as IRecord;
  private logger: any;
  constructor(private options: IEngineOptions) {
    const { inputs, cwd = process.cwd(), logConfig = {} } = options;
    this.options.logConfig = logConfig;
    this.context.cwd = cwd;
    this.context.inputs = inputs as {};
    this.context.secrets = inputs?.secrets;
    this.doArtTemplateVariable();
    this.doUnsetEnvs();
  }
  private async doUnsetEnvs() {
    const { unsetEnvs } = this.options;
    if (!isEmpty(unsetEnvs)) {
      each(unsetEnvs, (item) => {
        delete process.env[item];
      });
    }
  }
  private doArtTemplateVariable() {
    artTemplate.defaults.imports.contains = includes;
    artTemplate.defaults.imports.startsWith = startsWith;
    artTemplate.defaults.imports.endsWith = endsWith;
  }
  private async doInit() {
    const { events } = this.options;
    this.context.status = STEP_STATUS.RUNNING;
    const startTime = Date.now();
    const filePath = getLogPath(INIT_STEP_COUNT);
    this.logger = this.getLogger(filePath);
    this.logger.info(getDefaultInitLog());
    try {
      const res = await events?.onInit?.(this.context, this.logger);
      // onInit ??????????????????????????????????????????
      const process_time = getProcessTime(startTime);
      this.record.initData = {
        name: get(res, 'name', INIT_STEP_NAME),
        status: STEP_STATUS.SUCCESS,
        process_time,
        stepCount: INIT_STEP_COUNT,
        outputs: res,
      };
      // ???????????? doInit ????????? steps ??????????????? ???????????? steps ??????
      const steps = await parsePlugin(res?.steps || this.options.steps, this);
      await this.doOss(filePath);
      return { ...res, steps };
    } catch (error) {
      outputLog(this.logger, error);
      this.context.status = this.record.status = STEP_STATUS.FAILURE;
      const process_time = getProcessTime(startTime);
      this.record.initData = {
        name: INIT_STEP_NAME,
        status: STEP_STATUS.FAILURE,
        process_time,
        stepCount: INIT_STEP_COUNT,
        error,
      };
      this.context.error = error as Error;
      await this.doOss(filePath);
      const steps = await parsePlugin(this.options.steps as IStepOptions[], this);
      return { steps };
    }
  }
  async start(): Promise<IContext> {
    const { steps } = await this.doInit();

    if (isEmpty(steps)) {
      throw new Error('steps is empty, please check your config');
    }
    this.context.steps = map(steps as ISteps[], (item) => {
      item.status = STEP_STATUS.PENING;
      return item;
    });
    return new Promise(async (resolve) => {
      const states: any = {
        init: {
          on: {
            INIT: get(steps, '[0].stepCount'),
          },
        },
        final: {
          type: 'final',
          invoke: {
            src: async () => {
              // ??????????????? error-with-continue ?????????????????? success
              const status =
                this.record.status === STEP_STATUS.ERROR_WITH_CONTINUE
                  ? STEP_STATUS.SUCCESS
                  : this.record.status;
              this.context.status = status;
              await this.doCompleted();
              resolve(this.context);
            },
          },
        },
      };

      each(steps, (item, index) => {
        const target = steps[index + 1] ? get(steps, `[${index + 1}].stepCount`) : 'final';
        states[item.stepCount as string] = {
          invoke: {
            id: item.stepCount,
            src: async () => {
              this.record.startTime = Date.now();
              // logger
              this.logger = this.getLogger(getLogPath(item.stepCount));
              // ?????? context
              this.recordContext(item, { status: STEP_STATUS.RUNNING });
              // ??????????????????
              this.context.env = item.env as {};
              // ?????????if????????????????????????????????????
              if (item.if) {
                // ?????? failure()
                item.if = replace(
                  item.if,
                  STEP_IF.FAILURE,
                  this.record.status === STEP_STATUS.FAILURE ? 'true' : 'false',
                );
                // ?????? success()
                item.if = replace(
                  item.if,
                  STEP_IF.SUCCESS,
                  this.record.status !== STEP_STATUS.FAILURE ? 'true' : 'false',
                );
                // ?????? cancelled()
                item.if = replace(
                  item.if,
                  STEP_IF.CANCEL,
                  this.record.status === STEP_STATUS.CANCEL ? 'true' : 'false',
                );
                // ?????? always()
                item.if = replace(item.if, STEP_IF.ALWAYS, 'true');
                item.if = this.doArtTemplateCompile(item.if);
                return item.if === 'true' ? this.handleSrc(item) : this.doSkip(item);
              }
              // ???????????????????????????????????????, ?????????????????? cancelled
              if (this.record.status === STEP_STATUS.CANCEL) return this.doCancel(item);
              // ?????????????????????????????????????????????failure????????????????????????, ?????????????????? skipped
              if (this.record.status === STEP_STATUS.FAILURE) {
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
        .onTransition((state) => {
          this.logger?.debug(`step: ${state.value}`);
        })
        .start();
      stepService.send('INIT');
    });
  }
  private getLogger(filePath: string) {
    const logConfig = this.options.logConfig as ILogConfig;
    const { customLogger, logPrefix, logLevel } = logConfig;
    const { inputs } = this.options;
    if (customLogger) {
      return (this.logger = customLogger);
    }
    return new EngineLogger({
      file: logPrefix && path.join(logPrefix, filePath),
      level: logLevel,
      secrets: inputs?.secrets ? values(inputs.secrets) : undefined,
    });
  }
  private async doOss(filePath: string) {
    const logConfig = this.options.logConfig as ILogConfig;
    const { logPrefix, ossConfig } = logConfig;
    if (ossConfig && logPrefix) {
      await this.logger.oss({
        ...ossConfig,
        codeUri: path.join(logPrefix, filePath),
      });
    }
  }
  private async doPreRun(stepCount: string) {
    const { events } = this.options;
    const data = find(this.context.steps, (obj) => obj.stepCount === stepCount);
    await events?.onPreRun?.(data as ISteps, this.context, this.logger);
  }
  private async doPostRun(item: IStepOptions) {
    const { events } = this.options;
    const data = find(this.context.steps, (obj) => obj.stepCount === item.stepCount);
    try {
      await events?.onPostRun?.(data as ISteps, this.context, this.logger);
    } catch (error) {
      outputLog(this.logger, error);
    }
  }
  private recordContext(item: IStepOptions, options: Record<string, any>) {
    const { status, error, outputs, name, process_time } = options;
    const { events } = this.options;

    this.context.stepCount = item.stepCount as string;

    this.context.steps = map(this.context.steps, (obj) => {
      if (obj.stepCount === item.stepCount) {
        if (status) {
          obj.status = status;
        }
        if (error) {
          obj.error = error;
          this.context.error = error;
        }
        if (outputs) {
          obj.outputs = outputs;
        }
        if (name) {
          obj.name = name;
        }
        if (has(options, 'process_time')) {
          obj.process_time = process_time;
        }
      }
      return obj;
    });
    if (!this.record.isInit) {
      this.record.isInit = true;
      this.context.steps = concat(this.record.initData, this.context.steps);
    }
  }
  cancel() {
    this.record.status = STEP_STATUS.CANCEL;
    this.record.editStatusAble = false;
    // kill child process, ????????????????????????????????????????????????cancelled
    each(this.childProcess, (item) => {
      item.kill();
    });
  }
  private getFilterContext() {
    const { inputs } = this.options;
    const { env = {}, secrets = {} } = this.context;
    return {
      ...inputs,
      status: this.context.status,
      steps: this.record.steps,
      env: { ...inputs?.env, ...env },
      secrets,
    };
  }
  private async doCompleted() {
    this.context.completed = true;
    const filePath = getLogPath(COMPLETED_STEP_COUNT);
    this.logger = this.getLogger(filePath);
    this.logger.info(DEFAULT_COMPLETED_LOG);
    const { events } = this.options;
    if (isFunction(events?.onCompleted)) {
      try {
        await events?.onCompleted?.(this.context, this.logger);
      } catch (error) {
        outputLog(this.logger, error);
      }
    }
    await this.doOss(filePath);
  }
  private async handleSrc(item: IStepOptions) {
    try {
      await this.doPreRun(item.stepCount as string);
      const response: any = await this.doSrc(item);
      // ??????????????????if???????????????????????????????????????, ?????????????????? cancelled
      const isCancel = item.if !== 'true' && this.record.status === STEP_STATUS.CANCEL;
      if (isCancel) return this.doCancel(item);
      // ???????????????????????????
      if (this.record.editStatusAble) {
        this.record.status = STEP_STATUS.SUCCESS;
      }
      // id ????????????
      if (item.id) {
        this.record.steps = {
          ...this.record.steps,
          [item.id]: {
            status: STEP_STATUS.SUCCESS,
            outputs: response,
          },
        };
      }
      const process_time = getProcessTime(this.record.startTime);
      this.recordContext(item, { status: STEP_STATUS.SUCCESS, outputs: response, process_time });
      await this.doPostRun(item);
      await this.doOss(getLogPath(item.stepCount as string));
    } catch (error: any) {
      const status =
        item['continue-on-error'] === true ? STEP_STATUS.ERROR_WITH_CONTINUE : STEP_STATUS.FAILURE;
      // ???????????????????????????
      if (this.record.editStatusAble) {
        this.record.status = status as IStatus;
      }
      if (status === STEP_STATUS.FAILURE) {
        // ???????????????????????????????????????????????????
        this.record.editStatusAble = false;
      }
      if (item.id) {
        this.record.steps = {
          ...this.record.steps,
          [item.id]: {
            status,
          },
        };
      }
      const process_time = getProcessTime(this.record.startTime);
      const logPath = getLogPath(item.stepCount as string);
      if (item['continue-on-error']) {
        this.recordContext(item, { status, process_time });
        await this.doOss(logPath);
      } else {
        this.recordContext(item, { status, error, process_time });
        outputLog(this.logger, error);
        await this.doOss(logPath);
        throw error;
      }
    }
  }
  private async doSrc(item: IStepOptions) {
    const runItem = item as IRunOptions;
    const pluginItem = item as IPluginOptions;
    const scriptItem = item as IScriptOptions;
    // run
    if (runItem.run) {
      let execPath = runItem['working-directory'] || this.context.cwd;
      execPath = path.isAbsolute(execPath) ? execPath : path.join(this.context.cwd, execPath);
      this.logName(item);
      runItem.run = this.doArtTemplateCompile(runItem.run);
      const cp = command(runItem.run, { cwd: execPath, env: this.parseEnv(runItem), shell: true });
      this.childProcess.push(cp);
      const res = await this.onFinish(cp);
      return res;
    }
    // plugin
    if (pluginItem.plugin) {
      this.logName(item);
      // onInit???????????????plugin??????
      const app = require(getPluginRequirePath(pluginItem.plugin));
      const newContext = { ...this.context, $variables: this.getFilterContext() };
      return pluginItem.type === 'run'
        ? await app.run(get(pluginItem, 'inputs', {}), newContext, this.logger)
        : await app.postRun(get(pluginItem, 'inputs', {}), newContext, this.logger);
    }
    // script
    if (scriptItem.script) {
      this.logName(item);
      return await this.doScript(scriptItem);
    }
  }
  private parseEnv(item: IRunOptions) {
    const { inputs } = this.options;
    const newEnv = { ...inputs?.env, ...item.env };
    for (const key in newEnv) {
      const val = newEnv[key];
      newEnv[key] = this.doArtTemplateCompile(val);
    }
    return newEnv;
  }
  private doArtTemplateCompile(value: string) {
    const newVal = replace(value, /\${{/g, '{{');
    return artTemplate.compile(newVal)(this.getFilterContext());
  }
  private async doScript(item: IScriptOptions) {
    const newScript = path.isAbsolute(item.script)
      ? item.script
      : path.join(this.context.cwd, item.script);
    // ???????????? or ????????????
    item.script = fs.existsSync(newScript) ? fs.readFileSync(newScript, 'utf-8') : item.script;
    item.script = this.doArtTemplateCompile(item.script);
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
    // id ????????????
    if (item.id) {
      this.record.steps = {
        ...this.record.steps,
        [item.id]: {
          status: STEP_STATUS.SKIP,
        },
      };
    }
    this.logName(item);
    this.recordContext(item, { status: STEP_STATUS.SKIP, process_time: 0 });
    await this.doOss(getLogPath(item.stepCount as string));
    return Promise.resolve();
  }
  private async doCancel(item: IStepOptions) {
    // id ????????????
    if (item.id) {
      this.record.steps = {
        ...this.record.steps,
        [item.id]: {
          status: STEP_STATUS.CANCEL,
        },
      };
    }
    this.logName(item);
    this.recordContext(item, { status: STEP_STATUS.CANCEL, process_time: 0 });
    await this.doOss(getLogPath(item.stepCount as string));
    return Promise.resolve();
  }
  private doWarn() {
    const { inputs = {} } = this.options;
    let msg = '';
    if (inputs.steps) {
      msg = 'steps is a built-in fields, and the steps field in the inputs will be ignored.';
    }
    msg && this.logger.warn(msg);
  }
  private logName(item: IStepOptions) {
    // ?????? step ??????
    const runItem = item as IRunOptions;
    const pluginItem = item as IPluginOptions;
    const scriptItem = item as IScriptOptions;
    let msg = '';
    if (runItem.run) {
      msg = runItem.name || `Run ${runItem.run}`;
    }
    if (pluginItem.plugin) {
      msg =
        pluginItem.name || `${pluginItem.type === 'run' ? 'Run' : 'Post Run'} ${pluginItem.plugin}`;
    }
    if (scriptItem.script) {
      msg = runItem.name || `Run ${scriptItem.script}`;
    }
    const isSkip = get(this.record, `${item.stepCount}.status`) === STEP_STATUS.SKIP;
    msg = isSkip ? `[skipped] ${msg}` : msg;
    this.recordContext(item, { name: msg });
    this.logger.debug(msg);
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
        code === 0 || this.record.status === STEP_STATUS.CANCEL
          ? resolve({})
          : reject(new Error(Buffer.concat(stderr).toString()));
      });
    });
  }
}

export default Engine;
