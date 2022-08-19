# 解析引擎 engine
解析引擎`engine`本质是一个npm包`@serverless-cd/engine`，它主要负责`steps`执行步骤的处理，详情[查看](https://github.com/serverless-cd/serverless-cd-toolkit/tree/master/packages/engine)
```
steps:
  - run: echo "hello"
    id: xhello
  - run: echo "world"
    if: '{{ steps.xhello.output.code === 0 }}'
    id: xworld
```

## 使用方式

- 启动/终止
```
const engine = new Engine(spec); # spce是steps的JSON对象
engine.start(); # 启动
engine.cancel();  # 取消/ 终止
```
- 监听每个步骤的执行结果
```
engine.on('process', callback);
```

- 监听整个steps的执行结果
```
engine.on('failure', callback); 
engine.on('success', callback);
engine.on('cancelled', callback);
```
- 实现Stream的接口获取输出日志
```
engine.output.pipe()
```


