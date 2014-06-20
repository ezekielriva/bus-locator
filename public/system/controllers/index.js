'use strict';

angular.module('mean.system').controller('IndexController',
  ['$scope', 'Global', '$socketio', '$window', 'GoogleMaps', '$rootScope',
  function ($scope, Global, $socketio, $window, GoogleMaps, $rootScope) {
  console.log('IndexController');
  $scope.global = Global;
  $scope.user = $scope.global.user;
  $scope.latitude = '';
  $scope.longitude = '';
  $scope.users = [];
  $scope.marks = [];

  function emitPosition (latitude, longitude) {
    console.log($scope.global.user._id);
    var data = {
      id: $scope.global.user._id,
      latitude: latitude,
      longitude: longitude
    };
    $socketio.emit('send:user_location', data);
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

  function drawMarks(users) {
    var newMark,
        markIndex = -1;
    users.forEach(function(user) {

      $scope.marks.filter(function(element, index) {
        if ( element.id === user.id ) {
          markIndex = index;
          return true;
        }
        return false;
      });

      if ( markIndex >= 0 ) {
        $scope.marks[markIndex].mark.setPosition( new GoogleMaps.LatLng(user.latitude, user.longitude) );
      } else {
        if ( user.id ) {
          newMark = new GoogleMaps.Marker({
            map: $scope.global.map,
            draggable:false,
            position: new GoogleMaps.LatLng(user.latitude, user.longitude)
          });
          $scope.marks.push({ id: user.id, mark: newMark });
        }
      }

    });
  }

  $socketio.on('response:users', function(data) {
    $scope.$apply(function(scope) {
      scope.users = data;
    });
    drawMarks($scope.users);
  });

  $socketio.on('user:disconnect', function(userId) {
    var markIndex, markElement;
    $scope.marks.filter(function(element, index) {
      if ( element.id === userId ) {
        markIndex = index;
        return true;
      }
      return false;
    });

    if ( markIndex >= 0 ) {
      markElement = $scope.marks[markIndex];
      $scope.marks.splice(markIndex, 1);
      markElement.mark.setMap(null);
    }
  });

  $socketio.on('disconnect', function() {
    $window.location = '/logout';
  });

  getPosition(function(latitude, longitude) {
    changeMapCenter(latitude, longitude);
    if ($scope.global.authenticated) {
      emitPosition(latitude, longitude);
    }
  });

  $rootScope.$on('loggedin', function() {
    $scope.global.user = $rootScope.user;
    getPosition(emitPosition);
  });

  if ($scope.global.authenticated) {
    setInterval(function() {
      getPosition(emitPosition);
    }, 1000);
  }
}]);

/*for(var i = 0; i < data.length; i++) {
      if (data[i].marker) {
        debugger;
      } else {
        data[i].marker =
      }
    }*/
