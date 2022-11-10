import { getInputs } from '../src';

test.only('getInputs 测试', () => {
  const res = getInputs(
    {
      name: '{{secret.name}}',
      obj: {
        name: '{{secret.name}}',
        age: '{{env.age}}',
      },
      array: [
        {
          name: '{{secret.name}}',
          age: '{{env.age}}',
        },
      ],
    },
    {
      $variables: {
        env: { name: 'xiaoming', age: '20' },
        secret: { name: 'xiaohong' },
      },
    },
  );
  expect(res).toEqual({
    name: 'xiaohong',
    obj: { name: 'xiaohong', age: '20' },
    array: [{ name: 'xiaohong', age: '20' }],
  });
});
