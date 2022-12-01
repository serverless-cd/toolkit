import { startsWith, replace } from 'lodash';
interface IConfig {
  type: 'branch' | 'tag';
  value: string;
}

export function getRef(config: IConfig) {
  const { type, value } = config;
  if (type === 'branch') {
    return `refs/heads/${value}`;
  }
  if (type === 'tag') {
    return `refs/tags/${value}`;
  }
  throw new Error(`Unsupported type: ${type}`);
}

export function parseRef(ref: string) {
  if (startsWith(ref, 'refs/heads/')) {
    return {
      type: 'branch',
      value: replace(ref, 'refs/heads/', ''),
    };
  }
  if (startsWith(ref, 'refs/tags/')) {
    return {
      type: 'tag',
      value: replace(ref, 'refs/tags/', ''),
    };
  }
  throw new Error(`Unsupported ref: ${ref}`);
}
