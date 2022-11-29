# 校验webhook与触发条件是否匹配，支持以下provider
- githb
- gitee
- gitlab
- codeup



## 基本使用

```ts
import verify from '@serverless-cd/trigger'
// 触发条件参数
const eventConfig = {
    "github": {
        "secret": "123",
        "pull_request": {
            "types": ["merged"],
            "branches": {
                "precise": [
                    {
                        "target": "main",
                        "source": "dev"
                    }
                ]
            }
        }
    }
} 
// webhook携带的参数
const payload = {} 
await verify(eventConfig, payload);
```

> 触发条件命中规则说明：exclude > precise > prefix > include

## 触发条件参数
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| github | github的触发条件 | [ITrigger](#ITrigger) | 选填 
| gitee  | gitee的触发条件  | [ITrigger](#ITrigger) | 选填
| gitlab | gitlab的触发条件 | [ITrigger](#ITrigger) | 选填 
| codeup | codeup的触发条件 | [ITrigger](#ITrigger) | 选填

## ITrigger
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| secret | 密钥 | string | 选填
| push  | push数据  | [IPush](#IPush) | 选填
| pull_request | pull request 数据 | [IPr](#IPr) | 选填

## IPush
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| branches | 分支匹配 | [IBranches](#IBranches) | 选填
| tags  | tag匹配  | [ITags](#ITags) | 选填

## IPr
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| types | pull request 的动作 | 枚举类型：opened、closed、reopened、merged | 必填
| branches  | 分支匹配  | [IPrBranches](#IPrBranches) | 选填

## IBranches
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| prefix | 前缀匹配 | string[] | 选填
| precise | 精确匹配 | string[] | 选填
| exclude | 精确排除 | string[] | 选填
| include | 前缀匹配 | string[] | 选填

## ITags 
- [同IBranches](#IBranches)
## IPrBranches
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| prefix | 前缀匹配 | [IPrefix](#IPrefix) | 选填
| precise | 精确匹配 | [同IPrefix](#IPrefix) | 选填
| exclude | 精确排除 | [同IPrefix](#IPrefix) | 选填
| include | 前缀匹配 | [同IPrefix](#IPrefix) | 选填

## IPrefix
| 参数 | 说明 | 类型 | 是否必填|
|-----|-----|-----|-----|
| target | 目标分支 | string | 必填
| source | 源分支 | string | 选填

具体使用可查看[测试用例](https://github.com/serverless-cd/toolkit/tree/master/packages/trigger/__tests__)
