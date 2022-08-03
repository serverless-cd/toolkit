export interface IGit {
  logger: any;
  execDir: string;
  provider: string;
  path_with_namespace: string;
  token: string;
  username: string;
  uri: string;
}
export interface IPush extends IGit {
  branch: string;
  commit: string;
}

export interface ITag extends IGit {
  tag: string;
}

export type IInputs = IPush | ITag;

export function isTag(args: IInputs): args is ITag {
  return 'tag' in args;
}
