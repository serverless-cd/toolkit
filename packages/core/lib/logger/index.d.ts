/// <reference types="ali-oss" />
import { Logger, FileTransport, ConsoleTransport, Transport, LoggerLevel, ConsoleTransportOptions, FileTransportOptions } from 'egg-logger';
import { IOssConfig } from './oss-logger';
interface MyConsoleTransportOptions extends ConsoleTransportOptions {
    secrets?: string[];
}
interface MyFileTransportOptions extends FileTransportOptions {
    secrets?: string[];
}
declare function mark(val: string): string;
declare const formatter: (meta?: object) => string;
declare class _ConsoleTransport extends ConsoleTransport {
    constructor(options: MyConsoleTransportOptions);
}
declare class _FileTransport extends FileTransport {
    constructor(options: MyFileTransportOptions);
}
interface IProps {
    file?: string;
    level?: LoggerLevel;
    secrets?: string[];
}
declare class EngineLogger extends Logger {
    constructor(props: IProps);
    oss(ossConfig: IOssConfig): Promise<import("ali-oss")>;
}
export { EngineLogger, Logger, formatter, Transport, _ConsoleTransport as ConsoleTransport, _FileTransport as FileTransport, IOssConfig, LoggerLevel, mark, };
