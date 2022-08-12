import { ListenConfig } from "./types"

export const checkType = (options: ListenConfig) => {
  if (typeof options !== 'object') {
    throw new TypeError('must provide an options object');
  }

  if (typeof options.path !== 'string') {
    throw new TypeError('must provide a \'path\' option');
  }

  if (typeof options.secret !== 'string') {
    throw new TypeError('must provide a \'secret\' option');
  }
}

export const findHandler = (url: string, arr: ListenConfig | ListenConfig[]): ListenConfig => {
  if (!Array.isArray(arr)) {
    return arr
  }

  let ret = arr[0];
  for (const item of arr) {
    if (url === item?.path) {
      ret = item;
    }
  }
  return ret;
}

export const handlerEvents = (events: string | string[]): string[] => {
  // 为空时
  if (Array.isArray(events)) {
    return events.includes('*') ? [] : events;
  } else if (typeof events === 'string') {
    return events === '*' ? [] : [events];
  }

  throw new TypeError("must provide an 'events' array or string");
}

export function commonEvent (event: string) {
  if (event === 'Push Hook') {
    return 'push'
  }
  if (event === 'Issue Hook') {
    return 'issues'
  }
  return event
}

