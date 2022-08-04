import * as hooks from './hooks';

export default async function (req: any) {
  const _path = req.path ? req.path.substr(1) : '';
  const _hook: any = hooks;
  const hook = _hook[_path];
  if (hook) {
    return await hook(req);
  }
}
