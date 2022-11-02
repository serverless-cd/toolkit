import verifyLegitimacy from '../src';

test('check', async () => {
  // @ts-ignore
  const res = await verifyLegitimacy({}, {});
  console.log('res: ', res);
})