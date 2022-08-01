## exec
主要用户执行shell的命令

### 使用方式
```
const exec = require('@serverless-cd/exec');
await exec.exec('node', ['index.js', 'foo=bar']);

```

## 参考
https://github.com/actions/toolkit/tree/main/packages/exec