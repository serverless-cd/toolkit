import { getStepContext } from '../src';
import { get } from 'lodash';

test('run step', () => {
  const context = {
    "status": "running",
    "completed": false,
    "cwd": "/workspace/cd/toolkit",
    "steps": [
      {
        "name": "Set up task",
        "status": "success",
        "process_time": 0,
        "stepCount": "0"
      },
      {
        "plugin": "/workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "id": "xuse",
        "inputs": {
          "milliseconds": 10
        },
        "stepCount": "1",
        "type": "run",
        "name": "Run /workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "status": "success",
        "outputs": {
          "success": true
        },
        "process_time": 0.05
      },
      {
        "run": "echo true",
        "stepCount": "3",
        "status": "success",
        "name": "Run echo ${{steps.xuse.outputs.success}}",
        "outputs": {},
        "process_time": 0.03
      },
      {
        "plugin": "/workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "id": "xuse",
        "inputs": {
          "milliseconds": 10
        },
        "stepCount": "2",
        "type": "postRun",
        "name": "Post Run /workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "runstepCount": "1",
        "status": "running"
      }
    ],
    "stepCount": "1",
    "$variables": {
      "status": "running",
      "steps": {
        "xuse": {
          "status": "success",
          "outputs": {
            "success": true
          }
        }
      },
      "env": {},
      "inputs": {}
    }
  }
  const res = getStepContext(context);
  console.log(res);
  expect(get(res, 'run.status')).toBe('success');
});

test('post run step', () => {
  const context = {
    "status": "running",
    "completed": false,
    "cwd": "/workspace/cd/toolkit",
    "steps": [
      {
        "name": "Set up task",
        "status": "success",
        "process_time": 0,
        "stepCount": "0"
      },
      {
        "plugin": "/workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "id": "xuse",
        "inputs": {
          "milliseconds": 10
        },
        "stepCount": "1",
        "type": "run",
        "name": "Run /workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "status": "success",
        "outputs": {
          "success": true
        },
        "process_time": 0.05
      },
      {
        "run": "echo true",
        "stepCount": "3",
        "status": "success",
        "name": "Run echo ${{steps.xuse.outputs.success}}",
        "outputs": {},
        "process_time": 0.03
      },
      {
        "plugin": "/workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "id": "xuse",
        "inputs": {
          "milliseconds": 10
        },
        "stepCount": "2",
        "type": "postRun",
        "name": "Post Run /workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "runstepCount": "1",
        "status": "running"
      }
    ],
    "stepCount": "2",
    "$variables": {
      "status": "running",
      "steps": {
        "xuse": {
          "status": "success",
          "outputs": {
            "success": true
          }
        }
      },
      "env": {},
      "inputs": {}
    }
  }
  const res = getStepContext(context);
  console.log(res);
  expect(get(res, 'run.status')).toBe('success');
});

test('post run step', () => {
  const context = {
    "status": "running",
    "completed": false,
    "cwd": "/workspace/cd/toolkit",
    "steps": [
      {
        "name": "Set up task",
        "status": "success",
        "process_time": 0,
        "stepCount": "0"
      },
      {
        "plugin": "/workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "id": "xuse",
        "inputs": {
          "milliseconds": 10
        },
        "stepCount": "1",
        "type": "run",
        "name": "Run /workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "status": "success",
        "outputs": {
          "success": true
        },
        "process_time": 0.05
      },
      {
        "run": "echo true",
        "stepCount": "3",
        "status": "success",
        "name": "Run echo ${{steps.xuse.outputs.success}}",
        "outputs": {},
        "process_time": 0.03
      },
      {
        "plugin": "/workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "id": "xuse",
        "inputs": {
          "milliseconds": 10
        },
        "stepCount": "2",
        "type": "postRun",
        "name": "Post Run /workspace/cd/toolkit/packages/engine/__tests__/fixtures/app",
        "runstepCount": "1",
        "status": "running"
      }
    ],
    "stepCount": "3",
    "$variables": {
      "status": "running",
      "steps": {
        "xuse": {
          "status": "success",
          "outputs": {
            "success": true
          }
        }
      },
      "env": {},
      "inputs": {}
    }
  }
  const res = getStepContext(context);
  console.log(res);
  expect(get(res, 'run.status')).toBe('success');
});