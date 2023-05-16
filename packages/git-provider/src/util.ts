import _ from "lodash";
import CUSTOM_ERROR_MESSAGE from "./constant/custom-errors";

export class CustomError extends Error {
  code: number | string;
  status: number;
  constructor(status: number, data: any, code?: string) {
    const messages = _.get(CUSTOM_ERROR_MESSAGE, `${status}`, {});
    const message = _.merge(data, messages);
    super(JSON.stringify(message));
    this.code = code || status;
    this.status = status;
  }
}
