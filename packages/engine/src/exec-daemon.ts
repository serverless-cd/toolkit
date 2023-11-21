import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs-extra';

function execDaemon(filename: string, config: Record<string, any> = {}) {
  const filePath = path.join(__dirname, 'daemon', filename);
  if (!fs.existsSync(filePath)) return;
  if (process.env['serverless_devs_daemon_enable'] === 'false') {
    return spawn(process.execPath, [filePath, JSON.stringify(config)], {
      stdio: 'inherit',
    });
  }

  return spawn(process.execPath, [filePath, JSON.stringify(config)], {
    detached: true,
    stdio: 'ignore',
  }).unref();
}

export default execDaemon;
