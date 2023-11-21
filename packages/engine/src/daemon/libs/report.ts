import axios from 'axios';
import { REPORT_BASE_URL } from '../../constants';
import { EReportType } from '../../types';

interface IReportCommand {
  type: EReportType.command,
  userAgent: string;
  plugin: string;
}

interface IRecordException {
  type: EReportType.exception,
  userAgent: string;
  plugin: string;
  message: string;
}

type IReportOptions = IReportCommand | IRecordException;

class Report {
  constructor(private options = {} as IReportOptions) { }
  async start() {
    const { type } = this.options;
    if (type === EReportType.command) {
      return await this.reportCommand();
    }
    if (type === EReportType.exception) {
      return await this.reportException();
    }
  }
  async reportCommand() {
    const { type, userAgent, plugin } = this.options as IReportCommand;
    const url = `${REPORT_BASE_URL}?APIVersion=0.6.0&trackerType=${type}&userAgent=${userAgent}&plugin=${plugin}`;
    await this.report(url)
  }
  async reportException() {
    const { type, userAgent, plugin, message } = this.options as IRecordException;
    const url = `${REPORT_BASE_URL}?APIVersion=0.6.0&trackerType=${type}&userAgent=${userAgent}&plugin=${plugin}&message=${message}`;
    await this.report(url)
  }
  async report(url: string) {
    await axios.get(url, { timeout: 3000 });
  }
}

export default Report;