import { startsWith, replace, get, isEmpty } from 'lodash';
// 最终返回失败结果
export const generateErrorResult = (message: any) => ({
  success: false,
  message,
});

// 最终返回成功结果
export const generateSuccessResult = (trigger: any) => ({
  success: true,
  trigger,
});

export const getPushInfo = (ref: string) => {
  if (startsWith(ref, 'refs/heads/')) {
    return { branch: replace(ref, 'refs/heads/', '') };
  }
  if (startsWith(ref, 'refs/tags/')) {
    return { tag: replace(ref, 'refs/tags/', '') };
  }
  throw new Error(`Unsupported ref: ${ref}, push event only support branch or tag`);
};

export const getPushInfoWithGitlab = (body: any) => {
  const ref = get(body, 'ref', '');
  const tag = get(body, 'tag', false);
  return { [tag ? 'tag' : 'branch']: ref };
};

export const getPrInfo = (body: any) => {
  const target = get(body, 'pull_request.base.ref');
  if (isEmpty(target)) {
    throw new Error('body.pull_request.base.ref is empty');
  }
  const source = get(body, 'pull_request.head.ref');
  if (isEmpty(source)) {
    throw new Error('body.pull_request.head.ref is empty');
  }
  return { target, source };
};

export const getPrInfoWithCodeup = (body: any) => {
  const branch = get(body, 'object_attributes.target_branch');
  if (isEmpty(branch)) {
    throw new Error('body.object_attributes.target_branch is empty');
  }
  return branch;
};
