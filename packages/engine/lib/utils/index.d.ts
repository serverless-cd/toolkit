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
