'use strict';

//Socketio service
angular.module('mean.system')
  .factory('GoogleMaps', ['$window',
    function($window) {
      console.log('GoogleMaps');
      return $window.google.maps;
    }
]);
