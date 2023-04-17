
import { get } from "lodash";
import getInputs from "./get-inputs";

function getAliyunSecret(inputs: Record<string, any>, context: Record<string, any>) {
  const newInputs = { ...get(context, 'inputs.cloudSecrets'), ...get(context, 'inputs.sts'), ...inputs };
  return getInputs(newInputs, context);
}


export default getAliyunSecret;