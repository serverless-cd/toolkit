"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs-extra"));
const lodash_1 = require("lodash");
// 解析配置文件
function parseSpec(filePath) {
    const filename = path.basename(filePath);
    if (!fs.existsSync(filePath)) {
        throw new Error(`${filename} not found`);
    }
    try {
        const res = yaml.load(fs.readFileSync(filePath, 'utf8'));
        return {
            triggers: (0, lodash_1.get)(res, 'triggers'),
            steps: (0, lodash_1.map)((0, lodash_1.get)(res, 'steps'), (step) => {
                step.env = (0, lodash_1.merge)({}, (0, lodash_1.get)(res, 'env'), (0, lodash_1.get)(step, 'env'));
                return step;
            }),
        };
    }
    catch (error) {
        const e = error;
        let message = `${filename} format is incorrect`;
        if (e.message) {
            message += `: ${e.message}`;
        }
        throw new Error(message);
    }
}
exports.default = parseSpec;
//# sourceMappingURL=parse-spec.js.map