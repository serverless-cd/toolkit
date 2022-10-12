import { EngineLogger, getInputs, getSecretInputs } from '@serverless-cd/core';
interface IkeyValue {
  [key: string]: any;
}

interface IConfig {
  context: IkeyValue;
  logger: EngineLogger;
}
/**
 * 注意：
 * 如果当前应用需要接收敏感数据的字段，比如${{secret.token}}, 可以使用core包提供的getInputs方法，此方法会返回真实的数据
 * 如果需要输出相关日志，为了防止敏感数据的泄漏，可以使用core包提供的getSecretInputs方法，此方法会对敏感数据进行加*处理
 */

export function run(inputs: IkeyValue, config: IConfig): IkeyValue {
  const { logger, context } = config;
  // 注意，实际开发中不要写入敏感信息，此处只是为了方便调试
  logger.info(`config :${JSON.stringify({ inputs, context })}`);
  const newIputs = getInputs(inputs, context);
  console.log(`newIputs :${JSON.stringify(newIputs)}`);
  const newSecretIputs = getSecretInputs(inputs, context);
  logger.info(`newSecretIputs :${JSON.stringify(newSecretIputs)}`);
  return { success: true };
}

export function postRun(inputs: IkeyValue, config: IConfig): IkeyValue {
  const { logger, context } = config;
  logger.info(`this is postRun ${JSON.stringify({ inputs, context })}`);
  return { success: true };
}
