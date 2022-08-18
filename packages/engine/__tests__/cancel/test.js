const timer = setInterval(() => {
  console.log('测试父进程退出的时候，可以将正在执行的子进程取消掉');
}, 1000);

setTimeout(() => {
  clearInterval(timer);
}, 10000);
