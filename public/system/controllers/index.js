'use strict';

angular.module('mean.system').controller('IndexController',
  ['$scope', 'Global', '$socketio', '$window', 'GoogleMaps', '$rootScope',
  function ($scope, Global, $socketio, $window, GoogleMaps, $rootScope) {
  console.log('IndexController');
  $scope.global = Global;
  $scope.user = $scope.global.user;
  $scope.latitude = '';
  $scope.longitude = '';
  $scope.users = {};
  $scope.marks = {};
  var interval;

  function emitPosition (latitude, longitude) {
    console.log($scope.global.user._id);
    var data = {
      id: $scope.global.user._id,
      latitude: latitude,
      longitude: longitude
    };
    if (data.id) {
      drawMark(data);
      $socketio.emit('send:user_location', data);
    }
  }

  function changeMapCenter (latitude, longitude) {
    $scope.global.map.setCenter( new GoogleMaps.LatLng(latitude, longitude) );
  }

  function getPosition(callback) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.$apply(function(scope) {
        scope.latitude = position.coords.latitude;
        scope.longitude = position.coords.longitude;
      });
      if (callback) {
        callback($scope.latitude, $scope.longitude);
      }
    });
  }

  function drawMark (user) {
    if ( $scope.marks[user.id] ) {
      $scope.marks[user.id].setPosition( new GoogleMaps.LatLng(user.latitude, user.longitude) );
    } else {
      $scope.marks[user.id] = new GoogleMaps.Marker({
        map: $scope.global.map,
        draggable:false,
        position: new GoogleMaps.LatLng(user.latitude, user.longitude)
      });
    }
  }

  $socketio.on('send:update_location', function(user) {
    console.log(user);
    if ( user.id ) {
      $scope.$apply(function(scope) {
        scope.users[user.id] = user;
        drawMark(user);
      });
    }
  });

  $socketio.on('user:disconnect', function(userId) {
    $scope.marks[userId].setMap(null);
    delete $scope.marks[userId];
  });

  $socketio.on('disconnect', function() {
    $window.location = '/logout';
  });

  $rootScope.$on('loggedin', function() {
    $scope.global.authenticated = !! $rootScope.user;
    $scope.global.user = $rootScope.user;
  });

  $scope.$on('$destroy', function (event) {
    $socketio.removeAllListeners();
    clearInterval(interval);
  });

  function initInterval () {
    return setInterval(function() {
      getPosition(emitPosition);
    }, 3000);
  }

  if ($scope.global.authenticated) {
    console.log('Auth');
    clearInterval(interval);
    getPosition(emitPosition);
    interval = initInterval();
  }

  getPosition(changeMapCenter);

}]);
