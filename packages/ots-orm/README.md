# OTS-ORM
详细使用文档请[前往](http://serverless-cd.cn/docs/dev-guide/toolkit/ots-orm)

## 使用

```
const Orm = require('@serverless-cd/ots-orm');

const orm = new Orm({
  accessKeyId: '',
  accessKeySecret: '',
  region: '',
  instanceName: '',
}, 'tableName', 'tableIndex');

// 查询单个TASK数据
async function findOne(primary1, primary2) {
  return orm.findByPrimary([{ userId }, { primary2 }]);
}
// 创建
async function create(primary1, primary2, params) {
  return orm.create([{ userId }, { primary2 }}], params);
}
// 查询列表
async function find(params = {}) {
  return await orm.find(params);
}
// 修改
async function update(primary1, primary2, params) {
  return orm.update([{ userId }, { primary2 }}], params);
}
// 删除
async function remove(primary1, primary2) {
  return orm.delete([{ userId }, { primary2 }]);
}

module.exports = {
  findOne,
  create,
  find,
  update,
  remove,
};

```
