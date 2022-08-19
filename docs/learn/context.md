# 上下文(context)
您可以在工作流程和操作中访问上下文的信息

## 关于上下文
context是访问相关步骤(steps)信息的方式，每个context都是一个包含属性的对象(Object)。

从实现原理的角度来看，context本质是[xstate](https://xstate.js.org/)状态机中[context对象](https://xstate.js.org/docs/guides/context.html)



| 上下文名称 | 类型 | 描述 |
| --- | --- | --- |
| steps   | 对象 |  有关当前作业中已运行的步骤的信息。详情查阅[steps上下文](#steps上下文) |


## steps上下文
steps上下文包含有关当前作业指定了`id`,并且已运行的当前步骤的信息

| 属性名称 | 类型 | 描述 |
| --- | --- | --- |
| steps   | Object |  此上下文针对作业中的每个步骤而改变。 您可以从作业中的任何步骤访问此上下文。 此对象包含下面列出的所有属性。|
| steps.<step_id>.outputs   | Object | 当前步骤Javascript应用执行完成return的值，可用于下一执行步骤使用 |
| steps.<step_id>.status   | String | 当前步骤的执行结果，值包括：`success`, `failure`,`cancelled`,`skipped`,`error-with-continue` |
| steps.<step_id>.errorMessage   | String | 当前步骤`status`为`failure`时候，当前字段不为空，其他状态都为空 |

### `steps`上下文示例内容
```json
{
  "checkout": {
    "status": "success",
    "outputs": {}
  },
  "generate_number": {
    "outputs": {
      "timestamp": 1660808716816
    },
    "errorMessage": "错误信息",
  }
}
```
### `steps`上下文的示例用法
```yaml
name: "On Push master"
on: push
steps:
  - run: echo "hello"
    id: xhello
  - run: npm run error
    id: xerror
  - run: echo "end"
    id: xend
    if: '{{ failure() && steps.xerror.status === "success" }}'
```

### steps执行状态(status)
steps的状态分为两种:
1. 执行过程中的状态:
- `success`
- `failure`
- `cancelled`
- `skipped`
- `error-with-continue`

2. 最终执行结果的状态
- `success`
- `failure`
- `cancelled`

## env上下文
env上下文包含已经在整体step设置的环境
可以使用操作系统的正常方法读取环境变量。

| 属性名称 | 类型 | 描述 |
| --- | --- | --- |
| env   | 对象 |  此上下文针对作业中的每个步骤而改变。 您可以从任何步骤访问此上下文 |
| env.<env_name>   | 字符串 |  特定环境变量的值 |

### env 上下文的示例内容
env 上下文的内容是环境变量名称与其值的映射。 上下文的内容可能会根据工作流运行中的使用位置而更改。
```
{
  "first_name": "heimanba"
  "age": 30
}
```
### env 上下文的示例用法
此示例演示如何在全局以及`steps`步骤配置`env`上下文，以及如何在步骤中使用上下文
> 当多个环境变量使用相同的名称定义时候，会使用最特殊的环境变量生效，也就是说`steps`级别的环境变量会覆盖全局的环境变量
``` yaml
name: Hi Heimanba
on: push
env:
  name: Heimanba
  age: 30

steps:
  - run: echo 'Hi {{ env.name }}'  # Hi Heimanba
  - run: echo 'Hi {{ env.name }}'  # Hi Tony
    env:
      name: Tony
```