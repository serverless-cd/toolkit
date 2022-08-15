# step 方法 

## 基本使用

```ts
import * as core from '@serverless-cd/core';

core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'serverless-pipeline.yaml'));
core.setServerlessCdVariable('LOG_PATH', path.join(process.cwd(), 'logs'));

await step();
```

- 您可以通过 `core.setServerlessCdVariable('TEMPLATE_PATH', value)` 指定yaml文件路径
- 您可以通过 `core.setServerlessCdVariable('LOG_PATH', value)` 指定日志文件的输出路径

## step的执行状态
我们可以通过 `steps[${step_id}].status` 来获取当前step的执行状态

- success
- failure
- error-with-continue
- skip


## 当前step获取其它step的输出
如果某一步骤是否需要执行依赖前面步骤的输出结果，则可以通过 `if: '{{ steps.xhello.output.code === 0 }}'` 来实现

```
steps:
   - run: echo "hello"
   id: xhello
   - run: echo "world"
   if: '{{ steps.xhello.output.code === 0 }}'
   id: xworld
```

### 状态检查函数
您可以使用以下状态检查函数作为 if 条件中的表达式。

- success() // 当前面的所有步骤没有失败时返回 `true`
- failure() // 在作业的任何之前一步失败时返回 `true`
- always() // 导致该步骤总是执行，并返回 `true`

#### failure
在执行步骤的过程中如果失败了还想继续执行某一步骤，则可以通过 `if: '{{ failure() }}'` 来实现

```
steps:
   - run: npm run error
   id: xerror
   - run: echo "world"
   if: '{{ failure() }}'
   id: xworld
```

当然，状态检测函数也可以和其它step的输出结果一起作为条件来判断当前步骤是否执行

```
steps:
   - run: echo "hello"
   id: xhello
   - run: npm run error
   id: xerror
   - run: echo "world"
   if: '{{ failure() && steps.xerror.output.code !== 0 }}'
   id: xworld
```

#### always
如果某一步骤不管其它步骤执行成功还是失败，都想执行当前步骤，则可以通过 `if: '{{ always() }}'` 来实现

```
steps:
   - run: npm run error
   id: xerror
   - run: echo "world"
   if: '{{ always() }}'
   id: xworld
```


### continue-on-error
如果某一步骤哪怕执行失败了，你也想继续正常的执行，则可以通过 `continue-on-error: true` 来实现

```
steps:
   - run: echo "hello"
   id: xhello
   - run: npm run error
   id: xerror
   continue-on-error: true
   - run: echo "world"
   id: xworld
```



