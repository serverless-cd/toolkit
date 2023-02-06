export function getCicdEnv() {
  if (process.env.HOME === '/kaniko' && process.env.BUILD_IMAGE_ENV === 'fc-backend') {
    return 'app_center';
  }
  for (const key in process.env) {
    if (key.startsWith('CLOUDSHELL')) return 'cloud_shell';
    if (key.startsWith('PIPELINE')) return 'yunxiao';
    if (key.startsWith('GITHUB')) return 'github';
    if (key.startsWith('GITLAB')) return 'gitlab';
    if (key.startsWith('JENKINS')) return 'jenkins';
  }
  return process.platform;
}
