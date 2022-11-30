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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const tablestore_1 = require("tablestore");
const utils_1 = require("./utils");
module.exports = class Orm {
    constructor(config, tableName, indexName) {
        this.tableClient = new tablestore_1.Client({
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret,
            endpoint: config.endpoint ? config.endpoint : `https://${config.instanceName}.${config.region}.ots.aliyuncs.com`,
            instancename: config.instanceName,
            maxRetries: config.maxRetries || 20, // 默认20次重试，可以省略此参数。
        });
        this.tableName = tableName;
        this.indexName = indexName;
    }
    /**
     * 创建表数据
     * @param primaryKey
     * @param attributeColumns
     */
    create(primaryKey, attributeColumns) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                tableName: this.tableName,
                condition: new tablestore_1.Condition(tablestore_1.RowExistenceExpectation.IGNORE, null),
                primaryKey,
                attributeColumns: (0, utils_1.wrapAttributes)(Object.assign(Object.assign({}, attributeColumns), { updated_time: tablestore_1.Long.fromNumber(Date.now()), created_time: tablestore_1.Long.fromNumber(Date.now()) })),
                returnContent: {
                    returnType: tablestore_1.ReturnType.Primarykey,
                },
            };
            console.debug(`orm save params: ${JSON.stringify(config, null, 2)}`);
            const { row } = yield this.tableClient.putRow(config);
            return (0, utils_1.wrapRow)(row);
        });
    }
    /**
     * 根据主键查询数据
     * @param primaryKey
     * @returns
     */
    findByPrimary(primaryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                tableName: this.tableName,
                maxVersions: 1,
                primaryKey,
            };
            console.debug(`orm findByPrimary params: ${JSON.stringify(config)}`);
            const result = yield this.tableClient.getRow(config);
            return (0, utils_1.wrapRow)(result === null || result === void 0 ? void 0 : result.row);
        });
    }
    /**
     * 查询数据（多元索引查询）
     * @param params
     * @returns
     */
    find(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPage = 1, pageSize = 10, orderKeys = [] } = params, termQuery = __rest(params, ["currentPage", "pageSize", "orderKeys"]);
            const limit = pageSize > 0 ? pageSize : 10;
            const offset = currentPage > 1 && pageSize > 0 ? (currentPage - 1) * pageSize : 0;
            const returnType = tablestore_1.ColumnReturnType.RETURN_ALL;
            const mustQueries = [];
            for (let i in termQuery) {
                const query = {
                    queryType: tablestore_1.QueryType.TERM_QUERY,
                    query: {
                        fieldName: i,
                        term: termQuery[i],
                    },
                };
                mustQueries.push(query);
            }
            let query = {
                queryType: tablestore_1.QueryType.BOOL_QUERY,
                query: {
                    mustQueries,
                },
            };
            if (mustQueries.length === 0) {
                query = { queryType: tablestore_1.QueryType.MATCH_ALL_QUERY };
            }
            const searchParams = {
                tableName: this.tableName,
                indexName: this.indexName,
                searchQuery: {
                    offset,
                    query,
                    limit,
                    getTotalCount: true,
                },
                columnToGet: {
                    returnType,
                },
            };
            if ((orderKeys === null || orderKeys === void 0 ? void 0 : orderKeys.length) > 0) {
                searchParams.searchQuery.sort = (0, utils_1.orderQuery)(orderKeys);
            }
            const result = yield this.tableClient.search(searchParams);
            return {
                result: (0, utils_1.wrapRows)(result.rows),
                totalCount: result.totalCounts,
            };
        });
    }
    /**
     * 查询首个数据（多元索引查询）
     * @param params
     * @returns
     */
    findOne(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { result } = yield this.find(Object.assign({ currentPage: 1, pageSize: 1 }, params));
            return result[0];
        });
    }
    /**
     * 所有数据（多元索引查询）
     * @param params
     * @returns
     */
    findAll(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let flag = true;
            let currentPage = 1;
            let totalCount = 0;
            let result = [];
            while (flag) {
                const res = yield this.find(Object.assign(Object.assign({}, params), { currentPage, pageSize: 100 }));
                currentPage += 1;
                totalCount = res.totalCount;
                result = result.concat(res.result);
                flag = totalCount > result.length;
            }
            return { result, totalCount };
        });
    }
    /**
     * 模糊查询（多元索引查询）
     * @param params
     * @returns
     */
    findByLike(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentPage = 1, pageSize = 10, sort } = params, rest = __rest(params, ["currentPage", "pageSize", "sort"]);
            const offset = currentPage > 1 && pageSize > 0 ? (currentPage - 1) * pageSize : 0;
            const limit = pageSize > 0 ? pageSize : 10;
            const mustQueries = [{ queryType: tablestore_1.QueryType.MATCH_ALL_QUERY }];
            for (let i in rest) {
                if (!rest[i]) {
                    continue;
                }
                const query = {
                    queryType: tablestore_1.QueryType.WILDCARD_QUERY,
                    query: {
                        fieldName: i,
                        value: `*${rest[i]}*`,
                    },
                };
                mustQueries.push(query);
            }
            const searchQuery = {
                offset,
                query: {
                    queryType: tablestore_1.QueryType.BOOL_QUERY,
                    query: {
                        mustQueries,
                    },
                },
                limit,
                getTotalCount: true,
            };
            if (sort) {
                const sorters = [];
                for (const i in sort) {
                    sorters.push({
                        fieldSort: {
                            fieldName: i,
                            order: sort[i] === 1
                                ? tablestore_1.SortOrder.SORT_ORDER_DESC
                                : tablestore_1.SortOrder.SORT_ORDER_ASC,
                        },
                    });
                }
                // @ts-ignore
                searchQuery.sort = { sorters };
            }
            const returnType = tablestore_1.ColumnReturnType.RETURN_ALL;
            const result = yield this.tableClient.search({
                tableName: this.tableName,
                indexName: this.indexName,
                searchQuery,
                columnToGet: {
                    returnType,
                },
            });
            return {
                result: (0, utils_1.wrapRows)(result.rows),
                totalCount: Number(result.totalCounts),
            };
        });
    }
    /**
     * 修改表数据
     * @param primaryKey
     * @param params
     */
    update(primaryKey, attributeColumns) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                tableName: this.tableName,
                condition: new tablestore_1.Condition(tablestore_1.RowExistenceExpectation.EXPECT_EXIST, null),
                primaryKey,
                updateOfAttributeColumns: [
                    {
                        PUT: (0, utils_1.wrapAttributes)(Object.assign(Object.assign({}, attributeColumns), { updated_time: tablestore_1.Long.fromNumber(Date.now()) })),
                    },
                ],
                returnContent: {
                    returnType: tablestore_1.ReturnType.Primarykey,
                },
            };
            console.debug(`orm update params: ${JSON.stringify(config)}`);
            const { row } = yield this.tableClient.updateRow(config);
            return (0, utils_1.wrapRow)(row);
        });
    }
    /**
     * 删除表数据
     * @param primaryKey
     * @returns
     */
    delete(primaryKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                tableName: this.tableName,
                condition: new tablestore_1.Condition(tablestore_1.RowExistenceExpectation.EXPECT_EXIST, null),
                primaryKey,
            };
            console.debug(`orm delete params: ${JSON.stringify(config)}`);
            const { row } = yield this.tableClient.deleteRow(config);
            return (0, utils_1.wrapRow)(row);
        });
    }
    /**
     * 批量删除表数据
     * @param primaryKey
     * @returns
     */
    batchDelete(primaryKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(primaryKeys)) {
                return {
                    success: false,
                    message: "primaryKeys must be an array",
                };
            }
            const config = {
                tables: [
                    {
                        tableName: this.tableName,
                        rows: primaryKeys.map((primaryKey) => ({
                            type: "DELETE",
                            condition: new tablestore_1.Condition(tablestore_1.RowExistenceExpectation.EXPECT_EXIST, null),
                            primaryKey
                        }))
                    },
                ],
            };
            console.debug(`orm batchDelete params: ${JSON.stringify(config)}`);
            return this.tableClient.batchWriteRow(config);
        });
    }
};
//# sourceMappingURL=index.js.map