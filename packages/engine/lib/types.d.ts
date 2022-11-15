import { IOssConfig, LoggerLevel } from '@serverless-cd/core';
export interface IEngineOptions {
    steps?: IStepOptions[];
    inputs?: Record<string, any>;
    logConfig?: ILogConfig;
    cwd?: string;
    events?: IEvent;
}
interface IEvent {
    onPreRun?: (data: Record<string, any>, context: IContext, logger: any) => Promise<void>;
    onPostRun?: (data: Record<string, any>, context: IContext, logger: any) => Promise<void>;
    onSuccess?: (context: IContext, logger: any) => Promise<void>;
    onFailure?: (context: IContext, logger: any) => Promise<void>;
    onCancelled?: (context: IContext, logger: any) => Promise<void>;
    onCompleted?: (context: IContext, logger: any) => Promise<any>;
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
export interface IUsesOptions {
    uses: string;
    stepCount?: string;
    id?: string;
    name?: string;
    if?: string;
    env?: Record<string, any>;
    'continue-on-error'?: boolean;
    with?: Record<string, any>;
    type?: 'run' | 'postRun' | 'completed';
}
export declare type IStepOptions = IRunOptions | IUsesOptions | IScriptOptions;
export declare enum STEP_IF {
    SUCCESS = "success()",
    FAILURE = "failure()",
    ALWAYS = "always()",
    CANCEL = "cancelled()"
}
export declare enum STEP_STATUS_BASE {
    SUCCESS = "success",
    FAILURE = "failure",
    CANCEL = "cancelled",
    RUNNING = "running",
    PENING = "pending",
    ERROR_WITH_CONTINUE = "error-with-continue"
}
export declare type IStatus = `${STEP_STATUS_BASE}`;
declare enum STEP_STATUS_SKIP {
    SKIP = "skipped"
}
export declare const STEP_STATUS: {
    SKIP: STEP_STATUS_SKIP.SKIP;
    SUCCESS: STEP_STATUS_BASE.SUCCESS;
    FAILURE: STEP_STATUS_BASE.FAILURE;
    CANCEL: STEP_STATUS_BASE.CANCEL;
    RUNNING: STEP_STATUS_BASE.RUNNING;
    PENING: STEP_STATUS_BASE.PENING;
    ERROR_WITH_CONTINUE: STEP_STATUS_BASE.ERROR_WITH_CONTINUE;
};
export declare type ISteps = IStepOptions & {
    status?: string;
    error?: Error;
    outputs?: Record<string, any>;
    name?: string;
    process_time?: number;
};
export interface IRecord {
    editStatusAble: boolean;
    steps: Record<string, any>;
    status: IStatus;
    startTime: number;
    initData: Record<string, any>;
    isInit: boolean;
}
export interface IContext {
    stepCount: string;
    steps: ISteps[];
    env: Record<string, any>;
    secrets: Record<string, any>;
    status: IStatus;
    completed: boolean;
    inputs: Record<string, any>;
}
export {};
