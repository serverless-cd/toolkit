<p align="center">
  <span><b>serverless-cd</b></span><br>
</p>
serverless-cd是基于Nodejs的轻量而灵活的开源框架，用户创建基于serverless架构的CI/CD系统。开发者可以方便的使用serverless-cd为底座，快速构建企业内部CI/CD应用平台。



# ✨ Features
- 基于`nodejs` + `NPM`生态，对前端开发者友好
- 使用`serverless`架构开发和部署。天然具备高性能，免运维的特性
- 灵活而强大的插件体系，开发者可以很方便的进行拓展


# 快速入门
## 部署
### 集成GitHub
获取GitHub `Personal access token`

### 使用`Serverless-Devs`快速部署
```bash
s init serverless-cd
cd serverless-cd
s deploy
```
部署完成后返回自定义域名格式为`xx.devsapp.net`


## 测试&使用
### 在根目录新建 `serverless-pipline.yaml`文件
```
name: 
on: [push]

steps:
- run: echo "🖥️ 启动测试case"
  id: start
- run: ls -la
  id: list
- run: echo "🍏 This steps's status is {{ steps.start.status }}."
```
### 添加Webhook
将部署返回的域名`xx.devsapp.net/webhook`添加到此GitHub仓库的Webhook上

### 修改并提交代码
修改并提交代码，查看输出内容

