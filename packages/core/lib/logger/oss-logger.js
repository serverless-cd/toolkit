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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ali_oss_1 = __importDefault(require("ali-oss"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const walk_sync_1 = __importDefault(require("walk-sync"));
const lodash_1 = require("lodash");
const PUT_BUCKET_CORS = [
    {
        allowedOrigin: '*',
        allowedHeader: '*',
        allowedMethod: ['GET'],
    },
];
class OssLogger {
    constructor(config) {
        this.config = config;
        const { region } = config;
        // 构造oss客户端
        this.client = new ali_oss_1.default(Object.assign(Object.assign({}, config), { region: (0, lodash_1.startsWith)(region, 'oss-') ? region : `oss-${region}` }));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getOrCreateBucket();
            yield this.updateRegion();
            yield this.put();
            return this.client;
        });
    }
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            let { codeUri = '' } = this.config;
            codeUri = path.isAbsolute(codeUri) ? codeUri : path.join(process.cwd(), codeUri);
            const file = fs.statSync(codeUri);
            if (file.isFile()) {
                const filename = path.basename(codeUri);
                console.log(`uploading ${filename} to oss...`);
                yield this.client.put(codeUri, codeUri);
                console.log(`upload ${filename} to oss success`);
                return;
            }
            const paths = (0, walk_sync_1.default)(codeUri);
            for (const p of paths) {
                const fillPath = path.join(codeUri, p);
                const stat = fs.statSync(fillPath);
                if (stat.isFile()) {
                    console.log(`uploading ${p} to oss...`);
                    try {
                        yield this.client.put(fillPath, fillPath);
                    }
                    catch (error) {
                        throw new Error(error.message);
                    }
                }
            }
            console.log('upload finished');
        });
    }
    updateRegion() {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessKeyId, accessKeySecret, bucket } = this.config;
            const location = yield this.client.getBucketLocation(bucket);
            this.client = new ali_oss_1.default({
                bucket,
                region: location.location,
                accessKeyId,
                accessKeySecret,
            });
        });
    }
    getOrCreateBucket() {
        return __awaiter(this, void 0, void 0, function* () {
            const { bucket } = this.config;
            try {
                yield this.client.getBucketInfo(bucket);
                // bucket存在，检查权限，且只能设置为 公共读
                const { acl } = yield this.client.getBucketACL(bucket);
                if (acl !== 'public-read') {
                    yield this.client.putBucketACL(bucket, 'public-read');
                }
            }
            catch (error) {
                if (error.code == 'NoSuchBucket') {
                    console.log(`bucket ${bucket} not exist, creating...`);
                    yield this.client.putBucket(bucket);
                    yield this.client.putBucketACL(bucket, 'public-read');
                    yield this.client.putBucketCORS(bucket, PUT_BUCKET_CORS);
                    console.log(`bucket ${bucket} created`);
                }
                else {
                    throw new Error(error.message);
                }
            }
        });
    }
}
exports.default = OssLogger;
//# sourceMappingURL=oss-logger.js.map