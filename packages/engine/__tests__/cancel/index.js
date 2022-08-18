const Engine = require('../../lib').default;
const path = require('path');
const core = require('@serverless-cd/core');
const { get, map, uniqueId } = require('lodash');

function getStep() {
  const pipelineContent = core.getYamlContent();
  const jobs = get(pipelineContent, 'jobs', {});
  let steps = [];
  for (const key in jobs) {
    steps = map(get(jobs[key], 'steps', []), (item) => {
      item.$stepCount = uniqueId();
      return item;
    });
    // 暂时只支持一个job
    break;
  }
  return steps;
}

core.setServerlessCdVariable('TEMPLATE_PATH', path.join(__dirname, 'cancel.yaml'));
const steps = getStep();
const engine = new Engine(steps);
engine.start();
setTimeout(() => {
  console.log('3秒后，可以将正在执行的子进程取消掉');
  engine.cancel();
}, 3000);
