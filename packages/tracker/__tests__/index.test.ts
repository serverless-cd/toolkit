import tracker from '../src/index';
import { data } from './mock';

test('tracker test', async () => {
  const fn = async () => await tracker(data);
  expect(fn).not.toThrow();
});
