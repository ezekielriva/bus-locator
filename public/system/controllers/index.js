'use strict';

angular.module('mean.system').controller('IndexController',
  ['$scope', 'Global', '$socketio', '$window', 'GoogleMaps',
  function ($scope, Global, $socketio, $window, GoogleMaps) {
  $scope.global = Global;
  $scope.user = $scope.global.user;
  $scope.latitude = '';
  $scope.longitude = '';
  $scope.users = [];
  $scope.marks = [];

  function emitPosition (latitude, longitude) {
    var data = {
      id: $scope.global.user._id,
      latitude: latitude,
      longitude: longitude
    };
    $socketio.emit('user location', data);
  }

  function changeMapCenter (latitude, longitude) {
    $scope.global.map.setCenter( new GoogleMaps.LatLng(latitude, longitude) );
  }

  function getPosition(callback) {
    navigator.geolocation.getCurrentPosition(function(position) {
      $scope.latitude = position.coords.latitude;
      $scope.longitude = position.coords.longitude;
      callback($scope.latitude, $scope.longitude);
    });
  }

  function drawMarks(users) {
    var marks,
        newMark,
        markIndex = -1;
    users.forEach(function(user) {
      marks = $scope.marks.filter(function(element, index) {
        if ( element.id === user.id ) {
          markIndex = index;
          return true;
        }
        return false;
      });

      if ( markIndex >= 0 ) {
        $scope.marks[markIndex].mark.position = new GoogleMaps.LatLng(user.latitude, user.longitude);
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

  function removeMarks() {
    $scope.marks.forEach(function(element) {
      element.mark.setMap(null);
    });
    $scope.marks = [];
  };


  $scope.$watch('global.user', function() {
    getPosition(emitPosition);
  });

  $socketio.on('retrieve users', function(data) {
    $scope.users = data;
    removeMarks();
    drawMarks($scope.users);
    console.log($scope.users);
  });

  if ($scope.global.authenticated) {
    getPosition(function (latitude, longitude) {
      emitPosition(latitude, longitude);
      changeMapCenter(latitude, longitude);
    });
  }

  setInterval(function() {
    if ($scope.global.authenticated) {
      getPosition(emitPosition);
    }
  }, 1000);
}]);

/*for(var i = 0; i < data.length; i++) {
      if (data[i].marker) {
        debugger;
      } else {
        data[i].marker =
      }
    }*/
