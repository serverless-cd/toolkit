// @ts-ignore
import FCClient from '@alicloud/fc2';
import FcNewClient from '@alicloud/fc-open20210406';
import Pop from '@alicloud/pop-core';
import * as $OpenApi from '@alicloud/openapi-client';
import OssClient from 'ali-oss';
import tablestore from 'tablestore';
import { IFC2Config, ISecretConfig, ITablestoreConfig } from './type';

const { ROAClient } = require('@alicloud/pop-core');

export default class Client {
  readonly config: ISecretConfig;
  readonly tablestore = tablestore;
  readonly fc2 = FCClient;
  readonly FC_Open20210406 = FcNewClient;
  readonly aliOss = OssClient;
  readonly pop = Pop;

  constructor(config: ISecretConfig) {
    if (!config?.accessKeyId) {
      throw new Error('AccessKeyId is required');
    }
    if (!config?.accessKeySecret) {
      throw new Error('AccessKeySecret is required');
    }
    this.config = config;
  }

  getTablestore(payload: ITablestoreConfig): tablestore.Client {
    const { instanceName, region, maxRetries = 20 } = payload || {};
    if (!instanceName) {
      throw new Error('Get tablestore client: InstanceName is required');
    }
    const { accessKeyId, accessKeySecret, securityToken, endpoint, opts } = this.config;
    if (!endpoint && !region) {
      throw new Error('Get tablestore client: Endpoint not specified, region is required');
    }
  
    return new tablestore.Client({
      accessKeyId,
      accessKeySecret,
      securityToken,
      instancename: instanceName,
      endpoint: endpoint ? endpoint : `https://${instanceName}.${region}.ots.aliyuncs.com`,
      maxRetries,
      httpOptions: opts as {
        timeout: number;
        maxSockets: number;
      },
    })
  }

  getFc2(payload: IFC2Config) {
    const { region, secure, internal, headers, timeout } = payload || {};
    if (!region) {
      throw new Error('Get fc2 client: Region is required');
    }
    const { accountId, accessKeyId, accessKeySecret, securityToken, endpoint, opts } = this.config;
    if (!accountId) {
      throw new Error('Get fc2 client: AccountId is required');
    }
    return new FCClient(accountId, {
      accessKeyID: accessKeyId,
      accessKeySecret,
      securityToken,
      region,
      secure,
      internal,
      endpoint,
      headers,
      timeout: timeout || opts?.timeout || 10000000,
    });
  }

  getFc2021(payload: { region: string }) {
    const { region } = payload || {};
    if (!region) {
      throw new Error('Get fc-open20210406 client: Region is required');
    }
    const { accountId, accessKeyId, accessKeySecret, securityToken, opts } = this.config;
    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
      securityToken,
      regionId: region,
      endpoint: `${accountId}.${region}.fc.aliyuncs.com`,
      readTimeout: opts?.timeout,
    });
    return new FcNewClient(config);
  }

  getOss(payload: any) {
    const { bucket, region, internal, timeout } = payload || {};
    if (!region) {
      throw new Error('Get oss client: Region is required');
    }
    const { accessKeyId, accessKeySecret, securityToken, endpoint, opts } = this.config;

    return new OssClient({
      accessKeyId,
      accessKeySecret,
      stsToken: securityToken,
      bucket,
      endpoint,
      internal,
      timeout: timeout || opts?.timeout || 10000000,
      region: region.startsWith('oss-') ? region : `oss-${region}`,
    });
  }

  getROAClient() {
    const { accessKeyId, accessKeySecret, securityToken, endpoint, opts, apiVersion } = this.config;
    if (!endpoint) {
      throw new Error('Get ROAClient error: endpoint is required');
    }
    if (!apiVersion) {
      throw new Error('Get ROAClient error: apiVersion is required');
    }

    return new ROAClient({
      accessKeyId,
      accessKeySecret,
      securityToken,
      endpoint,
      apiVersion,
      opts,
    });
  }

  getPopClient() {
    const { accessKeyId, accessKeySecret, securityToken, endpoint, opts, apiVersion } = this.config;
    if (!endpoint) {
      throw new Error('Get ROAClient error: endpoint is required');
    }
    if (!apiVersion) {
      throw new Error('Get ROAClient error: apiVersion is required');
    }

    return new Pop({
      endpoint,
      apiVersion,
      accessKeyId,
      accessKeySecret,
      securityToken,
      opts,
    });
  }
}
