const crypto = require('crypto');

export function verifyGithub(signature, data, json, options) {
  const sig = Buffer.from(signature);
  function sign(data) {
    return `sha1=${crypto.createHmac('sha1', options.secret).update(data).digest('hex')}`;
  }
  const signed = Buffer.from(sign(data));
  if (sig.length !== signed.length) {
    return false;
  }
  return crypto.timingSafeEqual(sig, signed);
}

export function verifyGitee(signature, data, json, options) {
  if (json.sign) {
    const sig = Buffer.from(signature);
    const signed = Buffer.from(
      crypto
        .createHmac('sha256', options.secret)
        .update(`${json.timestamp}\n${options.secret}`)
        .digest('base64'),
    );
    if (sig.length !== signed.length) {
      return false;
    }
    return crypto.timingSafeEqual(sig, signed);
  } else {
    return signature === options.secret;
  }
}

export function verifyGitlab(signature, data, json, options) {
  return signature === options.secret;
}

export function verifyGiteaGogs(signature, data, json, options) {
  const expected = crypto
    .createHmac('sha256', options.secret)
    .update(JSON.stringify(json, null, 2))
    .digest('hex');
  return Buffer.from(expected).equals(Buffer.from(signature));
}
