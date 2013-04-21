function getCurrent(data, done) {
  var city = data.getChild('city'),
      forecast = data.getChild('forecast').getChildren('day')[0],
      current = data.getChild('current'),
      temperature = current.getChildText('t') ||
          forecast.getChild('t').getChildText('max'),
      humidity = current.getChildText('h') ||
          forecast.getChild('hmid').getChildText('max'),
      pressure = current.getChildText('p') ||
          forecast.getChild('p').getChildText('max'),
      pict = current.getChildText('pict') ||
          forecast.getChildText('pict'),

      currentWeather = {
        city: {
          id: city.attr('id'),
          name: city.getChildText('name'),
          region: city.getChildText('region'),
          country: city.getChild('country').getChildText('name')
        },
        temperature: temperature,
        humidity: humidity,
        pressure: pressure,
        pict: pict
      };

  done(null, currentWeather);
}

function forecastUrl(id) {
  return 'http://xml.weather.co.ua/1.2/forecast/' + id + '?lang=en&dayf=1';
}

function searchUrl(query) {
  return 'http://xml.weather.co.ua/1.2/city/?lang=en&search=' + query;
}

module.exports = {
  getCurrent: getCurrent,
  forecastUrl: forecastUrl,
  searchUrl: searchUrl
};
