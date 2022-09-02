import OssClient from 'ali-oss';
import * as path from 'path';
import * as fs from 'fs-extra';
import walkSync from 'walk-sync';

const PUT_BUCKET_CORS = [
  {
    allowedOrigin: '*',
    allowedHeader: '*',
    allowedMethod: ['GET'],
  },
];

export interface IConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  codeUri: string;
}

class OssLogger {
  private client: OssClient;
  constructor(private config: IConfig) {
    const { accessKeyId, accessKeySecret, bucket, region, codeUri } = config;
    this.config.codeUri = path.isAbsolute(codeUri) ? codeUri : path.join(process.cwd(), codeUri);
    // 构造oss客户端
    this.client = new OssClient({
      bucket,
      region: `oss-${region}`,
      accessKeyId,
      accessKeySecret,
    });
  }
  async init() {
    await this.getOrCreateBucket();
    await this.updateRegion();
    await this.put();
    return this.client;
  }
  async put() {
    const { codeUri } = this.config;
    const paths = walkSync(codeUri);
    for (const p of paths) {
      const fillPath = path.join(codeUri, p);
      const stat = fs.statSync(fillPath);
      if (stat.isFile()) {
        console.log(`uploading ${p}`);
        try {
          await this.client.put(p, fillPath);
        } catch (error) {
          throw new Error((error as Error).message);
        }
      }
    }
    console.log('upload finished');
  }
  async updateRegion() {
    const { accessKeyId, accessKeySecret, bucket } = this.config;
    const location = await this.client.getBucketLocation(bucket);
    this.client = new OssClient({
      bucket,
      region: location.location,
      accessKeyId,
      accessKeySecret,
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
