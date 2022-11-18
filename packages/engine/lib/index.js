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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@serverless-cd/core");
const xstate_1 = require("xstate");
const types_1 = require("./types");
const lodash_1 = require("lodash");
const execa_1 = require("execa");
const path = __importStar(require("path"));
const os = __importStar(require("os"));
// @ts-ignore
const zx = __importStar(require("@serverless-cd/zx"));
const utils_1 = require("./utils");
const constants_1 = require("./constants");
class Engine {
    constructor(options) {
        this.options = options;
        this.childProcess = [];
        this.context = { status: types_1.STEP_STATUS.PENING, completed: false };
        this.record = { status: types_1.STEP_STATUS.PENING, editStatusAble: true };
        const { inputs } = options;
        this.context.inputs = inputs;
        this.context.secrets = inputs === null || inputs === void 0 ? void 0 : inputs.secrets;
    }
    doInit() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = this.options;
            this.context.status = types_1.STEP_STATUS.RUNNING;
            if (!(0, lodash_1.isFunction)(events === null || events === void 0 ? void 0 : events.onInit))
                return;
            const startTime = Date.now();
            const filePath = (0, utils_1.getLogPath)(constants_1.INIT_STEP_COUNT);
            this.logger = this.getLogger(filePath);
            this.logger.info((0, utils_1.getDefaultInitLog)());
            try {
                const res = yield ((_a = events === null || events === void 0 ? void 0 : events.onInit) === null || _a === void 0 ? void 0 : _a.call(events, this.context, this.logger));
                const process_time = (0, utils_1.getProcessTime)(startTime);
                this.record.initData = {
                    name: (0, lodash_1.get)(res, 'name', constants_1.INIT_STEP_NAME),
                    status: types_1.STEP_STATUS.SUCCESS,
                    process_time,
                    stepCount: constants_1.INIT_STEP_COUNT,
                    outputs: res,
                };
                yield this.doOss(filePath);
                return res;
            }
            catch (error) {
                this.logger.debug(error);
                this.context.status = this.record.status = types_1.STEP_STATUS.FAILURE;
                const process_time = (0, utils_1.getProcessTime)(startTime);
                this.record.initData = {
                    name: constants_1.INIT_STEP_NAME,
                    status: types_1.STEP_STATUS.FAILURE,
                    process_time,
                    stepCount: constants_1.INIT_STEP_COUNT,
                    error,
                };
                yield this.doOss(filePath);
            }
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const initValue = yield this.doInit();
            // 优先读取 doInit 返回的 steps 数据，其次 行参里的 steps 数据
            const steps = (0, utils_1.getSteps)((initValue === null || initValue === void 0 ? void 0 : initValue.steps) || this.options.steps, this.childProcess);
            if ((0, lodash_1.isEmpty)(steps)) {
                throw new Error('steps is empty, please check your config');
            }
            this.context.steps = (0, lodash_1.map)(steps, (item) => {
                item.status = types_1.STEP_STATUS.PENING;
                return item;
            });
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const states = {
                    init: {
                        on: {
                            INIT: (0, lodash_1.get)(steps, '[0].stepCount'),
                        },
                    },
                    final: {
                        type: 'final',
                        invoke: {
                            src: () => __awaiter(this, void 0, void 0, function* () {
                                // 执行终态是 error-with-continue 的时候，改为 success
                                const status = this.record.status === types_1.STEP_STATUS.ERROR_WITH_CONTINUE
                                    ? types_1.STEP_STATUS.SUCCESS
                                    : this.record.status;
                                this.context.status = status;
                                yield this.doCompleted();
                                resolve(this.context);
                            }),
                        },
                    },
                };
                (0, lodash_1.each)(steps, (item, index) => {
                    const target = steps[index + 1] ? (0, lodash_1.get)(steps, `[${index + 1}].stepCount`) : 'final';
                    states[item.stepCount] = {
                        invoke: {
                            id: item.stepCount,
                            src: () => __awaiter(this, void 0, void 0, function* () {
                                this.record.startTime = Date.now();
                                // logger
                                this.logger = this.getLogger((0, utils_1.getLogPath)(item.stepCount));
                                // 记录 context
                                this.recordContext(item, { status: types_1.STEP_STATUS.RUNNING });
                                // 记录环境变量
                                this.context.env = item.env;
                                this.doReplace$(item);
                                // 先判断if条件，成功则执行该步骤。
                                if (item.if) {
                                    // 替换 failure()
                                    item.if = (0, lodash_1.replace)(item.if, types_1.STEP_IF.FAILURE, this.record.status === types_1.STEP_STATUS.FAILURE ? 'true' : 'false');
                                    // 替换 success()
                                    item.if = (0, lodash_1.replace)(item.if, types_1.STEP_IF.SUCCESS, this.record.status !== types_1.STEP_STATUS.FAILURE ? 'true' : 'false');
                                    // 替换 cancelled()
                                    item.if = (0, lodash_1.replace)(item.if, types_1.STEP_IF.CANCEL, this.record.status === types_1.STEP_STATUS.CANCEL ? 'true' : 'false');
                                    // 替换 always()
                                    item.if = (0, lodash_1.replace)(item.if, types_1.STEP_IF.ALWAYS, 'true');
                                    const ifCondition = core_1.artTemplate.compile(item.if);
                                    item.if = ifCondition(this.getFilterContext());
                                    return item.if === 'true' ? this.handleSrc(item) : this.doSkip(item);
                                }
                                // 如果已取消，则不执行该步骤, 并记录状态为 cancelled
                                if (this.record.status === types_1.STEP_STATUS.CANCEL)
                                    return this.doCancel(item);
                                // 其次检查全局的执行状态，如果是failure，则不执行该步骤, 并记录状态为 skipped
                                if (this.record.status === types_1.STEP_STATUS.FAILURE) {
                                    return this.doSkip(item);
                                }
                                return this.handleSrc(item);
                            }),
                            onDone: {
                                target,
                            },
                            onError: target,
                        },
                    };
                });
                const fetchMachine = (0, xstate_1.createMachine)({
                    predictableActionArguments: true,
                    id: 'step',
                    initial: 'init',
                    states,
                });
                const stepService = (0, xstate_1.interpret)(fetchMachine)
                    .onTransition((state) => {
                    var _a;
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.debug(`step: ${state.value}`);
                })
                    .start();
                stepService.send('INIT');
            }));
        });
    }
    getLogger(filePath) {
        const logConfig = this.options.logConfig;
        const { customLogger, logPrefix, logLevel } = logConfig;
        const { inputs } = this.options;
        if (customLogger) {
            return (this.logger = customLogger);
        }
        return new core_1.EngineLogger({
            file: logPrefix && path.join(logPrefix, filePath),
            level: logLevel,
            secrets: (inputs === null || inputs === void 0 ? void 0 : inputs.secrets) ? (0, lodash_1.values)(inputs.secrets) : undefined,
        });
    }
    doOss(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const logConfig = this.options.logConfig;
            const { logPrefix, ossConfig } = logConfig;
            if (ossConfig && logPrefix) {
                yield this.logger.oss(Object.assign(Object.assign({}, ossConfig), { codeUri: path.join(logPrefix, filePath) }));
            }
        });
    }
    doPreRun(stepCount) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = this.options;
            const data = (0, lodash_1.find)(this.context.steps, (obj) => obj.stepCount === stepCount);
            yield ((_a = events === null || events === void 0 ? void 0 : events.onPreRun) === null || _a === void 0 ? void 0 : _a.call(events, data, this.context, this.logger));
        });
    }
    doPostRun(item) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { events } = this.options;
            const data = (0, lodash_1.find)(this.context.steps, (obj) => obj.stepCount === item.stepCount);
            try {
                yield ((_a = events === null || events === void 0 ? void 0 : events.onPostRun) === null || _a === void 0 ? void 0 : _a.call(events, data, this.context, this.logger));
            }
            catch (error) {
                this.logger.error(`onPostRun error at step: ${JSON.stringify(item)}`);
                this.logger.debug(error);
            }
        });
    }
    doReplace$(item) {
        const runItem = item;
        const scriptItem = item;
        const fn = (str) => (0, lodash_1.replace)(str, /\${{/g, '{{');
        if (runItem.run) {
            runItem.run = fn(runItem.run);
        }
        if (scriptItem.script) {
            scriptItem.script = fn(scriptItem.script);
        }
        if (item.if) {
            item.if = fn(item.if);
        }
    }
    recordContext(item, options) {
        const { status, error, outputs, name, process_time } = options;
        const { events } = this.options;
        this.context.stepCount = item.stepCount;
        this.context.steps = (0, lodash_1.map)(this.context.steps, (obj) => {
            if (obj.stepCount === item.stepCount) {
                if (status) {
                    obj.status = status;
                }
                if (error) {
                    obj.error = error;
                }
                if (outputs) {
                    obj.outputs = outputs;
                }
                if (name) {
                    obj.name = name;
                }
                if ((0, lodash_1.has)(options, 'process_time')) {
                    obj.process_time = process_time;
                }
            }
            return obj;
        });
        if ((0, lodash_1.isFunction)(events === null || events === void 0 ? void 0 : events.onInit) && !this.record.isInit) {
            this.record.isInit = true;
            this.context.steps = (0, lodash_1.concat)(this.record.initData, this.context.steps);
        }
    }
    cancel() {
        this.record.status = types_1.STEP_STATUS.CANCEL;
        this.record.editStatusAble = false;
        // kill child process, 后续的步骤正常执行，但状态标记为cancelled
        (0, lodash_1.each)(this.childProcess, (item) => {
            item.kill();
        });
    }
    getFilterContext() {
        const { inputs } = this.options;
        const { env = {}, secrets = {} } = this.context;
        return Object.assign(Object.assign({}, inputs), { steps: this.record.steps, env: Object.assign(Object.assign({}, inputs === null || inputs === void 0 ? void 0 : inputs.env), env), secrets });
    }
    doCompleted() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.context.completed = true;
            const filePath = (0, utils_1.getLogPath)(constants_1.COMPLETED_STEP_COUNT);
            this.logger = this.getLogger(filePath);
            this.logger.info(constants_1.DEFAULT_COMPLETED_LOG);
            const { events } = this.options;
            if ((0, lodash_1.isFunction)(events === null || events === void 0 ? void 0 : events.onCompleted)) {
                try {
                    yield ((_a = events === null || events === void 0 ? void 0 : events.onCompleted) === null || _a === void 0 ? void 0 : _a.call(events, this.context, this.logger));
                }
                catch (error) {
                    this.logger.error(`onCompleted error`);
                    this.logger.debug(error);
                }
            }
            yield this.doOss(filePath);
        });
    }
    handleSrc(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doPreRun(item.stepCount);
                const response = yield this.doSrc(item);
                // 如果已取消且if条件不成功，则不执行该步骤, 并记录状态为 cancelled
                const isCancel = item.if !== 'true' && this.record.status === types_1.STEP_STATUS.CANCEL;
                if (isCancel)
                    return this.doCancel(item);
                // 记录全局的执行状态
                if (this.record.editStatusAble) {
                    this.record.status = types_1.STEP_STATUS.SUCCESS;
                }
                // id 添加状态
                if (item.id) {
                    this.record.steps = Object.assign(Object.assign({}, this.record.steps), { [item.id]: {
                            status: types_1.STEP_STATUS.SUCCESS,
                            outputs: response,
                        } });
                }
                const process_time = (0, utils_1.getProcessTime)(this.record.startTime);
                this.recordContext(item, { status: types_1.STEP_STATUS.SUCCESS, outputs: response, process_time });
                yield this.doPostRun(item);
                yield this.doOss((0, utils_1.getLogPath)(item.stepCount));
            }
            catch (error) {
                const status = item['continue-on-error'] === true ? types_1.STEP_STATUS.ERROR_WITH_CONTINUE : types_1.STEP_STATUS.FAILURE;
                // 记录全局的执行状态
                if (this.record.editStatusAble) {
                    this.record.status = status;
                }
                if (status === types_1.STEP_STATUS.FAILURE) {
                    // 全局的执行状态一旦失败，便不可修改
                    this.record.editStatusAble = false;
                }
                if (item.id) {
                    this.record.steps = Object.assign(Object.assign({}, this.record.steps), { [item.id]: {
                            status,
                        } });
                }
                const process_time = (0, utils_1.getProcessTime)(this.record.startTime);
                const logPath = (0, utils_1.getLogPath)(item.stepCount);
                if (item['continue-on-error']) {
                    this.recordContext(item, { status, process_time });
                    yield this.doOss(logPath);
                }
                else {
                    this.recordContext(item, { status, error, process_time });
                    this.logger.error(`error at step: ${JSON.stringify(item)}`);
                    this.logger.debug(error);
                    yield this.doOss(logPath);
                    throw error;
                }
            }
        });
    }
    doSrc(_item) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cwd = process.cwd() } = this.options;
            const item = Object.assign({}, _item);
            const runItem = item;
            const usesItem = item;
            const scriptItem = item;
            // run
            if (runItem.run) {
                let execPath = runItem['working-directory'] || cwd;
                execPath = path.isAbsolute(execPath) ? execPath : path.join(cwd, execPath);
                this.logName(_item);
                const ifCondition = core_1.artTemplate.compile(runItem.run);
                runItem.run = ifCondition(this.getFilterContext());
                const cp = (0, execa_1.command)(runItem.run, { cwd: execPath });
                this.childProcess.push(cp);
                const res = yield this.onFinish(cp);
                return res;
            }
            // uses
            if (usesItem.uses) {
                this.logName(item);
                // 本地路径调试时，不在安装依赖
                if (!core_1.fs.existsSync(usesItem.uses)) {
                    const cp = (0, execa_1.command)(`npm i ${usesItem.uses} --no-save`);
                    this.childProcess.push(cp);
                    yield this.onFinish(cp);
                }
                const app = require(usesItem.uses);
                const newContext = Object.assign(Object.assign({}, this.context), { $variables: this.getFilterContext() });
                return usesItem.type === 'run'
                    ? yield app.run((0, lodash_1.get)(usesItem, 'inputs', {}), newContext, this.logger)
                    : yield app.postRun((0, lodash_1.get)(usesItem, 'inputs', {}), newContext, this.logger);
            }
            // script
            if (scriptItem.script) {
                this.logName(item);
                return yield this.doScript(scriptItem);
            }
        });
    }
    doScript(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // 文件路径
            if (core_1.fs.existsSync(item.script)) {
                item.script = core_1.fs.readFileSync(item.script, 'utf-8');
            }
            const ifCondition = core_1.artTemplate.compile(item.script);
            item.script = ifCondition(this.getFilterContext());
            const script = (0, utils_1.getScript)(item.script);
            try {
                const fun = new Function(script);
                const run = fun();
                yield run(Object.assign(Object.assign({}, zx), { os, path, logger: this.logger }));
                return Promise.resolve({});
            }
            catch (err) {
                const errorMsg = err.toString();
                this.logger.info(errorMsg);
                return Promise.reject(errorMsg);
            }
        });
    }
    doSkip(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // id 添加状态
            if (item.id) {
                this.record.steps = Object.assign(Object.assign({}, this.record.steps), { [item.id]: {
                        status: types_1.STEP_STATUS.SKIP,
                    } });
            }
            this.logName(item);
            this.recordContext(item, { status: types_1.STEP_STATUS.SKIP, process_time: 0 });
            yield this.doOss((0, utils_1.getLogPath)(item.stepCount));
            return Promise.resolve();
        });
    }
    doCancel(item) {
        return __awaiter(this, void 0, void 0, function* () {
            // id 添加状态
            if (item.id) {
                this.record.steps = Object.assign(Object.assign({}, this.record.steps), { [item.id]: {
                        status: types_1.STEP_STATUS.CANCEL,
                    } });
            }
            this.logName(item);
            this.recordContext(item, { status: types_1.STEP_STATUS.CANCEL, process_time: 0 });
            yield this.doOss((0, utils_1.getLogPath)(item.stepCount));
            return Promise.resolve();
        });
    }
    doWarn() {
        const { inputs = {} } = this.options;
        let msg = '';
        if (inputs.steps) {
            msg = 'steps is a built-in fields, and the steps field in the inputs will be ignored.';
        }
        msg && this.logger.warn(msg);
    }
    logName(item) {
        // 打印 step 名称
        const runItem = item;
        const usesItem = item;
        const scriptItem = item;
        let msg = '';
        if (runItem.run) {
            msg = runItem.name || `Run ${runItem.run}`;
        }
        if (usesItem.uses) {
            msg = usesItem.name || `${usesItem.type === 'run' ? 'Run' : 'Post Run'} ${usesItem.uses}`;
        }
        if (scriptItem.script) {
            msg = runItem.name || `Run ${scriptItem.script}`;
        }
        const isSkip = (0, lodash_1.get)(this.record, `${item.stepCount}.status`) === types_1.STEP_STATUS.SKIP;
        msg = isSkip ? `[skipped] ${msg}` : msg;
        this.recordContext(item, { name: msg });
        this.logger.debug(msg);
        this.doWarn();
    }
    onFinish(cp) {
        return new Promise((resolve, reject) => {
            const stdout = [];
            const stderr = [];
            cp.stdout.on('data', (chunk) => {
                this.logger.info(chunk.toString());
                stdout.push(chunk);
            });
            cp.stderr.on('data', (chunk) => {
                this.logger.info(chunk.toString());
                stderr.push(chunk);
            });
            cp.on('exit', (code) => {
                code === 0 || this.record.status === types_1.STEP_STATUS.CANCEL
                    ? resolve({})
                    : reject(new Error(Buffer.concat(stderr).toString()));
            });
        });
    }
}
exports.default = Engine;
//# sourceMappingURL=index.js.map