export interface IRunOptions {
  run: string;
  $stepCount: string;
  id?: string;
  name?: string;
  if?: string;
  'continue-on-error'?: boolean;
  'working-directory'?: string;
}

export interface IUsesOptions {
  uses: string;
  $stepCount: string;
  id?: string;
  name?: string;
  if?: string;
  'continue-on-error'?: boolean;
  with?: { [key: string]: any };
}

export type IStepOptions = IRunOptions | IUsesOptions;

export type IStepsStatus = IStepOptions & { status: string };
