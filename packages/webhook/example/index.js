const getRawBody = require('raw-body');
const WebHook = require('./lib');

exports.handler = (req, resp, context) => {
  getRawBody(req, function (err, body) {
    if (err) {
      resp.statusCode = 400;
      resp.send(err.message);
      return;
    }

    req.body = body;

    console.log(JSON.stringify({
      path: req.path,
      queries: req.queries,
      headers: req.headers,
      method: req.method,
      requestURI: req.url,
      clientIP: req.clientIP,
      // body: body.toString()
    }, null, '    '));

    // const webHook = new WebHook({ path: '/webhook', secret: 'wss-test' });
    // const webHook = new WebHook({ path: '/webhook', secret: 'wss-test', events: 'push' });
    const webHook = new WebHook({ path: '/webhook', secret: 'wss-test', events: 'release' });
    webHook.on('error', function (err) {
      console.error('Error:', err.message);
      resp.send('');
    });
    webHook.on('push', function (event) {
      console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref)

      resp.send('');
    });
    webHook.on('issues', function (event) {
      console.log('Received an issue event for %s action=%s: #%d %s',
        event.payload.repository.name,
        event.payload.action,
        event.payload.issue.number,
        event.payload.issue.title)
      

      resp.send('');
    });
    webHook.on('*', function (event) {
      console.log('监听所有::\n', JSON.stringify(event, null, 2));
      resp.send('');
    });
    webHook.handler(req, (_e, _emitData) => {
      console.log(' 这是假的函数 ');
    });
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