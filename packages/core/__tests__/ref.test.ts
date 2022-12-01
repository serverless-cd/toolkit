import { getRef, parseRef } from '../src';

test('getRef 测试 branch', () => {
  const res = getRef({ type: 'branch', value: 'master' });
  expect(res).toBe('refs/heads/master');
});

test('getRef 测试 tag', () => {
  const res = getRef({ type: 'tag', value: 'v0.0.1' });
  expect(res).toBe('refs/tags/v0.0.1');
});

test('parseRef 测试 branch', () => {
  const res = parseRef('refs/heads/master');
  expect(res).toEqual({ type: 'branch', value: 'master' });
});

test('parseRef 测试 tag', () => {
  const res = parseRef('refs/tags/v0.0.1');
  expect(res).toEqual({ type: 'tag', value: 'v0.0.1' });
});
