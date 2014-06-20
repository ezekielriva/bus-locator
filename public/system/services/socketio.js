'use strict';

//Socketio service
angular.module('mean.system')
  .factory('$socketio', ['$window', 'Global',
    function($window, Global) {
      if ( Global.connected ) {
        return Global.io;
      } else {
        Global.io = $window.io();
        Global.connected = true;
        return Global.io;
      }
    }
]);
