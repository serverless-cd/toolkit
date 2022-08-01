import step from '../src';

test('step', async () => {
  expect(await step()).toBeUndefined();
});
