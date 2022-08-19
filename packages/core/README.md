# Serverless-CD 的核心方法

core 方法可以作用在插件体系中


##  setEnvVariable
将变量导出到环境变量中

```js
const core = require("@serverless-cd/core");
core.setEnvVariable('envVar', 'Val');
```
##  getEnvVariable
从环境变量中获取某个值

```js
const core = require("@serverless-cd/core");
core.getEnvVariable('envVar');
```

## setServerlessCdVariable
将变量导出到`SERVERLESS_CD环境变量`中

```js
const core = require("@serverless-cd/core");
core.settEnvVariable('LOG_PATH', path.join(process.cwd(), 'log', `${Data.now()}.log`)');
```

##  getServerlessCdVariable
从`SERVERLESS_CD环境变量`中获取某个值

```js
const core = require("@serverless-cd/core");
core.getServerlessCdVariable('LOG_PATH');
```

## logger(message, filePath)
构建过程的日志是需要时时输出的，同时需要持久化保存。
- message: 日出输出信息
- filePath: 日志文件保存路径，值为绝对路径时取当前值，值为相对路径时取 `path.join(getServerlessCdVariable('LOG_PATH'), filePath)`

```js
const { logger } = require("@serverless-cd/core");
logger.info('info message');
logger.error('error message');
// 开启debug
logger.enableDebug();
logger.debug('debug message');
```
## setFailed
将操作结果显示设置为失败

```js
const core = require("@serverless-cd/core");
try {
  core.info(`Hello world`);
} catch (error) {
  core.setFailed(error.message);
}
```
## getYamlContent
获取yaml文件的内容，您可以通过 `core.setServerlessCdVariable('TEMPLATE_PATH', value)`指定文件路径，默认取 `process.cwd()` 下的 `serverless-pipeline.yaml`文件

```js
const core = require("@serverless-cd/core");
core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'serverless-pipeline.yaml'))
const pipelineContent = core.getYamlContent()
```
## switchNodeVersion
切换node版本，可接收参数为`12、14、16`，默认版本为 `v14.20.0`

```js
const core = require("@serverless-cd/core");
core.switchNodeVersion('16')
```
## 参考

- https://github.com/actions/toolkit/tree/main/packages/core
- https://juejin.cn/post/6870372475188969479
