import { Client, PrimaryKeyInput } from 'tablestore';
interface IConfig {
    accessKeyId: string;
    accessKeySecret: string;
    instanceName: string;
    region: string;
    endpoint?: string;
    maxRetries?: number;
}
interface IFindParams extends Record<string, any> {
    currentPage?: number;
    pageSize?: number;
    orderKeys?: string[];
}
declare const _default: {
    new (config: IConfig, tableName: string, indexName: string): {
        tableClient: Client;
        tableName: string;
        indexName: string;
        /**
         * 创建表数据
         * @param primaryKey
         * @param attributeColumns
         */
        create(primaryKey: PrimaryKeyInput, attributeColumns: Record<string, any>): Promise<Record<string, any>>;
        /**
         * 根据主键查询数据
         * @param primaryKey
         * @returns
         */
        findByPrimary(primaryKey: PrimaryKeyInput): Promise<Record<string, any>>;
        /**
         * 查询数据（多元索引查询）
         * @param params
         * @returns
         */
        find(params?: IFindParams): Promise<{
            totalCount: number;
            result: Record<string, any>[];
        }>;
        /**
         * 查询首个数据（多元索引查询）
         * @param params
         * @returns
         */
        findOne(params?: Record<string, string>): Promise<undefined | Record<string, any>>;
        /**
         * 所有数据（多元索引查询）
         * @param params
         * @returns
         */
        findAll(params?: IFindParams): Promise<{
            totalCount: number;
            result: Record<string, any>[];
        }>;
        /**
         * 模糊查询（多元索引查询）
         * @param params
         * @returns
         */
        findByLike(params?: IFindParams): Promise<{
            totalCount: number;
            result: Record<string, any>[];
        }>;
        /**
         * 修改表数据
         * @param primaryKey
         * @param params
         */
        update(primaryKey: PrimaryKeyInput, attributeColumns: Record<string, any>): Promise<Record<string, any>>;
        /**
         * 删除表数据
         * @param primaryKey
         * @returns
         */
        delete(primaryKey: PrimaryKeyInput): Promise<Record<string, any>>;
        /**
         * 批量删除表数据
         * @param primaryKey
         * @returns
         */
        batchDelete(primaryKeys: PrimaryKeyInput[]): Promise<import("tablestore").BatchWriteRowResult | {
            success: boolean;
            message: string;
        }>;
    };
};
export = _default;
