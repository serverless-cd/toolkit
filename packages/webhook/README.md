## 参考
- github webhook
https://github.com/rvagg/github-webhook-handler

- git webhook
 https://github.com/Rem486/git-webhook-handler

- gitee webhook 文档
https://gitee.com/heimanba/todolist-app-vz/hooks/1083859/edit#hook-logs

- ngrok
    - ./ngrok config add-authtoken 1reg8lZ7BPj6p0hcqkM4kmtEqPv_7se55bDNc7oKnPTN7qyVW
    - ./ngrok http 80


## 项目调试

### 本地调试
1. 打开一个终端，执行 npm run watch。
2. 然后打开另一个终端执行 cd example && s local start --server-port 3000。
3. 然后在本地模拟仓库的 hook 请求就可以了。

### 真机调试（FC 环境）

1. 执行 npm run esbuild
2. cd example && s deploy
3. 触发 webhook