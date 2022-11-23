import { IStepOptions } from '../types';
export declare function getLogPath(filePath: string): string;
export declare function getDefaultInitLog(): string;
export declare function getScript(val: string): string;
export declare function getSteps(steps: IStepOptions[], childProcess: any[]): ({
    stepCount: string;
    run: string;
    id?: string | undefined;
    name?: string | undefined;
    if?: string | undefined;
    env?: Record<string, any> | undefined;
    'continue-on-error'?: boolean | undefined;
    'working-directory'?: string | undefined;
} | {
    stepCount: string;
    uses: string;
    id?: string | undefined;
    name?: string | undefined;
    if?: string | undefined;
    env?: Record<string, any> | undefined;
    'continue-on-error'?: boolean | undefined;
    with?: Record<string, any> | undefined;
    type?: "completed" | "run" | "postRun" | undefined;
} | {
    stepCount: string;
    script: string;
    id?: string | undefined;
    name?: string | undefined;
    if?: string | undefined;
    env?: Record<string, any> | undefined;
    'continue-on-error'?: boolean | undefined;
})[];
export declare function getProcessTime(time: number): number;
/**
 * @desc 执行shell指令，主要处理 >,>>,||,|,&&等case,直接加shell:true的参数
 * @param runStr 执行指令的字符串
 * @param options
 */
export declare function runScript(runStr: string, options: any): import("execa").ExecaChildProcess<string>;
