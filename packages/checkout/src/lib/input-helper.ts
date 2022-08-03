import * as Interface from './interface';
import { getServerlessCdVariable } from '@serverless-cd/core';

function getInputs(logger: any, execDir: string): Interface.IInputs {
  /**
   * TODO 目前这段是伪代码
   * 1、获取 provider、uri、token
   * 2、判断 serverless-pipeline 文件，tag or push
   */
  const inputs: any = {
    logger,
    execDir,
    provider: getServerlessCdVariable('provider'),
    path_with_namespace: getServerlessCdVariable('path_with_namespace'),
    token: getServerlessCdVariable('token'),
    username: getServerlessCdVariable('username'),
    uri: getServerlessCdVariable('uri'),
  };
  const tag = getServerlessCdVariable('tag');
  if (tag) {
    inputs['tag'] = tag;
  } else {
    inputs['commit'] = getServerlessCdVariable('commit');
    inputs['branch'] = getServerlessCdVariable('branch');
  }

  for (let i in inputs) {
    if (!inputs[i]) {
      throw new Error(`${i} is not defined on inputs`);
    }
  }
  return inputs;
}

export { getInputs };
