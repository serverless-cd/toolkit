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
exports.mark = exports.FileTransport = exports.ConsoleTransport = exports.Transport = exports.formatter = exports.Logger = exports.EngineLogger = void 0;
const egg_logger_1 = require("egg-logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return egg_logger_1.Logger; } });
Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return egg_logger_1.Transport; } });
const chalk_1 = __importDefault(require("chalk"));
const oss_logger_1 = __importDefault(require("./oss-logger"));
const lodash_1 = require("lodash");
const duartionRegexp = /([0-9]+ms)/g;
const categoryRegexp = /(\[[\w\-_.:]+\])/g;
const httpMethodRegexp = /(GET|POST|PUT|PATH|HEAD|DELETE) /g;
function mark(val) {
    return val.length > 8
        ? val.slice(0, 3) + '*'.repeat(val.length - 6) + val.slice(val.length - 3, val.length)
        : '***';
}
exports.mark = mark;
const formatter = (meta) => {
    const metaObj = meta;
    const { secrets = [] } = metaObj;
    let msg = metaObj.message;
    secrets &&
        (0, lodash_1.each)(secrets, (str) => {
            do {
                msg = msg.replace(str, mark(str));
            } while ((0, lodash_1.includes)(msg, str));
        });
    if (metaObj.level === 'ERROR') {
        return chalk_1.default.red(msg);
    }
    else if (metaObj.level === 'WARN') {
        return chalk_1.default.yellow(msg);
    }
    msg = msg.replace(duartionRegexp, chalk_1.default.green('$1'));
    msg = msg.replace(categoryRegexp, chalk_1.default.blue('$1'));
    msg = msg.replace(httpMethodRegexp, chalk_1.default.cyan('$1 '));
    return msg;
};
exports.formatter = formatter;
class _ConsoleTransport extends egg_logger_1.ConsoleTransport {
    constructor(options) {
        super(Object.assign({ formatter: (data) => formatter(Object.assign(Object.assign({}, data), { secrets: options.secrets })) }, options));
    }
}
exports.ConsoleTransport = _ConsoleTransport;
class _FileTransport extends egg_logger_1.FileTransport {
    constructor(options) {
        super(Object.assign({ formatter: (data) => formatter(Object.assign(Object.assign({}, data), { secrets: options.secrets })) }, options));
    }
}
exports.FileTransport = _FileTransport;
class EngineLogger extends egg_logger_1.Logger {
    constructor(props) {
        const { file, level = 'INFO', secrets } = props;
        super({});
        this.set('console', new _ConsoleTransport({
            secrets,
            level,
        }));
        file &&
            this.set('file', new _FileTransport({
                secrets,
                file,
                level,
            }));
    }
    oss(ossConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new oss_logger_1.default(ossConfig).init();
        });
    }
}
exports.EngineLogger = EngineLogger;
//# sourceMappingURL=index.js.map