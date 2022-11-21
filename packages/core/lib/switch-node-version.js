"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchNodeVersion = exports.NODE_VERSIONS = void 0;
const lodash_1 = require("lodash");
const DEFAULT_PATH = '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin';
exports.NODE_VERSIONS = {
    '12': 'v12.22.12',
    '16': 'v16.16.0',
};
function switchNodeVersion(version) {
    if ((0, lodash_1.isEqual)(version, '14')) {
        return;
    }
    if (!(0, lodash_1.has)(exports.NODE_VERSIONS, version)) {
        throw new Error(`Version ${version} is not supported`);
    }
    const versionTag = (0, lodash_1.get)(exports.NODE_VERSIONS, version);
    process.env.PATH = `/home/node/.nvm/versions/node/${versionTag}/bin:${process.env.PATH || DEFAULT_PATH}`;
    process.env.NVM_INC = `/home/node/.nvm/versions/node/${versionTag}/include/node`;
    process.env.NVM_BIN = `/home/node/.nvm/versions/node/${versionTag}/bin`;
}
exports.switchNodeVersion = switchNodeVersion;
//# sourceMappingURL=switch-node-version.js.map