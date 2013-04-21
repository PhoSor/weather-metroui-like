function AppCtrl($scope, $http) {
  // var cityIds = [74223, 8750, 111218, 13484, 8345, 58058, 107, 62517, // 8
  // 115292, 17391, 19657, 57706, 8265, 3036, 93997, 4307, 102, 27]; // 10
  var cityIds = [74223, 8750, 111218, 13484, 8345, 58058, 107, 62517, 115292]; // 9

  function randomBetween(min, max, seed) {
    var seed = seed || Math.random();
    return Math.floor(seed * (max - min + 1)) + min;
  }

  function windowSize() {
    var width, height;

    if (document.body && document.body.offsetWidth) {
      width = document.body.offsetWidth;
      height = document.body.offsetHeight;
    }
    if (document.compatMode == 'CSS1Compat' &&
        document.documentElement &&
        document.documentElement.offsetWidth) {
      width = document.documentElement.offsetWidth;
      height = document.documentElement.offsetHeight;
    }
    if (window.innerWidth && window.innerHeight) {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    return {width: width, height: height};
  }

  function json(data) {
    var json;

    try {
      json = JSON.parse(data);
    } catch (except) {}

    return json;
  }

  function forecastUrl(idsArray) {
    return '/forecast/' + idsArray.join();
  }

  function onData(event, data) {
    event.stopPropagation();

    $scope.citiesWeather = data;
    $scope.$broadcast('update');
  }

  function onSearch(event, isHide) {
    $scope.$broadcast('hide', isHide);
  }

  $scope.randomBetween = randomBetween;
  $scope.json = json;
  $scope.window = windowSize();

  $scope.$on('data', onData);
  $scope.$on('search', onSearch);

  $http.get(forecastUrl(cityIds), {transformResponse: $scope.json}).
      success(function(data) {
        $scope.$emit('data', data);
      });
}



function SearchCtrl($scope, $http) {
  function searchUrl(query) {
    return '/search/' + query;
  }

  function search() {
    console.log('search', $scope.query);
    $scope.$emit('search', true);
    $http.get(searchUrl($scope.query), {transformResponse: $scope.json}).
        success(function(data) {
          $scope.$emit('data', data);
        });
  }

  $scope.search = search;
}



function CloudsCtrl($scope, $timeout) {
  var maxClouds = 8;

  function runCloud(cloud, i) {
    $timeout(function() {
      cloud.style.left = $scope.window.width + 'px';
      $timeout(function() {
        var cloud = makeCloud();
        $scope.clouds[i] = cloud;
        runCloud(cloud, i);
      }, cloud.duration * 1000);
    }, cloud.delay);
  };

  function makeCloud(isInit) {
    var seed = Math.random(),
        delay = isInit ? 0 : $scope.randomBetween(1 * 1000, 7 * 1000),
        duration = $scope.randomBetween(20, 70, seed),
        fontSize = $scope.randomBetween(90, 250, seed),
        left = isInit ?
            $scope.randomBetween(-fontSize * 2,
                $scope.window.width - 4 * fontSize) :
            -fontSize,
        top = $scope.randomBetween(74, $scope.window.height - fontSize),
        style = {
          '-webkit-transition-duration': duration + 's',
          'font-size': fontSize + 'pt',
          'left': left + 'pt',
          'top': top + 'px'
        },
        cloud = {
          delay: delay,
          duration: duration,
          icon: '5',
          style: style
        };

    return cloud;
  };

  function generateClouds() {
    var cloud;
    for (var i = 0; i < maxClouds; i++) {
      cloud = makeCloud(true);
      runCloud(cloud, i);
      $scope.clouds.push(cloud);
    }
  };

  $scope.clouds = [];

  generateClouds();
}



function CardsCtrl($scope, $timeout, $http) {
  var maxCards = 9,
      colors = ['bondi-blue', 'carrot', 'jade', 'indigo',
        'burgundy', 'grass', 'black-sea', 'sienna'],
      icons = {
        '_0_moon.gif': 'C',
        '_0_sun.gif': 'B',
        '_1_moon_cl.gif': 'I',
        '_1_sun_cl.gif': 'H',
        '_2_cloudy.gif': 'N',
        '_3_pasmurno.gif': 'Y',
        '_4_short_rain.gif': 'Q',
        '_5_rain.gif': 'R',
        '_6_lightning.gif': 'O',
        '_7_hail.gif': 'X',
        '_8_rain_swon.gif': 'V',
        '_9_snow.gif': 'U',
        '_10_heavy_snow.gif': 'W',
        '_255_NA.gif': ')'
      };

  function getColor(i) {
    return colors[i % colors.length];
  }

  function hide(isHide) {
    var color = '', hide = '', timeout = 54;

    angular.forEach($scope.cards, function(card, i) {
      $timeout(function() {
        color = card.classes[0];
        if (isHide) hide = 'hide';
        card.classes = [color, hide];
      }, timeout * i);
    });
  };

  function updateCards() {
    var color = '', weather = {};

    $scope.cards = $scope.citiesWeather.slice(0, maxCards);

    angular.forEach($scope.cards, function(card, i) {
      color = getColor(i);
      card.classes = [color, 'hide'];
      card.icon = icons[card.pict];
      if (card.city.country == 'United States Of America') {
        card.city.country = 'United States';
      }
    });

    $timeout(function() {
      hide(false);
    });
  }

  $scope.cards = [];

  $scope.$on('update', updateCards);
  $scope.$on('hide', hide);
}
