import {
  Condition,
  RowExistenceExpectation,
  ReturnType,
  SortOrder,
  QueryType,
  Long,
  Client,
  PutRowParams,
  PrimaryKeyInput,
  SingleRowResult,
  Row,
  BatchWriteRowParams,
  ColumnReturnType,
  SearchParams,
  Sorter,
  Direction,
  INF_MIN,
  INF_MAX,
} from 'tablestore';
const debug = require('@serverless-cd/debug')('orm:ots');
import { orderQuery, wrapAttributes, wrapRow, wrapRows } from './utils';

interface IConfig {
  accessKeyId: string;
  accessKeySecret: string;
  stsToken?: string;
  securityToken?: string;
  instanceName: string;
  region: string;
  endpoint?: string;
  maxRetries?: number;
}

interface SortSearchParams extends SearchParams {
  searchQuery: {
    offset: number;
    limit: number;
    query: {
      queryType: any;
      query?: unknown;
    };
    getTotalCount?: boolean;
    token?: Buffer | null;
    sort?: { sorters: Sorter[] };
  };
}

interface IFindParams extends Record<string, any> {
  currentPage?: number;
  pageSize?: number;
  orderKeys?: string[];
}

interface ICreateOptions {
  capacityUnit?: {
    read: number;
    write: number;
  };
  tableOptions?: {
    timeToLive: number;
    maxVersions: number;
  };
}
export = class Orm {
  tableClient: Client;
  tableName: string;
  // index  索引不一定存在
  indexName?: string;

  logger(message: string | Object) {
    let curMsg = '';
    if (typeof message === 'object') {
      try {
        curMsg = JSON.stringify(message);
      } catch (error) {}
    } else {
      curMsg = message;
    }
    debug(`[${this.tableName}] ${curMsg}`);
  }

  constructor(config: IConfig, tableName: string, indexName?: string) {
    if (!/^[\w]{1,255}$/.test(tableName)) {
      throw new Error(`表名必须满足以下条件：
      1.只能包含字母，数字和下划线(_)
      2.必须以字母或下划线(_)开头
      长度限制在1-255个字符之间`);
    }

    this.tableClient = new Client({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      stsToken: config.stsToken,
      securityToken: config.securityToken,
      endpoint: config.endpoint
        ? config.endpoint
        : `https://${config.instanceName}.${config.region}.ots.aliyuncs.com`,
      instancename: config.instanceName,
      maxRetries: config.maxRetries || 20, // 默认20次重试，可以省略此参数。
    });
    this.tableName = tableName;
    this.indexName = indexName;
  }

  async createTable(
    primaryKeys: Array<{
      name: string;
      type: string;
      option?: string;
    }>,
    { capacityUnit, tableOptions }: ICreateOptions = {},
  ): Promise<void> {
    const tableClient = this.tableClient;
    let isExist = false;

    // 确认表是否存在
    try {
      await tableClient.describeTable({
        tableName: this.tableName,
      });
      isExist = true;
    } catch (error: any) {
      // 404是找不到Table, 属于正常情况
      // 其他的case一律抛异常
      if (error.name != 404) {
        throw error;
      }
    }
    if (isExist) return;
    // 创建表
    const tableParams = {
      tableMeta: {
        tableName: this.tableName,
        primaryKey: primaryKeys,
      },
      //设置预留读写吞吐量，容量型实例中的数据表只能设置为0，高性能实例中的数据表可以设置为非零值
      reservedThroughput: {
        capacityUnit: {
          read: capacityUnit?.read || 0,
          write: capacityUnit?.write || 0,
        },
      },
      tableOptions: {
        timeToLive: tableOptions?.timeToLive || -1, // 数据的过期时间, 单位秒, -1代表永不过期. 假如设置过期时间为一年, 即为 365 * 24 * 3600.
        maxVersions: tableOptions?.maxVersions || 1, // 保存的最大版本数, 设置为1即代表每列上最多保存一个版本(保存最新的版本).
      },
      // 不开启Stream
      streamSpecification: {
        enableStream: false, //开启Stream
        // expirationTime: 24, //Stream的过期时间，单位是小时，最长为168，设置完以后不能修改
      },
    };
    // @ts-expect-error
    await tableClient.createTable(tableParams);
  }

  /**
   * 通过主键名，查询到所有的值
   * 注意： 这个方法会遍历所有的表字段，不能用于大量的查询操作
   * @param pkNames: 主键名
   * @param columnsToGet: 关注的columns列名
   * @returns
   */
  findAllWithPk(
    pkNames: string[],
    columnsToGet?: string[],
    filterFn?: (item: Record<string, any>) => boolean,
  ): Promise<any[]> {
    this.logger(`orm findAllWithPk: ${JSON.stringify(pkNames, null, 2)}`);

    let resultRows: Row[] = [];
    const tableClient = this.tableClient;
    const params = {
      columnsToGet,
      tableName: this.tableName,
      direction: Direction.FORWARD,
      maxVersions: 10,
      inclusiveStartPrimaryKey: pkNames.map((key) => ({ [key]: INF_MIN })),
      exclusiveEndPrimaryKey: pkNames.map((key) => ({ [key]: INF_MAX })),
      limit: 5000,
    };
    const getLoopRange = function (resolve: Function, reject: Function) {
      // @ts-expect-error
      tableClient.getRange(params, (err, data: any) => {
        if (err) {
          return reject(err);
        }
        resultRows = resultRows.concat(wrapRows(data.rows));
        if (data.nextStartPrimaryKey) {
          params.inclusiveStartPrimaryKey = pkNames.map((key) => ({
            [key]: data.nextStartPrimaryKey[0].value,
          }));
          getLoopRange(resolve, reject);
        } else {
          if (filterFn) {
            resolve(resultRows.filter(filterFn));
          } else {
            resolve(resultRows);
          }
        }
      });
    };
    return new Promise((resolve, reject) => {
      getLoopRange(resolve, reject);
    });
  }
  /**
   * 创建表数据
   * @param primaryKey
   * @param attributeColumns
   * @param withTime 是否默认添加时间
   *
   */
  async create(
    primaryKey: PrimaryKeyInput,
    attributeColumns: Record<string, any>,
    withTime: boolean = true,
  ): Promise<Record<string, any>> {
    const config: PutRowParams = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.IGNORE, null),
      primaryKey,
      attributeColumns: withTime
        ? wrapAttributes({
            ...attributeColumns,
            updated_time: Long.fromNumber(Date.now()),
            created_time: Long.fromNumber(Date.now()),
          })
        : wrapAttributes(attributeColumns),
      returnContent: {
        returnType: ReturnType.Primarykey,
      },
    };
    this.logger(`orm save params: ${JSON.stringify(config, null, 2)}`);
    const { row } = await this.tableClient.putRow(config);
    return wrapRow(row as Row);
  }

  /**
   * 根据主键查询数据
   * @param primaryKey
   * @returns
   */
  async findByPrimary(primaryKey: PrimaryKeyInput): Promise<Record<string, any>> {
    const config = {
      tableName: this.tableName,
      maxVersions: 1,
      primaryKey,
    };
    this.logger(`orm findByPrimary params: ${JSON.stringify(config)}`);
    const result: SingleRowResult = await this.tableClient.getRow(config);
    return wrapRow(result?.row as Row);
  }

  /**
   * 查询数据（多元索引查询）
   * @param params
   * @returns
   */
  async find(
    params: IFindParams = {},
  ): Promise<{ totalCount: number; result: Record<string, any>[] }> {
    const { currentPage = 1, pageSize = 10, orderKeys = [], ...termQuery } = params;
    const limit = pageSize > 0 ? pageSize : 10;
    const offset = currentPage > 1 && pageSize > 0 ? (currentPage - 1) * pageSize : 0;
    const returnType = ColumnReturnType.RETURN_ALL;

    const mustQueries = [];
    for (let i in termQuery) {
      const query = {
        queryType: QueryType.TERM_QUERY,
        query: {
          fieldName: i,
          term: termQuery[i],
        },
      };
      mustQueries.push(query);
    }

    let query: any = {
      queryType: QueryType.BOOL_QUERY,
      query: {
        mustQueries,
      },
    };
    if (mustQueries.length === 0) {
      query = { queryType: QueryType.MATCH_ALL_QUERY };
    }

    const searchParams: SortSearchParams = {
      tableName: this.tableName,
      // @ts-expect-error
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
    if (orderKeys?.length > 0) {
      searchParams.searchQuery.sort = orderQuery(orderKeys);
    }

    const result: any = await this.tableClient.search(searchParams);

    return {
      result: wrapRows(result.rows),
      totalCount: result.totalCounts,
    };
  }

  /**
   * 查询首个数据（多元索引查询）
   * @param params
   * @returns
   */
  async findOne(params: Record<string, string> = {}): Promise<undefined | Record<string, any>> {
    const { result } = await this.find({
      currentPage: 1,
      pageSize: 1,
      ...params,
    });
    return result[0];
  }

  /**
   * 所有数据（多元索引查询）
   * @param params
   * @returns
   */
  async findAll(
    params: IFindParams = {},
  ): Promise<{ totalCount: number; result: Record<string, any>[] }> {
    let flag = true;
    let currentPage = 1;
    let totalCount = 0;
    let result: Record<string, any>[] = [];
    while (flag) {
      const res = await this.find({ ...params, currentPage, pageSize: 100 });
      currentPage += 1;
      totalCount = res.totalCount;
      result = result.concat(res.result);

      flag = totalCount > result.length;
    }
    return { result, totalCount };
  }

  /**
   * 模糊查询（多元索引查询）
   * @param params
   * @returns
   */
  async findByLike(
    params: IFindParams = {},
  ): Promise<{ totalCount: number; result: Record<string, any>[] }> {
    if (this.indexName == undefined) {
      throw new Error('table index is requied');
    }

    const { currentPage = 1, pageSize = 10, sort, ...rest } = params;
    const offset = currentPage > 1 && pageSize > 0 ? (currentPage - 1) * pageSize : 0;
    const limit = pageSize > 0 ? pageSize : 10;

    const mustQueries: any = [{ queryType: QueryType.MATCH_ALL_QUERY }];
    for (let i in rest) {
      if (!rest[i]) {
        continue;
      }
      const query = {
        queryType: QueryType.WILDCARD_QUERY,
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
        queryType: QueryType.BOOL_QUERY,
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
            order: sort[i] === 1 ? SortOrder.SORT_ORDER_DESC : SortOrder.SORT_ORDER_ASC,
          },
        });
      }
      // @ts-ignore
      searchQuery.sort = { sorters };
    }

    const returnType = ColumnReturnType.RETURN_ALL;
    const result: any = await this.tableClient.search({
      tableName: this.tableName,
      indexName: this.indexName,
      searchQuery,
      columnToGet: {
        returnType,
      },
    });

    return {
      result: wrapRows(result.rows),
      totalCount: Number(result.totalCounts),
    };
  }

  /**
   * 修改表数据
   * @param primaryKey
   * @param params
   */
  async update(
    primaryKey: PrimaryKeyInput,
    attributeColumns: Record<string, any>,
  ): Promise<Record<string, any>> {
    const config = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey,
      updateOfAttributeColumns: [
        {
          PUT: wrapAttributes({
            ...attributeColumns,
            updated_time: Long.fromNumber(Date.now()),
          }),
        },
      ],
      returnContent: {
        returnType: ReturnType.Primarykey,
      },
    };

    this.logger(`orm update params: ${JSON.stringify(config)}`);
    const { row } = await this.tableClient.updateRow(config);
    return wrapRow(row as Row);
  }

  /**
   * 删除表数据
   * @param primaryKey
   * @returns
   */
  async delete(primaryKey: PrimaryKeyInput) {
    const config = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.EXPECT_EXIST, null),
      primaryKey,
    };
    this.logger(`orm delete params: ${JSON.stringify(config)}`);
    const { row } = await this.tableClient.deleteRow(config);
    return wrapRow(row as Row);
  }

  /**
   * 批量删除表数据
   * @param primaryKey
   * @returns
   */
  async batchDelete(primaryKeys: PrimaryKeyInput[]) {
    if (!Array.isArray(primaryKeys)) {
      return {
        success: false,
        message: 'primaryKeys must be an array',
      };
    }
    const config: BatchWriteRowParams = {
      tables: [
        {
          tableName: this.tableName,
          rows: primaryKeys.map((primaryKey) => ({
            type: 'DELETE',
            condition: new Condition(RowExistenceExpectation.EXPECT_EXIST, null),
            primaryKey,
          })),
        },
      ],
    };
    this.logger(`orm batchDelete params: ${JSON.stringify(config)}`);
    return this.tableClient.batchWriteRow(config);
  }
};
