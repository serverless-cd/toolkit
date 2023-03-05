import Checkout from './checkout';
import { IConfig } from './types';
import initConfig from './init-config';
import addCommit from './add-commit';
import setRemote from './set-remote';
import push from './push';

export default async function checkout(config: IConfig) {
  await new Checkout(config).run();
}

export async function run(config: IConfig) {
  await new Checkout(config).run();
}

export { initConfig, addCommit, setRemote, push };

export { default as checkFile } from './check-file';
