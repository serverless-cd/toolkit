import crypto, { BinaryLike } from 'crypto';

export default class Verify {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  verifyGithub (signature: string, data: BinaryLike) {
    const sig = Buffer.from(signature)
    const signed = Buffer.from(`sha1=${crypto.createHmac('sha1', this.secret).update(data).digest('hex')}`)
    if (sig.length !== signed.length) {
      return false
    }
    return crypto.timingSafeEqual(sig, signed)
  }

  verifyGitee (signature: string, _data?: BinaryLike, json?: { [key: string]: any }) {
    if (json?.sign) {
      const sig = Buffer.from(signature)
      const signed = Buffer.from(crypto.createHmac('sha256', this.secret).update(`${json.timestamp}\n${this.secret}`).digest('base64'))
      if (sig.length !== signed.length) {
        return false
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
    const expected = crypto.createHmac('sha256', this.secret).update(JSON.stringify(json, null, 2)).digest('hex')
    return Buffer.from(expected).equals(Buffer.from(signature))
  }

  verifyCodeup(signature: string) {
    return signature === this.secret;
  }
}