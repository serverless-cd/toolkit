import Engine, { IStepOptions } from '../src';
import { get } from 'lodash';
import * as path from 'path';
const logPrefix = path.join(__dirname, 'logs');

test('系统命令:ls-la', async () => {
  const steps = [
    {
      script: 'await $`ls -la`\n',
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('promise', async () => {
  const steps = [
    {
      script: 'await Promise.all([$`sleep 1; echo 1`, $`sleep 2; echo 2`, $`sleep 3; echo 3`])\n',
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('fs', async () => {
  const steps = [
    {
      script:
        "let {name} = await fs.readJson(path.resolve('./package.json'))\nawait $`echo ${name}`\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('os', async () => {
  const steps = [
    {
      script: 'await $`cd ${os.homedir()}`\n',
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('path', async () => {
  const steps = [
    {
      script: "await $`ls -la ${path.resolve('./')}`\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('chalk', async () => {
  const steps = [
    {
      script: "console.log(chalk.blue('Hello world!'))\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('glob', async () => {
  const steps = [
    {
      script:
        "let packages = await glob(['package.json', 'packages/*/package.json'])\nawait $`echo ${packages}`\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('YAML', async () => {
  const steps = [
    {
      script: "console.log(YAML.parse('foo: bar').foo)\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('which', async () => {
  const steps = [
    {
      script: "let node = await which('node')\nawait $`echo ${node}`\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('文件绝对路径', async () => {
  const steps = [
    {
      script: path.resolve(__dirname, './script.js'),
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test.only('文件相对路径', async () => {
  const steps = [
    {
      script: './script.js',
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix }, cwd: __dirname });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('测试失败case', async () => {
  const steps = [
    {
      run: 'echo "hello"',
      id: 'xhello',
    },
    {
      script: "let node = await which('node')\nawait $`echo ${node1}`\n",
      id: 'xscript',
    },
    {
      run: 'echo "world"',
      id: 'xworld',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('failure');
});

test('cd', async () => {
  const steps = [
    {
      script: "cd('/tmp')\nawait $`pwd`\n",
      id: 'xscript',
    },
  ] as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});

test('支持魔法变量', async () => {
  const steps = [
    {
      script:
        'await Promise.all([$`sleep 1; echo ${{env.name}}`, $`sleep 2; echo ${{env.age}}`, $`sleep 3; echo 3`])\n',
      id: 'xscript',
      env: {
        name: 'xiaoming',
        age: 20,
      },
    },
  ] as unknown as IStepOptions[];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const res = await engine.start();
  expect(get(res, 'status')).toBe('success');
});
