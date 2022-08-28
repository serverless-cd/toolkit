import crypto, { BinaryLike } from 'crypto';
import _ from 'lodash';

export default class Verify {
  private secret: undefined | string;

  constructor(secret?: string) {
    this.secret = secret;

    this.verifyGithub = this.verifyGithub.bind(this);
    // this.verifyGitee = this.verifyGitee.bind(this);
    // this.verifyGitlab = this.verifyGitlab.bind(this);
    // this.verifyGiteaGogs = this.verifyGiteaGogs.bind(this);
    // this.verifyCodeup = this.verifyCodeup.bind(this);
  }

  verifyGithub (signature: string, data: BinaryLike, _json?: any) {
    if (_.isEmpty(this.secret) && _.isEmpty(signature)) {
      return true;
    }
    const sig = Buffer.from(signature || '');
    const signed = Buffer.from(`sha1=${crypto.createHmac('sha1', this.secret as string).update(data).digest('hex')}`)
    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  }

  /**
  verifyGitee (signature: string, _data?: BinaryLike, json?: { [key: string]: any }) {
    if (json?.sign) {
      const sig = Buffer.from(signature || '')
      const signed = Buffer.from(crypto.createHmac('sha256', this.secret as string).update(`${json.timestamp}\n${this.secret}`).digest('base64'))
      if (sig.length !== signed.length) {
        return false;
      }
      return crypto.timingSafeEqual(sig, signed)
    } else {
      return signature === this.secret;
    }
  }

  verifyGitlab (signature: string) {
    return signature === this.secret;
  }

  verifyGiteaGogs (signature: string, _data?: BinaryLike, json?: { [key: string]: any}) {
    if (_.isEmpty(this.secret) && _.isEmpty(signature)) {
      return true;
    }
    const expected = crypto.createHmac('sha256', this.secret as string).update(JSON.stringify(json, null, 2)).digest('hex');
    return Buffer.from(expected).equals(Buffer.from(signature));
  }

  verifyCodeup(signature: string) {
    return signature === this.secret;
  }
 */
}