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

export type IStatus = 'success' | 'failure' | 'cancelled';
export interface IContext {
  status: IStatus; // 记录全局的执行状态
  editStatusAble: boolean; // 记录全局的执行状态是否可修改（一旦失败，便不可修改）
  steps: IStepOptions[]; // 记录每个 step 的执行状态以及输出，后续step可以通过steps[$step_id].outputs使用该数据
  [key: string]: any; // 其他数据(item.$stepCount)
}