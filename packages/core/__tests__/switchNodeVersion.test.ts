import { default as switchNodeVersion, VERSIONS } from '../src/switchNodeVersion';

test('版本不支持', () => {
  const version = '10';
  expect(() => switchNodeVersion(version)).toThrow(`Version ${version} is not supported`);
});

test('版本12', () => {
  const version = '12';
  switchNodeVersion(version);
  expect(process.env.PATH).toMatch(`/home/node/.nvm/versions/node/${VERSIONS[version]}/bin`);
});

test('版本16', () => {
  const version = '16';
  switchNodeVersion(version);
  expect(process.env.PATH).toMatch(`/home/node/.nvm/versions/node/${VERSIONS[version]}/bin`);
});
