import * as Interface from './interface';

function getInputs(logger: any, execDir: string): Interface.IInputs {
  /**
   * TODO 目前这段是伪代码
   * 1、获取 provider、uri、token
   * 2、判断 serverless-pipeline 文件，tag or push
   */
  const inputs: any = {
    logger,
    execDir,
    provider: process.env['provider'] || '',
    path_with_namespace: process.env['path_with_namespace'] || '',
    token: process.env['token'] || '',
    username: process.env['username'] || '',
    uri: process.env['uri'] || '',
  };
  const tag = process.env['tag'] || '';
  if (tag) {
    inputs['tag'] = tag;
  } else {
    inputs['commit'] = process.env['commit'] || '';
    inputs['branch'] = process.env['branch'] || '';
  }

  for (let i in inputs) {
    if (!inputs[i]) {
      throw new Error(`${i} is not defined on inputs`);
    }
  }
  return inputs;
}

export { getInputs };
