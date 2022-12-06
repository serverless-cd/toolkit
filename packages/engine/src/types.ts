import { IOssConfig, LoggerLevel } from '@serverless-cd/core';
export interface IEngineOptions {
  steps?: IStepOptions[];
  inputs?: Record<string, any>;
  logConfig?: ILogConfig;
  cwd?: string; // 当前工作目录
  events?: IEvent;
}

interface IEvent {
  onPreRun?: (data: Record<string, any>, context: IContext, logger: any) => Promise<void>;
  onPostRun?: (data: Record<string, any>, context: IContext, logger: any) => Promise<void>;
  onSuccess?: (context: IContext, logger: any) => Promise<void>;
  onFailure?: (context: IContext, logger: any) => Promise<void>;
  onCancelled?: (context: IContext, logger: any) => Promise<void>;
  onCompleted?: (context: IContext, logger: any) => Promise<void>;
  onInit?: (context: IContext, logger: any) => Promise<any>;
}

export interface ILogConfig {
  logPrefix?: string;
  logLevel?: LoggerLevel;
  ossConfig?: IOssConfig;
  customLogger?: any;
}
export interface IRunOptions {
  run: string;
  stepCount?: string;
  id?: string;
  name?: string;
  if?: string;
  env?: Record<string, any>;
  'continue-on-error'?: boolean;
  'working-directory'?: string;
}

export interface IScriptOptions {
  script: string;
  stepCount?: string;
  id?: string;
  name?: string;
  if?: string;
  env?: Record<string, any>;
  'continue-on-error'?: boolean;
}

export interface IPluginOptions {
  plugin: string;
  stepCount?: string;
  id?: string;
  name?: string;
  if?: string;
  env?: Record<string, any>;
  'continue-on-error'?: boolean;
  inputs?: Record<string, any>;
  type?: 'run' | 'postRun'; //内部处理 用于区分是run还是postRun
}

export type IStepOptions = IRunOptions | IPluginOptions | IScriptOptions;

export enum STEP_IF {
  SUCCESS = 'success()',
  FAILURE = 'failure()',
  ALWAYS = 'always()',
  CANCEL = 'cancelled()',
}

export enum STEP_STATUS_BASE {
  SUCCESS = 'success',
  FAILURE = 'failure',
  CANCEL = 'cancelled',
  RUNNING = 'running',
  PENING = 'pending',
  ERROR_WITH_CONTINUE = 'error-with-continue',
}

export type IStatus = `${STEP_STATUS_BASE}`;

enum STEP_STATUS_SKIP {
  SKIP = 'skipped',
}

export const STEP_STATUS = { ...STEP_STATUS_BASE, ...STEP_STATUS_SKIP };

export type ISteps = IStepOptions & {
  status?: string;
  error?: Error;
  outputs?: Record<string, any>;
  name?: string; // step title
  process_time?: number;
};

export interface IRecord {
  editStatusAble: boolean; // 记录全局的执行状态是否可修改（一旦失败，便不可修改）
  steps: Record<string, any>; // 记录每个 step 的执行状态以及输出，后续step可以通过steps[$step_id].outputs使用该数据
  status: IStatus; // 记录step的状态
  startTime: number; // 记录step的开始时间
  initData: Record<string, any>; // 记录初始化数据
  isInit: boolean; // 是否将初始化的数据放到context.steps中
}

export interface IContext {
  cwd: string; // 当前工作目录
  stepCount: string; // 记录当前执行的step
  steps: ISteps[];
  env: Record<string, any>; // 记录合并后的环境变量
  secrets: Record<string, any>;
  status: IStatus; // 记录task的状态
  completed: boolean; // 记录task是否执行完成
  inputs: Record<string, any>; // 记录inputs的输入(魔法变量)
  error: Error; // 记录step的错误信息
}
