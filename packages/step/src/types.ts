export interface IRunOptions {
  run: string;
  stepCount: string;
  name?: string;
  if?: string;
  'working-directory'?: string;
}

export interface IUsesOptions {
  uses: string;
  stepCount: string;
  name?: string;
  if?: string;
  with?: { [key: string]: any };
}

export type IStepOptions = IRunOptions | IUsesOptions;
