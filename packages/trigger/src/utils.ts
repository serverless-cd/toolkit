// 配置匹配的失败信息
export const generateErrorPayload = (message: string) => {
  console.error(message);
  return {
    message: message,
  };
};

// 最终返回失败结果
export const generateErrorResult = (results: any) => ({
  success: false,
  results,
});

// 最终返回成功结果
export const generateSuccessResult = (trigger: any) => ({
  success: true,
  trigger,
});
