var express = require('express'),
    app = express();
var port = process.env.PORT || 3000;

var weather = require('./libs/weather');

function start() {
  // app.use(express.logger('short'));
  app.use(express.static(__dirname + '/public'));

  app.use(weather);

  app.listen(port);
  console.log('Listening on port', port);
}

exports.start = start;

start();
