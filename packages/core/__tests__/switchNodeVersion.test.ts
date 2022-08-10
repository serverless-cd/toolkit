import { switchNodeVersion, NODE_VERSIONS } from '../src';

test('版本不支持', () => {
  const version = '10';
  expect(() => switchNodeVersion(version)).toThrow(`Version ${version} is not supported`);
});

test('默认字段DEFAULT_PATH', () => {
  process.env.PATH = '';
  const version = '12';
  switchNodeVersion(version);
  expect(process.env.PATH).toMatch('/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin');
});

test('默认版本14', () => {
  const version = '14';
  expect(switchNodeVersion(version)).toBeUndefined();
});

test('版本12', () => {
  const version = '12';
  switchNodeVersion(version);
  expect(process.env.PATH).toMatch(`/home/node/.nvm/versions/node/${NODE_VERSIONS[version]}/bin`);
});

test('版本16', () => {
  const version = '16';
  switchNodeVersion(version);
  expect(process.env.PATH).toMatch(`/home/node/.nvm/versions/node/${NODE_VERSIONS[version]}/bin`);
});
