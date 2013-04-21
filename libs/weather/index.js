var express = require('express'),
    app = express();
var async = require('async');

var weather = require('./weather');
var http = require('./http');

app.get('/forecast/:ids', function(request, response) {
  var ids = request.params.ids.split(',');

  function weatherRequest(id, done) {
    http.get(weather.forecastUrl(id), function(data) {
      done(null, data);
    });
  }

  function done(error, citiesWeather) {
    response.send(citiesWeather);
  }

  async.map(ids, weatherRequest, function(error, citiesForecast) {
    async.map(citiesForecast, weather.getCurrent, done);
  });
});

app.get('/search/:query', function(request, response) {
  var query = request.params.query;

  http.get(weather.searchUrl(query), function(cities) {
    var cityIds = [];

    cities = cities.getChildren('city');
    cityIds = cities.map(function(city) {
      return city.attr('id');
    });

    response.redirect('/forecast/' + cityIds.join());
  });
});

module.exports = app;
