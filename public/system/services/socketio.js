'use strict';

//Socketio service
angular.module('mean.system')
  .factory('$socketio', ['$window',
    function(window) {
      return window.io();
    }
]);
