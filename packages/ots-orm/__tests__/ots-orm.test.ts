require('dotenv').config({ path: require('path').join(__dirname, '.env') });
import Orm from '../src';

const config = {
  accessKeyId: process.env.ACCESS_KEY_ID as string,
  accessKeySecret: process.env.ACCESS_KEY_SECRET as string,
  instanceName: 'wss-serverless',
  region: 'ap-southeast-1',
};
const tableName = 'test_orm';
const indexName = 'test_orm_index';

describe('orm', () => {
  const id = new Date().getTime().toString();
  const orm = new Orm(config, tableName);

  test('findAllWithPk', async () => {
    const result = await orm.findAllWithPk(['id']);
    expect(result.length).toBeGreaterThan(0);
  });

  test.only('createTable', async () => {
    await orm.createTable([
      {
        name: 'gid',
        type: 'INTEGER',
      },
    ]);
  });

  test('find', async () => {
    console.log('test update end');

    console.log('find');
    const findPayload = await orm.find();
    console.log('findPayload: ', findPayload);

    const findOnePayload = await orm.findOne();
    console.log('findOnePayload: ', findOnePayload);

    const findAllPayload = await orm.findAll();
    console.log('findAllPayload: ', findAllPayload);

    const findByLikePayload = await orm.findByLike({ string: '123' });
    console.log('findByLikePayload: ', findByLikePayload);
    console.log('find end');
  });

  test('create', async () => {
    const attributeColumns = {
      string: '12345',
      obj: { key: 'value' },
      array: [1, 2, 3],
      number: 234,
      boolean: true,
    };
    console.log('test create');
    await orm.create([{ id }], attributeColumns);
    console.log('test create end');

    const createPayload = await orm.findByPrimary([{ id }]);
    // console.log('createPayload:: ', createPayload);
    expect(createPayload.id).toBe(id);
    expect(Array.isArray(createPayload.array)).toBeTruthy();
    expect(typeof createPayload.number).toBe('number');
    expect(typeof createPayload.boolean).toBe('boolean');

    console.log('test update');
    await orm.update([{ id }], { number: 456 });
    const updatePayload = await orm.findByPrimary([{ id }]);
    // console.log('updatePayload:: ', updatePayload);
    expect(updatePayload.number).toBe(456);
    expect(updatePayload.boolean).toBe(true);

    console.log('test delete');
    await orm.delete([{ id }]);
    const deletePayload = await orm.findByPrimary([{ id }]);
    expect(deletePayload.id).toBeUndefined();
    console.log('test delete end');
  });
});
