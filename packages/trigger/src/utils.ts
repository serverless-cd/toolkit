export const generateErrorResult = (message: string) => {
  console.error(message);
  return {
    success: false,
    error: {
      message: message,
    },
  };
};