import { IConfig } from './types';
export default function checkout(config: IConfig): Promise<void>;
export declare function run(config: IConfig): Promise<void>;
export { default as checkFile } from './check-file';
