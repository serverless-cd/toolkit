/// <reference types="node" />
declare class ServerlesCd {
    [key: string]: any;
    constructor();
    set(key: string, value: any): void;
    get(key: string): any;
}
export interface IServerlesCd extends NodeJS.Process {
    SERVERLESS_CD: ServerlesCd;
}
export declare function getServerlessCdVariable(key: string): any;
export declare function setServerlessCdVariable(key: string, value: any): void;
export declare function setEnvVariable(key: string, value: string): void;
export declare function getEnvVariable(key: string): string | undefined;
export {};
