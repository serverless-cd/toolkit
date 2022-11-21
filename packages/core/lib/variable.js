"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVariable = exports.setEnvVariable = exports.setServerlessCdVariable = exports.getServerlessCdVariable = void 0;
class ServerlesCd {
    constructor() { }
    set(key, value) {
        this[key] = value;
    }
    get(key) {
        return this[key];
    }
}
const serverlesCd = new ServerlesCd();
const serverlesCdProcess = process;
if (!serverlesCdProcess.SERVERLESS_CD) {
    serverlesCdProcess.SERVERLESS_CD = serverlesCd;
}
function getServerlessCdVariable(key) {
    return serverlesCd.get(key);
}
exports.getServerlessCdVariable = getServerlessCdVariable;
function setServerlessCdVariable(key, value) {
    serverlesCd.set(key, value);
}
exports.setServerlessCdVariable = setServerlessCdVariable;
function setEnvVariable(key, value) {
    process.env[key] = value;
}
exports.setEnvVariable = setEnvVariable;
function getEnvVariable(key) {
    return process.env[key];
}
exports.getEnvVariable = getEnvVariable;
//# sourceMappingURL=variable.js.map