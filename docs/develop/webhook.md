# webhook触发
webhook触发主要分为以下几类
### [触发webhook事件](#触发webhook事件)
- GitHub触发
- Gitee触发
- Gitlab触发
- Gitea触发
- Codeup触发

### 定时事件(#定时事件)
- 定时事件

## 触发webhook事件
语法：
```
on:
  push: # 动作
    branches: [master]
```


### create

分支,tag创建时触发

### delete

分支,tag删除时触发

### push/pull_request

`push`是当有对仓库的push操作时触发;`pull_request`则是在执行`pull request`中触发


示例：
```
on:
  push:
    # Sequence of patterns matched against refs/heads
    branches:    
      - main
      - 'mona/octocat'
      - 'releases/**'
    # Sequence of patterns matched against refs/tags
    tags:        
      - v2
      - v1.*
```

这两个事件可以额外限制:

- `branches: [...]`指定符合条件的分支触发
- `branches-ignore:[...]`指定除符合条件的分之外都触发
- `tags:[...]`指定符合条件的tag触发
- `tags-ignore:[...]`指定除符合条件的tag外都触发
- `paths:[...]`代码中有符合条件的路径就触发(至少有一个存在)
- `paths-ignore:[...]`代码中不存在指定的路径则都触发(至少有一个不存在)
上面的限制都允许使用通配符做匹配,支持的通配符包括:

- `*`: 表示匹配0个或多个非/字符
- `**`: 表示匹配0个或多个字符.
- `?`: 表示匹配0个或者一个字符
- `+`: 表示匹配至少一个字符
- `[]`: 表示匹配一个范围内的字符,比如[0-9a-f]表示数字和a到f间的字符可以匹配
- `!`: 在匹配字符串的开头表示否,其他位置没有特殊含义
`pull_request`默认的行为是在`merge`完成后处理`merge`后的那次提交中的代码. 我们还可以通过`types: [...]`字段指定细分事件类型,包括:

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

### release

当执行Github release时触发,使用的代码时release时打tag的代码,类似于pull_request,也可以通过types:[...]来指定细分事件.

- `published`公开后执行
- `unpublished`取消公开后执行
- `created` 创建后执行
- `edited` 编辑后执行
- `deleted` 删除后执行
- `prereleased` 预发布后执行
- `released` 发布后执行

## 定时事件
```
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    - cron:  '*/15 * * * *'
```
上面定义了一个每隔15分钟执行依次的任务，使用Serverless平台的[定时触发器](https://help.aliyun.com/document_detail/171746.html)

