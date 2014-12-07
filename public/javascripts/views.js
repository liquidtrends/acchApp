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

// Geolocation
    $scope.lat = "0";
        $scope.lng = "0";
        $scope.accuracy = "0";
        $scope.error = "";
        // $scope.model = { myMap: undefined };
        // $scope.myMarkers = [];
 
        $scope.showResult = function () {
            return $scope.error == "";
        }
 
        // $scope.mapOptions = {
        //     center: new google.maps.LatLng($scope.lat, $scope.lng),
        //     zoom: 15,
        //     mapTypeId: google.maps.MapTypeId.ROADMAP
        // };
 
        $scope.showPosition = function (position) {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            $scope.accuracy = position.coords.accuracy;
            $scope.$apply();
 
            // var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
            // $scope.model.myMap.setCenter(latlng);
            // $scope.myMarkers.push(new google.maps.Marker({ map: $scope.model.myMap, position: latlng }));
        }
 
        $scope.showError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.error = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.error = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    $scope.error = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.error = "An unknown error occurred."
                    break;
            }
            $scope.$apply();
        }
 
        $scope.getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
            }
            else {
                $scope.error = "Geolocation is not supported by this browser.";
            }
        }
 
        $scope.getLocation();

});
