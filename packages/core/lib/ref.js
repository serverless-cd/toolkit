"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRef = exports.getRef = void 0;
const lodash_1 = require("lodash");
function getRef(config) {
    const { type, value } = config;
    if (type === 'branch') {
        return `refs/heads/${value}`;
    }
    if (type === 'tag') {
        return `refs/tags/${value}`;
    }
    throw new Error(`Unsupported type: ${type}`);
}
exports.getRef = getRef;
function parseRef(ref) {
    if ((0, lodash_1.startsWith)(ref, 'refs/heads/')) {
        return {
            type: 'branch',
            value: (0, lodash_1.replace)(ref, 'refs/heads/', ''),
        };
    }
    if ((0, lodash_1.startsWith)(ref, 'refs/tags/')) {
        return {
            type: 'tag',
            value: (0, lodash_1.replace)(ref, 'refs/tags/', ''),
        };
    }
    throw new Error(`Unsupported ref: ${ref}`);
}
exports.parseRef = parseRef;
//# sourceMappingURL=ref.js.map