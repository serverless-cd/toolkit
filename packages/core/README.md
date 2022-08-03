# Serverless-CD 的核心方法

core 方法可以作用在插件体系中


1. getInput
   获取 input 的输入值

2. logging
   构建过程的日志是需要时时输出的，同时需要持久化保存。

```
const core = require('@serverless-cd/core');
core.debug('Inside try block');
core.info('Inside try block');
core.notice('Inside try block');
```

3. 
- setEnvVariable
   将变量导出到环境变量中，

```
core.setEnvVariable('envVar', 'Val');
```

- setServerlessCdVariable
  将变量导出到 SERVERLESS_CD 环境变量中
```
core.settEnvVariable('log_path', path.join(process.cwd(), 'log', `${Data.now()}.log`)');

```
4. setFailed
   将操作结果显示设置为失败

```
try {
  core.info(`Hello world`);
} catch (error) {
  core.setFailed(error.message);
}
```


## 参考

https://github.com/actions/toolkit/tree/main/packages/core
https://juejin.cn/post/6870372475188969479
