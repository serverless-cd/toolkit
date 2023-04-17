import { getAliyunSecret } from '../src';

test('input 存在', () => {
  const res = getAliyunSecret(
    {
      name: '${{secret.name}}',
    },
    {
      $variables: {
        secret: { name: 'xiaohong' },
      },
    },
  );
  console.log(res);
  expect(res).toEqual({ name: 'xiaohong' });
});

test('sts 存在', () => {
  const res = getAliyunSecret(
    {
    },
    {
      inputs: {
        sts: {
          name: '${{secret.name}}',
        }
      },
      $variables: {
        secret: { name: 'xiaohong' },
      },
    },
  );
  console.log(res);
  expect(res).toEqual({ name: 'xiaohong' });
});

test('cloudSecrets 存在', () => {
  const res = getAliyunSecret(
    {
    },
    {
      inputs: {
        cloudSecrets: {
          name: '${{secret.name}}',
        }
      },
      $variables: {
        secret: { name: 'xiaohong' },
      },
    },
  );
  console.log(res);
  expect(res).toEqual({ name: 'xiaohong' });
});
