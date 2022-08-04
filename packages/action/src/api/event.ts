export default (type: string, params: { [key: string]: any }) => {
  // TODO 触发pipeline
  return { type, params };
};
