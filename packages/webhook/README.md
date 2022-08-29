## 使用方法

```
const { success, message } = await webHook({
	secret: SECRET,
	on: 'push',
	headers: req.headers,
	body: body.toString(),
});
```

```
success: boolean; // 事件没有验证是否通过
message: string;
```


# 触发webhook事件：github

### 语法

#### 字符串格式

````yaml
on: push
````

如果支持所有事件，可以指定 `*`

#### 数组格式

````yaml
on:
	- push
	- issue
````

#### 对象格式

````yaml
on:
  label:
    types:
      - created
  pull_request:
    branches:
      - main
      - 'releases/**'
  push:
    branches:
      - main
      - 'releases/**'
    paths:
      - '**.js'
````

目前事件对象配置支持的大致分为三种：

on.<event_name>.types
> 活动类型：
	`assigned`被分派到某个issue时触发
	`unassigned`删除分派时触发
	`labeled`打标签时触发
	`unlabeled`取消标签时触发
	`opened`创建pull request时触发
	`edited`编辑pull request时触发
	`closed`关闭pull request时触发
	`reopened`重新打开pull request时触发
	`synchronize`同步pull request代码时触发
	`ready_for_review`,pull request处于ready_for_review状态时触发
	`locked`,锁定时触发
	`unlocked`,解锁时触发
	`review_requested`,code review结束时触发
	`review_request_removedcode` review请求被删除时触发

on.push.<paths|paths-ignore|branches|tags|branches-ignore|tags-ignore> 
> push 事件支持的过滤：
>  `branches: [...]`指定符合条件的分支触发
>	`branches-ignore:[...]`指定除符合条件的分之外都触发
>	`tags:[...]`指定符合条件的tag触发
>	`tags-ignore:[...]`指定除符合条件的tag外都触发
>	`paths:[...]`代码中有符合条件的路径就触发(至少有一个存在)
>	`paths-ignore:[...]`代码中不存在指定的路径则都触发(至少有一个不存在)

> 上面的限制都允许使用通配符做匹配,支持的通配符包括(支持 [micromatch](https://www.npmjs.com/package/micromatch) 的语法)
> - `*`: 表示匹配0个或多个非/字符
> - `**`: 表示匹配0个或多个字符.
> - `?`: 表示匹配0个或者一个字符
> - `+`: 表示匹配至少一个字符
> - `[]`: 表示匹配一个范围内的字符,比如[0-9a-f]表示数字和a到f间的字符可以匹配
> - `!`: 在匹配字符串的开头表示否,其他位置没有特殊含义

on.pull_request.<branches|branches-ignore> 
> pull_request事件支持的过滤： 
> `branches: [...]`指定符合条件的分支触发
>	`branches-ignore:[...]`指定除符合条件的分之外都触发



## 参考文档

[workflow-syntax-for-github-actions](https://docs.github.com/cn/actions/using-workflows/workflow-syntax-for-github-actions)
[webhook-events-and-payloads](https://docs.github.com/cn/developers/webhooks-and-events/webhooks/webhook-events-and-payloads)
[events-that-trigger-workflows](https://docs.github.com/cn/actions/using-workflows/events-that-trigger-workflows)
