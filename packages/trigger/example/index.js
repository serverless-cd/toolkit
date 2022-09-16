const getRawBody = require('raw-body');
const trigger = require('./lib');

exports.handler = (req, resp, context) => {
  getRawBody(req, async function (err, body) {
    if (err) {
      resp.statusCode = 400;
      resp.send(err.message);
      return;
    }

    req.body = body;

    try {
      const payload = await trigger([{
        interceptor: 'github',
        eventType: 'push',
        secret: 'test',
        filter: 'body.ref in ["refs/heads/tes"]',
      }], {
        headers: req.headers,
        body: body.toString(),
      });
      // TODO: 调用 worker
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