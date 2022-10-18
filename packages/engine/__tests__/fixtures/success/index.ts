import { EngineLogger, getInputs } from '@serverless-cd/core';
interface IkeyValue {
  [key: string]: any;
}

interface IConfig {
  context: IkeyValue;
  logger: EngineLogger;
}
/**
 * 注意：
 * 如果当前应用需要接收敏感数据的字段，比如${{secrets.token}}, 可以使用core包提供的getInputs方法，此方法会返回真实的数据
 */

export async function run(
  inputs: IkeyValue,
  context: IkeyValue,
  logger: IkeyValue,
): Promise<IkeyValue> {
  // 注意，实际开发中不要写入敏感信息，此处只是为了方便调试
  logger.info(`config :${JSON.stringify({ inputs, context })}`);
  const newIputs = getInputs(inputs, context);
  logger.info(`newIputs :${JSON.stringify(newIputs)}`);
  return { success: true };
}
