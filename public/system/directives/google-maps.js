'use strict';

angular.module('mean.system').directive('googleMaps', ['GoogleMaps', 'Global',
  function(GoogleMaps, Global) {
    return {
      restrict: 'E',
      template: '<div id="map" style="height: 600px; width: 100%;"></div>',
      controller: function() {
        var mapOptions;
        if ( GoogleMaps ) {
          mapOptions = {
            center: new GoogleMaps.LatLng(-34.397, 150.644),
            zoom: 14,
            mapTypeId: GoogleMaps.MapTypeId.ROADMAP
          };
          Global.map = new GoogleMaps.Map(document.getElementById('map'), mapOptions);
        }
      }
    };
  }]);
