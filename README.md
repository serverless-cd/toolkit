## 资料
https://docs.github.com/cn/actions/using-workflows/workflow-syntax-for-github-actions#exit-codes-and-error-action-preference

## 开发注意事项

- 目前发现node版本14.x存在问题，可以安装16.x版本进行测试
- 根路径下 npm i 进行安装 （删除node_modules和package-lock.json文件）
- 根路径下 npm run build 对每个package进行打包
- npm run test 对所有package进行测试
- npm run test-one 对指定package进行测试 
    - core："test-one": "jest --testTimeout 10000 packages/core"
    - step："test-one": "jest --testTimeout 10000 packages/step"