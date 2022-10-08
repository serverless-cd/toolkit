This app checks-out your repository, so your workflow can access it.

# checkout ref

```yaml
- uses: @serverless-cd/checkout
  inputs:
    token: xxx
    provider: gitee
    username: shihuali
    url: https://gitee.com/shihuali/checkout.git
    ref: refs/heads/test
```

# checkout ref (branch case)

```yaml
- uses: @serverless-cd/checkout
  inputs:
    token: xxx
    provider: gitee
    username: shihuali
    url: https://gitee.com/shihuali/checkout.git
    ref: refs/heads/test
```

# checkout ref (tag case)

```yaml
- uses: @serverless-cd/checkout
  inputs:
    token: xxx
    provider: gitee
    username: shihuali
    url: https://gitee.com/shihuali/checkout.git
    ref: refs/tags/0.0.2
```


# checkout commit

```yaml
- uses: @serverless-cd/checkout
  inputs:
    token: xxx
    provider: gitee
    username: shihuali
    url: https://gitee.com/shihuali/checkout.git
    commit: 3b763ea19e8e8a964e90e75962ccb8e0d68bdf46
```

# checkout latest

```yaml
- uses: @serverless-cd/checkout
  inputs:
    token: xxx
    provider: gitee
    username: shihuali
    url: https://gitee.com/shihuali/checkout.git
```