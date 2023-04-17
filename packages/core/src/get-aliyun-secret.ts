
import { get } from "lodash";
import getInputs from "./get-inputs";

function getAliyunSecret(inputs: Record<string, any>, context: Record<string, any>) {
  const newInputs = getInputs(inputs, context)
  return { ...get(context, 'inputs.cloudSecrets'), ...get(context, 'inputs.sts'), ...newInputs };
}


export default getAliyunSecret;