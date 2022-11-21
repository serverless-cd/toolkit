import OssClient from 'ali-oss';
export interface IOssConfig extends OssClient.Options {
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    region: string;
    codeUri?: string;
}
declare class OssLogger {
    private config;
    private client;
    constructor(config: IOssConfig);
    init(): Promise<OssClient>;
    put(): Promise<void>;
    updateRegion(): Promise<void>;
    getOrCreateBucket(): Promise<void>;
}
export default OssLogger;
