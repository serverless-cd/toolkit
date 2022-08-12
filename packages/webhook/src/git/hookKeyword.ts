import Verify from "./verify";

export default function getHookKeyword (headers: { [key: string]: string }, secret: string) {
  // get platform
  const ua: string = headers['user-agent'] || '';
  const { verifyGithub, verifyGiteaGogs, verifyGitee, verifyGitlab, verifyCodeup } = new Verify(secret);

  // github
  if (ua.startsWith('GitHub-Hookshot')) {
    return {
      signatureKey: 'x-hub-signature',
      eventKey: 'x-github-event',
      idKey: 'x-github-delivery',
      verify: verifyGithub,
    }
  }

  // gitee
  if (ua === 'git-oschina-hook') {
    return {
      signatureKey: 'x-gitee-token',
      eventKey: 'x-gitee-event',
      idKey: 'x-gitee-timestamp',
      verify: verifyGitee,
    }
  }
  
  // gitlab
  if (headers['x-gitlab-token']) {
    return {
      signatureKey: 'x-gitlab-token',
      eventKey: 'x-gitlab-event',
      idKey: 'x-gitlab-token',
      verify: verifyGitlab,
    }
  }
  
  // gitea
  if (headers['x-gitea-signature']) {
    return {
      signatureKey: 'x-gitea-signature',
      eventKey: 'x-gitea-event',
      idKey: 'x-gitea-delivery',
      verify: verifyGiteaGogs,
    }
  }
  
  // gogs
  if (headers['x-gogs-signature']) {
    return {
      signatureKey: 'x-gogs-signature',
      eventKey: 'x-gogs-event',
      idKey: 'x-gogs-delivery',
      verify: verifyGiteaGogs,
    }
  }

  // codeup
  if (headers['x-codeup-token']) {
    return {
      signatureKey: 'x-codeup-token',
      eventKey: 'x-codeup-event',
      idKey: 'x-codeup-timestamp', // TODO: 关键字
      verify: verifyCodeup,
    }
  }

  throw new Error('Unrecognized product');
}
