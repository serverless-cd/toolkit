
import Client from '@serverless-cd/aliyun-client';
import { execSync } from 'child_process';
import https from 'https';
import fs from 'fs-extra';
import path from 'path';
import { IProps, RUNTIME } from "./types";

export default class Setup {
  logger: any;
  runtimes: `${RUNTIME}`[];
  region: string;
  fcClient: any;
  dest: string;
  internal: boolean;

  constructor(props: IProps) {
    this.runtimes = props.runtimes || [];
    this.region = props.region || 'cn-hongkong';
    this.dest = props.dest || '/opt';
    this.internal = typeof props.internal === 'boolean' ? props.internal : (props.region ? true : false);

    const client = new Client(props.credentials);
    this.fcClient = client.getFc2({ region: this.region });
  }

  async run() {
    const asyncTask = this.runtimes.map(async (runtime) => {
      const { arn, envs } = this.getRuntimeConfig(runtime);

      // 下载runtime包
      console.log(`download ${runtime} start`);
      const { code } = (await this.fcClient.get(`/layerarn/${encodeURIComponent(arn)}`))?.data;
      const url = this.internal ? code.location.replace('-internal.aliyuncs.com', '.aliyuncs.com') : code.location;
      const localPath = await this.download(url, runtime);
      console.log(`download ${runtime} end`);
      // 解压runtime包
      console.log(`unzip ${runtime} start`);
      for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 4000));
        try {
          execSync(`unzip -o ${localPath} -d ${this.dest}`);
          break;
        } catch (err) {
          console.error(`unzip ${localPath} failed: ${err}`);
          if (i === 2) {
            throw err;
          }
        }
      }
      console.log(`unzip ${runtime} end`);

      for (const [key, value] of Object.entries(envs)) {
        const p = value.map((v: string) => `${this.dest}${v}`).join(':');
        if (key === 'PATH') {
          process.env.PATH = `${p}:${process.env.PATH || ''}`;
        } else if (key === 'LD_LIBRARY_PATH') {
          process.env.LD_LIBRARY_PATH = `${process.env.LD_LIBRARY_PATH || ''}:${p}`;
        } else {
          process.env[key] = `${p}:${process.env[key] || ''}`;
        }
      }
    });
    await Promise.all(asyncTask);
  }

  private async download(url: string, runtime: string) {
    fs.ensureDirSync(this.dest);
    const filePath = path.join(this.dest, `${runtime}.zip`);

    return await new Promise((resolve, reject) => {
      https.get(url).on('response', (res: any) => {
        const len = parseInt(res.headers['content-length'], 10);
        if (res.statusCode === 200) {
          const file = fs.createWriteStream(filePath);
          file.on('open', () => {
            res.on('data', (chunk: any) => file.write(chunk))
              .on('end', () => {
                file.end();
                resolve(filePath);
              })
              .on('error', (err: any) => {
                file.destroy();
                fs.unlink(this.dest, () => reject(err));
              });
          });
        } else if (res.statusCode === 302 || res.statusCode === 301) {
          this.download(res.headers.location, runtime).then((val) => resolve(val));
        } else {
          reject({
            code: res.statusCode,
            message: res.statusMessage,
          });
        }
      });
    })
  }

  private getRuntimeConfig(runtime: `${RUNTIME}`) {
    switch (runtime) {
      case RUNTIME.PYTHON310:
        return {
          arn: `acs:fc:${this.region}:official:layers/Python310/versions/1`,
          envs: {
            PATH: ['/python3.10/bin'],
          },
        };
      case RUNTIME.PYTHON39:
        return {
          arn: `acs:fc:${this.region}:official:layers/Python39/versions/1`,
          envs: {
            PATH: ['/python3.9/bin'],
          },
        };
      case RUNTIME.PYTHON38:
        return {
          arn: `acs:fc:${this.region}:official:layers/Python38/versions/1`,
          envs: {
            PATH: ['/python3.8/bin'],
          },
        };
      case RUNTIME.PYTHON36:
        return {
          arn: `acs:fc:${this.region}:official:layers/Python36/versions/1`,
          envs: {
            PATH: ['/python3.6/bin'],
          },
        };
      case RUNTIME.NODEJA17:
        return {
          arn: `acs:fc:${this.region}:official:layers/Nodejs17/versions/1`,
          envs: {
            PATH: ['/nodejs17/bin'],
          },
        };
      case RUNTIME.NODEJA16:
        return {
          arn: `acs:fc:${this.region}:official:layers/Nodejs16/versions/1`,
          envs: {
            PATH: ['/nodejs16/bin'],
          },
        };
      case RUNTIME.NODEJA14:
        return {
          arn: `acs:fc:${this.region}:official:layers/Nodejs14/versions/1`,
          envs: {
            PATH: ['/nodejs14/bin'],
          },
        };
      case RUNTIME.NODEJA12:
        return {
          arn: `acs:fc:${this.region}:official:layers/Nodejs12/versions/1`,
          envs: {
            PATH: ['/nodejs12/bin'],
          },
        };
      case RUNTIME.PHP81:
        return {
          arn: `acs:fc:${this.region}:official:layers/PHP81/versions/4`,
          envs: {
            PATH: ['/php8.1/bin', '/php8.1/sbin'],
            LD_LIBRARY_PATH: ['/php8.1/lib'],
          },
        };
      case RUNTIME.PHP80:
        return {
          arn: `acs:fc:${this.region}:official:layers/PHP80/versions/4`,
          envs: {
            PATH: ['/php8.0/bin', '/php8.0/sbin'],
            LD_LIBRARY_PATH: ['/php8.0/lib'],
          },
        };
      case RUNTIME.PHP72:
        return {
          arn: `acs:fc:${this.region}:official:layers/PHP72/versions/3`,
          envs: {
            PATH: ['/php7.2/bin', '/php7.2/sbin'],
            LD_LIBRARY_PATH: ['/php7.2/lib'],
          },
        };
      case RUNTIME.JAVA11:
        return {
          arn: `acs:fc:${this.region}:official:layers/Java11/versions/1`,
          envs: {
            PATH: ['/java11/bin'],
          },
        };
      case RUNTIME.JAVA17:
        return {
          arn: `acs:fc:${this.region}:official:layers/Java17/versions/1`,
          envs: {
            PATH: ['/java17/bin'],
          },
        };
      case RUNTIME.DOTNET6:
        return {
          arn: `acs:fc:${this.region}:official:layers/Dotnet6/versions/1`,
          envs: {
            PATH: ['/dotnet6'],
          },
        };
      default:
        throw new Error(`Not implemented yet for this platform: ${runtime}`);
    }
  }
}
