import compiler from './compiler';

export function setEnvVariable(key: string, value: string) {
  process.env[key] = value;
}

export function getEnvVariable(key: string) {
  return process.env[key];
}

export function getServerlessCdVariable(key: string) {
  return compiler.get(key);
}

export function setServerlessCdVariable(key: string, value: any) {
  compiler.set(key, value);
}
