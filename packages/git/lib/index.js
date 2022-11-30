"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFile = exports.run = void 0;
const checkout_1 = __importDefault(require("./checkout"));
function checkout(config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new checkout_1.default(config).run();
    });
}
exports.default = checkout;
function run(config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new checkout_1.default(config).run();
    });
}
exports.run = run;
var check_file_1 = require("./check-file");
Object.defineProperty(exports, "checkFile", { enumerable: true, get: function () { return __importDefault(check_file_1).default; } });
//# sourceMappingURL=index.js.map