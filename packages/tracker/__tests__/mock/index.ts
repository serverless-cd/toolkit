export const data = {
  credentials: {
    Alias: 'default',
    AccessKeyID: 'xxx',
    AccessKeySecret: 'xxx',
    AccountID: 'xxx',
  },
  access: 'default',
  appName: 'hello-world-app',
  path: {
    configPath: '/Users/shihuali/workspace/core/test/fixtures/start-fc-http-nodejs14/a.yaml',
  },
  command: 'deploy',
  args: '-y --use-local -t a.yaml',
  argsObj: ['-y', '--use-local', '-t', 'a.yaml'],
  services: [
    {
      serviceName: 'helloworld',
      component: 'fc',
      access: 'default',
      credentials: {
        Alias: 'default',
        AccessKeyID: 'xxx',
        AccessKeySecret: 'xxx',
        AccountID: 'xxx',
      },
      props: {
        region: 'cn-hangzhou',
        service: {
          name: 'hello-world-service',
          description: 'hello world by serverless devs',
        },
        function: {
          name: 'A',
          description: 'hello world by serverless devs',
          runtime: 'nodejs14',
          codeUri: './code',
          handler: 'index.handler',
          memorySize: 128,
          timeout: 60,
          instanceConcurrency: 1,
          instanceType: 'e1',
        },
        triggers: [
          {
            name: 'httpTrigger',
            type: 'http',
            config: {
              authType: 'anonymous',
              methods: ['GET'],
            },
          },
        ],
        customDomains: [
          {
            domainName: 'auto',
            protocol: 'HTTP',
            routeConfigs: [
              {
                path: '/*',
                methods: ['GET', 'POST'],
              },
            ],
          },
        ],
      },
      output: {
        region: 'cn-hangzhou',
        service: {
          name: 'hello-world-service',
        },
        function: {
          name: 'A',
          runtime: 'nodejs14',
          handler: 'index.handler',
          memorySize: 128,
          timeout: 60,
        },
        url: {
          system_url: 'https://a-hello-w-service-dxmduuorfo.cn-hangzhou.fcapp.run',
          custom_domain: [
            {
              domain: 'http://a.hello-world-service.xxx.cn-hangzhou.fc.devsapp.net',
            },
          ],
        },
        triggers: [
          {
            type: 'http',
            name: 'httpTrigger',
          },
        ],
      },
      status: 'success',
    },
    {
      serviceName: 'next-helloworld',
      component: 'fc',
      access: 'default',
      credentials: {
        Alias: 'default',
        AccessKeyID: 'xxx',
        AccessKeySecret: 'xxx',
        AccountID: 'xxx',
      },
      props: {
        region: 'cn-hangzhou',
        service: {
          name: 'hello-world-service',
          description: 'hello world by serverless devs',
        },
        function: {
          name: 'B',
          description: 'hello world by serverless devs',
          runtime: 'nodejs14',
          codeUri: './code',
          handler: 'index.handler',
          memorySize: 128,
          timeout: 60,
          instanceConcurrency: 1,
          instanceType: 'e1',
        },
        triggers: [
          {
            name: 'httpTrigger',
            type: 'http',
            config: {
              authType: 'anonymous',
              methods: ['GET'],
            },
          },
        ],
        customDomains: [
          {
            domainName: 'auto',
            protocol: 'HTTP',
            routeConfigs: [
              {
                path: '/*',
                methods: ['GET', 'POST'],
              },
            ],
          },
        ],
      },
      output: {
        region: 'cn-hangzhou',
        service: {
          name: 'hello-world-service',
        },
        function: {
          name: 'B',
          runtime: 'nodejs14',
          handler: 'index.handler',
          memorySize: 128,
          timeout: 60,
        },
        url: {
          system_url: 'https://b-hello-w-service-dxmdxuorfo.cn-hangzhou.fcapp.run',
          custom_domain: [
            {
              domain: 'http://b.hello-world-service.xxx.cn-hangzhou.fc.devsapp.net',
            },
          ],
        },
        triggers: [
          {
            type: 'http',
            name: 'httpTrigger',
          },
        ],
      },
      status: 'success',
    },
    {
      serviceName: 'next-helloworld-2',
      component: 'fc',
      access: 'default',
      credentials: {
        Alias: 'default',
        AccessKeyID: 'xxx',
        AccessKeySecret: 'xxx',
        AccountID: 'xxx',
      },
      props: {
        region: 'cn-hangzhou',
        service: {
          name: 'hello-world-service',
          description: 'hello world by serverless devs',
        },
        function: {
          name: 'C',
          description: 'hello world by serverless devs',
          runtime: 'nodejs14',
          codeUri: './code',
          handler: 'index.handler',
          memorySize: 128,
          timeout: 60,
          instanceConcurrency: 1,
          instanceType: 'e1',
        },
        triggers: [
          {
            name: 'httpTrigger',
            type: 'http',
            config: {
              authType: 'anonymous',
              methods: ['GET'],
            },
          },
        ],
        customDomains: [
          {
            domainName: 'auto',
            protocol: 'HTTP',
            routeConfigs: [
              {
                path: '/*',
                methods: ['GET', 'POST'],
              },
            ],
          },
        ],
      },
      output: {
        region: 'cn-hangzhou',
        service: {
          name: 'hello-world-service',
        },
        function: {
          name: 'C',
          runtime: 'nodejs14',
          handler: 'index.handler',
          memorySize: 128,
          timeout: 60,
        },
        url: {
          system_url: 'https://c-hello-w-service-dxmdwuorfo.cn-hangzhou.fcapp.run',
          custom_domain: [
            {
              domain: 'http://c.hello-world-service.xxx.cn-hangzhou.fc.devsapp.net',
            },
          ],
        },
        triggers: [
          {
            type: 'http',
            name: 'httpTrigger',
          },
        ],
      },
      status: 'success',
    },
  ],
  status: 'success',
};
