/**
 * TODO
 */
// 当前进程是否在进行中
export const Action = process.env['STATE'] === 'runing';

export const ExecDir = (process.env['execDir'] as string) || '';
