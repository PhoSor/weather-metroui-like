var http = require('http'),
    ltx = require('ltx');

function get(url, callback) {
  var data = '',
      request = {};

  function collectData(chunk) {
    data += chunk.toString();
  }

  function done() {
    var content = ltx.parse(data);
    callback(content);
  }

  function requestDone(response) {
    response.on('data', collectData);
    response.on('end', done);
  }

  request = http.get(url, requestDone);
}

module.exports = {
  get: get
};
