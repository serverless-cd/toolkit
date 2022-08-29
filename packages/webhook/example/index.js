const getRawBody = require('raw-body');
const webHook = require('./lib');

exports.handler = (req, resp, context) => {
  getRawBody(req, async function (err, body) {
    if (err) {
      resp.statusCode = 400;
      resp.send(err.message);
      return;
    }

    req.body = body;

    console.log(JSON.stringify({
      headers: req.headers,
      clientIP: req.clientIP,
      body: body.toString()
    }, null, '    '));

    try {
      const payload = await webHook({
        secret: SECRET,
        on: 'push',
        headers: req.headers,
        body: body.toString(),
      });
      resp.send(JSON.stringify(payload));
    } catch (ex) {
      resp.statusCode = 500;
      resp.send(ex.toString())
    }
  });

  /*
  const getFormBody = require('body/form');
  getFormBody(req, function(err, formBody) {
      for (var key in req.queries) {
        var value = req.queries[key];
        resp.setHeader(key, value);
      }
      params.body = formBody;
      console.log(formBody);
      resp.send(JSON.stringify(params));
  }); 
  */
}