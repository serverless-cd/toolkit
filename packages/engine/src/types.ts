import { IOssConfig, LoggerLevel } from '@serverless-cd/core';
export interface IEngineOptions {
  steps: IStepOptions[];
  inputs?: IkeyValue;
  logConfig?: ILogConfig;
}

export interface ILogConfig {
  logPrefix?: string;
  logLevel?: LoggerLevel;
  ossConfig?: IOssConfig;
  customLogger?: any;
}
export interface IkeyValue {
  [key: string]: any;
}

export interface IRunOptions {
  run: string;
  stepCount: string;
  id?: string;
  name?: string;
  if?: string;
  env?: IkeyValue;
  'continue-on-error'?: boolean;
  'working-directory'?: string;
}

export interface IScriptOptions {
  script: string;
  stepCount: string;
  id?: string;
  name?: string;
  if?: string;
  env?: IkeyValue;
  'continue-on-error'?: boolean;
}

export interface IUsesOptions {
  uses: string;
  stepCount: string;
  id?: string;
  name?: string;
  if?: string;
  env?: IkeyValue;
  'continue-on-error'?: boolean;
  with?: IkeyValue;
  type?: 'run' | 'postRun'; //内部处理 用于区分是run还是postRun
}

export type IStepOptions = IRunOptions | IUsesOptions | IScriptOptions;

export type IStepsStatus = IStepOptions & { status: string; errorMessage?: string };

export type ISteps = IStepOptions & { status?: string; errorMessage?: string; outputs?: IkeyValue };

export type IStatus = 'success' | 'failure' | 'cancelled' | 'pending' | 'running';
export interface IRecord {
  editStatusAble: boolean; // 记录全局的执行状态是否可修改（一旦失败，便不可修改）
  steps: IkeyValue; // 记录每个 step 的执行状态以及输出，后续step可以通过steps[$step_id].outputs使用该数据
}

export interface IPublicContext {
  status: IStatus; // 记录task的状态
  stepCount: string; // 记录当前执行的step
  steps: ISteps[];
  env: IkeyValue; // 记录合并后的环境变量
}
