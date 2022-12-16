export enum RUNTIME {
  PYTHON310 = 'python3.10', // Python 3.10.5
  PYTHON39 = 'python3.9', // Python 3.9.13
  PYTHON38 = 'python3.8', // Python 3.8.13
  PYTHON36 = 'python3.6', // Python 3.6.15
  NODEJA17 = 'nodejs17', // Node.js 17.9.1
  NODEJA16 = 'nodejs16', // Node.js 16.17.0
  NODEJA14 = 'nodejs14', // Node.js 14.20.0
  NODEJA12 = 'nodejs12', // Node.js 12.22.12
  PHP81 = 'php8.1', // PHP 8.1.9
  PHP80 = 'php8.0', // PHP 8.0.22
  PHP72 = 'php7.2', // PHP 7.2.8
  JAVA11 = 'java11', // openjdk 11.0.13
  JAVA17 = 'java17', // openjdk 17.0.2
  DOTNET6 = '.net6', // .net6 6.0.5
}

export interface ICredentials {
  accountId: string;
  accessKeyId: string;
  accessKeySecret: string;
  securityToken?: string;
}

export interface IProps {
  runtimes: `${RUNTIME}`[];
  region: string;
  credentials: ICredentials;
  dest?: string;
  internal?: boolean;
}
