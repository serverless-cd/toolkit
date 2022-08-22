class ServerlesCd {
  [key: string]: any;
  constructor() {}
  set(key: string, value: any) {
    this[key] = value;
  }
  get(key: string) {
    return this[key];
  }
}

export interface IServerlesCd extends NodeJS.Process {
  SERVERLESS_CD: ServerlesCd;
}

const serverlesCd = new ServerlesCd();
const serverlesCdProcess = process as IServerlesCd;
if (!serverlesCdProcess.SERVERLESS_CD) {
  serverlesCdProcess.SERVERLESS_CD = serverlesCd;
}

export function getServerlessCdVariable(key: string) {
  return serverlesCd.get(key);
}

export function setServerlessCdVariable(key: string, value: any) {
  serverlesCd.set(key, value);
}

export function setEnvVariable(key: string, value: string) {
  process.env[key] = value;
}

export function getEnvVariable(key: string) {
  return process.env[key];
}
