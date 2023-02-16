import OssClient from 'ali-oss';
import * as path from 'path';
import * as fs from 'fs-extra';
import walkSync from 'walk-sync';
import { startsWith } from 'lodash';

const PUT_BUCKET_CORS = [
  {
    allowedOrigin: '*',
    allowedHeader: '*',
    allowedMethod: ['GET'],
  },
];

export interface IOssConfig extends OssClient.Options {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  codeUri?: string; // engine 内部会处理该字段
}

class OssLogger {
  private client: OssClient;
  constructor(private config: IOssConfig) {
    const { region } = config;
    // 构造oss客户端
    this.client = new OssClient({
      ...config,
      region: startsWith(region, 'oss-') ? region : `oss-${region}`,
    });
  }
  async init() {
    await this.getOrCreateBucket();
    await this.updateRegion();
    await this.put();
    return this.client;
  }
  async put() {
    let { codeUri = '' } = this.config;
    codeUri = path.isAbsolute(codeUri) ? codeUri : path.join(process.cwd(), codeUri);
    const file = fs.statSync(codeUri);
    if (file.isFile()) {
      const filename = path.basename(codeUri);
      console.log(`uploading ${filename} to oss...`);
      await this.client.put(codeUri, codeUri);
      console.log(`upload ${filename} to oss success`);
      return;
    }
    const paths = walkSync(codeUri);
    for (const p of paths) {
      const fillPath = path.join(codeUri, p);
      const stat = fs.statSync(fillPath);
      if (stat.isFile()) {
        console.log(`uploading ${p} to oss...`);
        try {
          await this.client.put(fillPath, fillPath);
        } catch (error) {
          throw new Error((error as Error).message);
        }
      }
    }
    console.log('upload finished');
  }
  async updateRegion() {
    const { bucket } = this.config;
    const location = await this.client.getBucketLocation(bucket);
    this.client = new OssClient({
      ...this.config,
      bucket,
      region: location.location,
    });
  }
  async getOrCreateBucket() {
    const { bucket } = this.config;
    try {
      await this.client.getBucketInfo(bucket);
      // bucket存在，检查权限，且只能设置为 公共读
      const { acl } = await this.client.getBucketACL(bucket);
      if (acl !== 'public-read') {
        await this.client.putBucketACL(bucket, 'public-read');
      }
    } catch (error: any) {
      if (error.code == 'NoSuchBucket') {
        console.log(`bucket ${bucket} not exist, creating...`);
        await this.client.putBucket(bucket);
        await this.client.putBucketACL(bucket, 'public-read');
        await this.client.putBucketCORS(bucket, PUT_BUCKET_CORS);
        console.log(`bucket ${bucket} created`);
      } else {
        throw new Error(error.message);
      }
    }
  }
}

export default OssLogger;
