# 表达式
表达式`Expression`的解析能力来自[art-template](https://github.com/aui/art-template)

## 关于表达式
您可以使用表达式设置环境变量以及访问context上下文等。
表达式通常和`if`关键词一起来配合确定当前步骤是否运行，如果`if`条件为`true`步骤将会运行

#### if条件表达式
```
steps:
  - uses: @serverless-cd/app
    if: {{ <expression> }}
```

#### 设置环境变量
```
env:
  MY_ENV_VAR: {{ <expression> }}
```

## 函数

### 状态检查函数
#### success
当前面的步骤没有失败或取消时返回 `true`

```
steps:
  ...
  - name: The job has succeeded
    if: {{ success() }}
```

#### always
该步骤总是执行，并返回 true，即使取消也一样。 作业或步骤在重大故障阻止任务运行时不会运行。 例如，如果获取来源失败。
```
if: {{ always() }}
```
####  cancelled
在工作流程取消时返回 true。
```
if: {{ cancelled() }}
```
#### failure
在作业的任何之前一步失败时返回 true。 如果您有相依作业链，failure() 在任何上层节点作业失败时返回 true
```
steps:
  ...
  - name: The job has failed
    if: {{ failure() }}
```
#### 有条件的失败
您可以为失败后运行的步骤添加额外的条件，但仍必须包含 failure() 以覆盖自动应用到不含状态检查功能的 if 条件的 success() 默认状态检查。
```
steps:
  ...
  - name: Failing step
    id: demo
    run: exit 1
  - name: The demo step has failed
    if: {{ failure() && steps.demo.status == 'failure' }}
```
