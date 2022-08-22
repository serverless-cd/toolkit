# 解析引擎 engine
解析引擎`engine`本质是一个npm包`@serverless-cd/engine`，它主要负责`steps`执行步骤的处理，详情[查看](https://github.com/serverless-cd/serverless-cd-toolkit/tree/master/packages/engine)
```
steps:
  - run: echo "hello"
    id: xhello
  - run: echo "world"
    if: '{{ steps.xhello.status==="success" }}'
    id: xworld
```

## 使用方式

- 启动/终止
```ts
import Engine from '@serverless-cd/engine';
const engine = new Engine(spec); // spec是steps的JSON对象
engine.start(); // 启动
engine.cancel(); // 取消/终止
```
- 监听每个步骤的执行结果
```ts
engine.on('process', callback);
```

- 监听整个steps的执行结果
```ts
engine.on('failure', callback); 
engine.on('success', callback);
engine.on('cancelled', callback);
```
- 实现Stream的接口获取输出日志
```
engine.output.pipe()
```

## 状态检查函数
您可以使用以下状态检查函数作为 if 条件中的表达式。
### success
当前面的步骤没有失败或取消时返回 `true`

#### 示例
```yaml
steps:
  ...
  - name: The job has succeeded
    if: ${{ success() }}
```

### failure
当前面的步骤没有失败或取消时返回 `true` 

#### 示例
```yaml
steps:
  ...
  - name: The job has failed
    if: ${{ failure() }}
```

#### 有条件的失败
```yaml
steps:
  - run: echo "hello"
    id: xhello
  - run: npm run error
    id: xerror
  - run: echo "world"
    if: '{{ failure() && steps.xerror.status === "failure" }}'
    id: xworld
```

### always
导致该步骤总是执行，并返回 `true`

```
steps:
   - run: npm run error
     id: xerror
   - run: echo "world"
     if: '{{ always() }}'
     id: xworld
```


## continue-on-error
忽略某一步骤的执行错误，不影响执行步骤的全局状态

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


