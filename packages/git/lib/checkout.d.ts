import { IConfig } from './types';
declare class Checkout {
    private config;
    private logger;
    private git;
    private existing;
    constructor(config: IConfig);
    run(): Promise<void>;
    init(): Promise<void>;
    private getCloneUrl;
    private clone;
    private checkout;
    private checkInputs;
}
export default Checkout;
