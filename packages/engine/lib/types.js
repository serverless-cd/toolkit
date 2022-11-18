"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STEP_STATUS = exports.STEP_STATUS_BASE = exports.STEP_IF = void 0;
var STEP_IF;
(function (STEP_IF) {
    STEP_IF["SUCCESS"] = "success()";
    STEP_IF["FAILURE"] = "failure()";
    STEP_IF["ALWAYS"] = "always()";
    STEP_IF["CANCEL"] = "cancelled()";
})(STEP_IF = exports.STEP_IF || (exports.STEP_IF = {}));
var STEP_STATUS_BASE;
(function (STEP_STATUS_BASE) {
    STEP_STATUS_BASE["SUCCESS"] = "success";
    STEP_STATUS_BASE["FAILURE"] = "failure";
    STEP_STATUS_BASE["CANCEL"] = "cancelled";
    STEP_STATUS_BASE["RUNNING"] = "running";
    STEP_STATUS_BASE["PENING"] = "pending";
    STEP_STATUS_BASE["ERROR_WITH_CONTINUE"] = "error-with-continue";
})(STEP_STATUS_BASE = exports.STEP_STATUS_BASE || (exports.STEP_STATUS_BASE = {}));
var STEP_STATUS_SKIP;
(function (STEP_STATUS_SKIP) {
    STEP_STATUS_SKIP["SKIP"] = "skipped";
})(STEP_STATUS_SKIP || (STEP_STATUS_SKIP = {}));
exports.STEP_STATUS = Object.assign(Object.assign({}, STEP_STATUS_BASE), STEP_STATUS_SKIP);
//# sourceMappingURL=types.js.map