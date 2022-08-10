export const C_PROVIDER = {
  GITHUB: 'github',
  GITEE: 'gitee',
  GITLAB: 'gitlab',
  CODEUP: 'codeup',
};

export const C_HOOKS = {
  [C_PROVIDER.GITHUB]: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    WEBHOOK_URL: '',
    WEBHOOK_SECRET: 'serverless-cd',
    REDIRECT_URI: '',
  },
  [C_PROVIDER.GITEE]: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    WEBHOOK_URL: '',
    WEBHOOK_SECRET: 'serverless-cd',
    REDIRECT_URI: '',
  },
  [C_PROVIDER.GITLAB]: {
    WEBHOOK_URL: '',
    WEBHOOK_SECRET: 'serverless-cd',
  },
  [C_PROVIDER.CODEUP]: {
    CLIENT_ID: '',
    CLIENT_SECRET: '',
    WEBHOOK_URL: '',
    WEBHOOK_SECRET: 'serverless-cd',
  },
};
