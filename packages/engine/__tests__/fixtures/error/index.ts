import { getInputs } from '@serverless-cd/core';
/**
 * 注意：
 * 如果当前应用需要接收敏感数据的字段，比如${{secrets.token}}, 可以使用core包提供的getInputs方法，此方法会返回真实的数据
 */

export async function run(
  inputs: Record<string, any>,
  context: Record<string, any>,
  logger: any,
): Promise<Record<string, any>> {
  // 注意，实际开发中不要写入敏感信息，此处只是为了方便调试
  logger.info(`config :${JSON.stringify({ inputs, context })}`);
  const newIputs = getInputs(inputs, context);
  console.log(`newIputs :${JSON.stringify(newIputs)}`);
  throw new Error('my error');
  return { success: true };
}
