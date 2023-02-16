# Serverless-CD 日志上报
主要有几个作用
- 日志上报(tracker)
- 对操作事件进行审计
- 上报的资源进行展示

## tracker
通用日志请求
## aliyunFcTracker
发送阿里云函数计算的日志
## aliyunFcResource
获取AliyunFc的资源信息，用于前端数据展示

# 日志

## 遵循cloudEvent规范
![](https://img.alicdn.com/imgextra/i3/O1CN01zL8Qnm1huOXzCGsJZ_!!6000000004337-2-tps-1288-654.png)

## Serverless-Devs资源上报时机
![](https://img.alicdn.com/imgextra/i1/O1CN01zKC9Cr1scxEZlIu16_!!6000000005788-2-tps-1612-900.png)

## 阿里云Serverless相关资源
![](https://img.alicdn.com/imgextra/i1/O1CN01b30kWn1gkUMZKMm3f_!!6000000004180-2-tps-2436-1090.png)


## aliyun相关资源
### serverless资源
#### 函数计算(aliyun.fc)
```
aliyun.fc: "[{region:'cn-hangzhou', service: 'web-framework', function: 'start-egg'}]"
```
#### SAE(aliyun.sae)
```
aliyun.sae: ""
```

### 基础资源

#### NAS
```
aliyun.nas
```

#### 专有网络VPC
```
aliyun.vpc
```
#### 云服务器ECS
```
aliyun.ecs
```
#### RAM
```
aliyun.ram
```