var acch = angular.module('acch', ['ngRoute', 'ngAnimate', 'uiGmapgoogle-maps']);

// configure our routes
acch.config(function($routeProvider) {
  $routeProvider

      // route for the home page
      .when('/', {
          templateUrl : 'home.html',
          controller  : 'mainController'
      })
      .when('/locations', {
          templateUrl : 'map.html',
          controller  : 'mapController'
      })
      .when('/data-list', {
          templateUrl : 'list.html',
          controller  : 'listController'
      })
      .when('/testing-location', {
          templateUrl : 'testing-locations.html',
          controller  : 'mapController'
      })
      .when('/directions', {
          templateUrl : 'directions.html',
          controller  : 'directionsController'
      })
});

// create the controller and inject Angular's $scope
acch.controller('mainController', function($scope) {
   $scope.title = 'ACCH';
   $scope.pageClass = 'transition';
});

// Angular google maps controller
acch.controller('mapController', function($scope, $http) {
   $scope.map = {center: {latitude: 53.5333, longitude: -113.5000 }, zoom: 10 };
   $scope.pageClass = 'transition';
   // Edmonton data sets 
   $http.get('https://data.edmonton.ca/resource/px79-vegt.json').
    success(function(data) {
      $scope.posts = data;

       // console.log(data);
       var primary=[];
        for (var i=0; i<data.length; i++){
        if (data[i].primary  == "Sexual Health/Pregnancy" || data[i].primary  == "Addictions" ){
          primary.push(data[i]);
          }
        }

        var locations=[];
        for (var i=0; i<data.length; i++){
        if (data[i].primary  == "Sexual Health/Pregnancy" || data[i].primary  == "Addictions" ){
          locations.push({id: i , latitude: data[i].location.latitude , longitude: data[i].location.longitude});
          }
        }

        $scope.windowOptions = {
            visible: true
        };
        $scope.posts = primary;
        $scope.orgLocations = locations;
        console.log(primary)
      }).
      error(function(data, status, headers, config) {
      // log error
    });
  //end//
});

acch.controller('directionsController', function($scope, $http) {

var geoComponent = function() {

  var geolocateCallbackFunction = null;
  var continuousReference = null;

  function isSupported() {
    if(window.navigator.geolocation) {
      return true;
    } else {
      return false;
    }
  }

  function geolocateSuccess(position) {
    geolocateCallbackFunction(position);
  }

  // errors
  function geolocateError(error) {
    if (error.code === 1) {
      // User denied access to their location.
    }
    else if (error.code === 2) {
      // No position could be obtained.
    }
    else {
      // Request for location timed out.
    }
  }

  // return location
  return {
    geolocate: function(callback, maxAge, highAccuracy, continuous) {
      geolocateCallbackFunction = callback;

      if (maxAge === undefined) {
        maxAge = 3600000;
      }

      if (highAccuracy === undefined) {
        highAccuracy = false;
      }

      if (isSupported()) {
        if ((continuous !== undefined) && continuous) {
          continuousReference = navigator.geolocation.watchPosition(
            geolocateSuccess, geolocateError, {maximumAge: maxAge, 
            enableHighAccuracy: highAccuracy});
        }
        else {
          navigator.geolocation.getCurrentPosition(geolocateSuccess,
            geolocateError, {maximumAge: maxAge, enableHighAccuracy: highAccuracy});
        }
      }
    },
  };
}();

geoComponent.geolocate(function(data){
    var lat = data.coords.latitude;
    var lng = data.coords.longitude;
}, 10000, true);


  //Directions

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();

  var directionsMap = new google.maps.Map(document.getElementById('map-directions'), {
     zoom:7,
     mapTypeId: google.maps.MapTypeId.ROADMAP
  });

   directionsDisplay.setMap(directionsMap);
   directionsDisplay.setPanel(document.getElementById('panel'));

  var request = {
     origin: '116 St and 85 Ave, Edmonton, AB T6G 2R3, Canada', 
     destination: '12325 140 Street NW, Edmonton, AB',
     travelMode: google.maps.DirectionsTravelMode.DRIVING
  };

   directionsService.route(request, function(response, status) {
     if (status == google.maps.DirectionsStatus.OK) {
       directionsDisplay.setDirections(response);
     }
  });
});
