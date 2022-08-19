# 应用
`serverless-cd`支持通过npm module的形式进行拓展。

## 定义应用的输入
元数据文件基于`package.json`进行拓展。主要是增加输入值`inputs`的描述信息
```json
{
  "name": "@serverless-cd/app",
  "version": "0.0.1",
  "main": "lib/index.js",
  "inputs": {
    "milliseconds": {
      "required": true,
      "description": "input description here",
      "default": "default value if applicable"
    }
  }
}
```
> inputs的格式采用标准的[JSON Schema](https://json-schema.org/)进行描述


## 简单应用代码
基础应用代码
``` javascript
import * as core from '@serverless-cd/core'

function run({ inputs, context }) {
  core.info("aaa");
  try {
    // do something
  } catch(e) {
    throw new Error("错误信息【String】类型"); // 返回错误
  }
  return {}:
}
```

### 注意事项

#### Logging 日志
应用代码中不推荐使用`console.log`打印日志信息。原因是`step`步骤的输出信息需要持久化。类比GitHub Action的日志信息
![](https://docs.github.com/assets/cb-39565/images/help/repository/actions-quickstart-log-detail.png)

推荐使用`@serverless-cd/core`的日志方法.
- core.debug
- core.info
- core.warning
- core.error

#### DEBUG
如果`steps`日志中没有足够的信息定位出错的详细信息，使用打开debug日志进行故障的排除

```
env:
  DEBUG: true
```

#### Error 错误处理
错误信息会在执行引擎`Engine`捕获，只需要`throw new Error()`就可以。错误信息会出现在`steps.<step_id>.errorMessage`

#### return 
应用需要返回一个Object 对象`retrun {}`。这个对象的数据会出现在`steps.<step_id>.outputs`里
