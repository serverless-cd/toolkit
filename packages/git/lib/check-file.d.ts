import { IProvider } from './types';
interface IConfig {
    token: string;
    provider: IProvider;
    owner: string;
    clone_url: string;
    ref: string;
    file: string;
}
declare function checkFile(config: IConfig): Promise<boolean>;
export default checkFile;
