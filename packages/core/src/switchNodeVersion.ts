import { get, isEqual, has } from 'lodash';

const DEFAULT_PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';
export const VERSIONS = {
  '12': 'v12.22.12',
  '16': 'v16.16.0',
};

export default function (version: string) {
  if (isEqual(version, '14')) {
    return;
  }
  if (!has(VERSIONS, version)) {
    throw new Error(`Version ${version} is not supported`);
  }

  const versionTag = get(VERSIONS, version);
  process.env.PATH = `/home/node/.nvm/versions/node/${versionTag}/bin:${
    process.env.PATH || DEFAULT_PATH
  }`;
  process.env.NVM_INC = `/home/node/.nvm/versions/node/${versionTag}/include/node`;
  process.env.NVM_BIN = `/home/node/.nvm/versions/node/${versionTag}/bin`;
}
