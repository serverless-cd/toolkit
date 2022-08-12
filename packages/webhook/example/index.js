const getRawBody = require('raw-body');
const WebHook = require('./lib');
const { events } = require('./lib');
console.log('events::: ', events);

exports.handler = (req, resp, context) => {
  getRawBody(req, function (err, body) {
    for (var key in req.queries) {
      var value = req.queries[key];
      resp.setHeader(key, value);
    }
    resp.setHeader("Content-Type", "text/plain");

    console.log(JSON.stringify({
      path: req.path,
      queries: req.queries,
      headers: req.headers,
      method: req.method,
      requestURI: req.url,
      clientIP: req.clientIP,
      // body: body.toString()
    }, null, '    '));
    console.log('req:: ', req);

    resp.end('');

    // const webHook = new WebHook({ path: '/webhook', secret: 'wss-test' });
    // webHook.handler(req, resp, function (err) {
    //   resp.statusCode = 404
    //   resp.end('no such location', err)
    // })
    // webHook.on('error', function (err) {
    //   console.error('Error:', err.message)

    //   resp.send('');
    // })
    // webHook.on('push', function (event) {
    //   console.log('Received a push event for %s to %s',
    //     event.payload.repository.name,
    //     event.payload.ref)

    //   resp.send('');
    // })
    // webHook.on('issues', function (event) {
    //   console.log('Received an issue event for %s action=%s: #%d %s',
    //     event.payload.repository.name,
    //     event.payload.action,
    //     event.payload.issue.number,
    //     event.payload.issue.title)
      

    //   resp.send('');
    // })
    // webHook.on('*', function (event) {
    //   console.log('监听所有::\n', JSON.stringify(event, null, 2));
    //   resp.send('');
    // })
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