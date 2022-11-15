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
} from 'tablestore';
import { orderQuery, wrapAttributes, wrapRow, wrapRows } from './utils';

interface IConfig {
  accessKeyId: string;
  accessKeySecret: string;
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


export = class Orm {
  tableClient: Client;
  tableName: string;
  indexName: string;

  constructor(config: IConfig, tableName: string, indexName: string) {
    this.tableClient = new Client({
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
  async create(primaryKey: PrimaryKeyInput, attributeColumns: Record<string, any>): Promise<Record<string, any>> {
    const config: PutRowParams = {
      tableName: this.tableName,
      condition: new Condition(RowExistenceExpectation.IGNORE, null),
      primaryKey,
      attributeColumns: wrapAttributes({
        ...attributeColumns,
        updated_time: Long.fromNumber(Date.now()),
        created_time: Long.fromNumber(Date.now()),
      }),
      returnContent: {
        returnType: ReturnType.Primarykey,
      },
    };
    console.debug(`orm save params: ${JSON.stringify(config, null, 2)}`);
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
    console.debug(`orm findByPrimary params: ${JSON.stringify(config)}`);
    const result: SingleRowResult = await this.tableClient.getRow(config);
    return wrapRow(result?.row as Row);
  }

  /**
   * 查询数据（多元索引查询）
   * @param params 
   * @returns 
   */
  async find(params: IFindParams = {}): Promise<{ totalCount: number; result: Record<string, any>[]}>{
    const {
      currentPage = 1,
      pageSize = 10,
      orderKeys = [],
      ...termQuery
    } = params;
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
  async findAll(params: IFindParams = {}): Promise<{ totalCount: number; result: Record<string, any>[]}> {
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
  async findByLike(params: IFindParams = {}): Promise<{ totalCount: number; result: Record<string, any>[]}> {
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
            order:
              sort[i] === 1
                ? SortOrder.SORT_ORDER_DESC
                : SortOrder.SORT_ORDER_ASC,
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
  async update(primaryKey: PrimaryKeyInput, attributeColumns: Record<string, any>): Promise<Record<string, any>> {
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

    console.debug(`orm update params: ${JSON.stringify(config)}`);
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
    console.debug(`orm delete params: ${JSON.stringify(config)}`);
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
        message: "primaryKeys must be an array",
      };
    }
    const config: BatchWriteRowParams = {
      tables: [
        {
          tableName: this.tableName,
          rows: primaryKeys.map((primaryKey) => ({
            type: "DELETE",
            condition: new Condition(
              RowExistenceExpectation.EXPECT_EXIST,
              null
            ),
            primaryKey
          }))
        },
      ],
    };
    console.debug(`orm batchDelete params: ${JSON.stringify(config)}`);
    return this.tableClient.batchWriteRow(config);
  }
}
