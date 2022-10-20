import Checkout from './checkout';
import { IConfig } from './types';

export default async function checkout(config: IConfig) {
  await new Checkout(config).run();
}

export async function run(config: IConfig) {
  await new Checkout(config).run();
}

export { default as checkFile } from './check-file';
