import { getInputs, getSecretInputs } from '../src';

test('getInputs 测试', () => {
  const res = getInputs({
    inputs: {
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
    context: {
      env: { name: 'xiaoming', age: '20' },
    },
  });
  expect(res).toEqual({
    name: 'xiaoming',
    obj: { name: 'xiaoming', age: '20' },
    array: [{ name: 'xiaoming', age: '20' }],
  });
});

test('getSecretInputs 测试', () => {
  const res = getSecretInputs({
    inputs: {
      name: '{{secret.name}}',
      obj: {
        name: '{{secret.name}}',
        age: '{{env.age}}',
        long: '{{secret.long}}',
      },
      array: [
        {
          name: '{{secret.name}}',
          age: '{{env.age}}',
        },
      ],
    },
    context: {
      env: { name: 'xiaoming', age: '20', long: 'iamxiaoming' },
    },
  });
  expect(res).toEqual({
    name: '***',
    obj: { name: '***', age: '20', long: 'iam*****ing' },
    array: [{ name: '***', age: '20' }],
  });
});
