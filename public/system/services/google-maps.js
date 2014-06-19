'use strict';

//Socketio service
angular.module('mean.system')
  .factory('GoogleMaps', ['$window',
    function($window) {
      return $window.google.maps;
    }
]);
