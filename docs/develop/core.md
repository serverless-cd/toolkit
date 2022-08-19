# @serverless-cd/engine
core 包用于解析`serverless-pipeline.yaml`,日志处理，环境变量工作

## 使用
### 导入package
```
// javascript
const core = require('@serverless-cd/core');

// typescript
import * as core from '@serverless-cd/core';
```


### Logging 日志
应用代码中不推荐使用`console.log`打印日志信息。原因是`step`步骤的输出信息需要持久化。类比GitHub Action的日志信息
![](https://docs.github.com/assets/cb-39565/images/help/repository/actions-quickstart-log-detail.png)

推荐使用`@serverless-cd/core`的日志方法.
- core.debug
- core.info
- core.warning
- core.error

#### 开启DEBUG
如果`steps`日志中没有足够的信息定位出错的详细信息，使用打开debug日志进行故障的排除

```
env:
  DEBUG: true
```

### 