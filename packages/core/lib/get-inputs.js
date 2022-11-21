"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputs = void 0;
const lodash_1 = require("lodash");
const art_template_1 = __importDefault(require("art-template"));
function getInputs(inputs, context) {
    if ((0, lodash_1.isEmpty)(inputs))
        return;
    function deepCopy(obj) {
        let result = obj.constructor === Array ? [] : {};
        if (typeof obj === 'object') {
            for (var i in obj) {
                let val = obj[i];
                if (typeof val === 'string') {
                    val = (0, lodash_1.replace)(val, /\${{/g, '{{');
                    const compile = art_template_1.default.compile(val);
                    val = compile(context['$variables']);
                }
                result[i] = typeof val === 'object' ? deepCopy(val) : val;
            }
        }
        else {
            result = obj;
        }
        return result;
    }
    return deepCopy(inputs);
}
exports.getInputs = getInputs;
//# sourceMappingURL=get-inputs.js.map