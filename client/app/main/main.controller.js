'use strict';

angular.module('telusLg2App')
  .controller('MainCtrl', function ($scope, $http, TweeterSearch, LocationResults) {


    $scope.locations = [
        { id: 180, title: "Boston Pizza", address: "400 Progress Avenue, Scarborough, ON M1P 5J1, Canada", lat: "43.77543", lng:"-79.263066" },
        { id: 181, title: "East Side Marios", address: "12 Lebovic Avenue, Toronto, ON M1L 4W1, Canada", lat: "43.7242333",lng:"-79.29024" },
        { id: 182, title: "Wild Wing", address: "1557 The Queensway Unit 1, Etobicoke, ON M8Z 1T8, Canada", lat: "43.6181012",lng:"-79.5390509" },
        { id: 179, title: "St. Louis Bar and Grill", address: "90 Edgeley Boulevard , Unit 106, Concord, ON L4K 5W7, Canada", lat:"43.7966469",lng:"-79.5331189" },
        { id: 178, title: "Golden Thai Restaurant", address: "105 Church Street, Toronto, ON M5C 2G8, Canada", lat:"43.652352",lng:"-79.375134" },
        { id: 154, title: "Pizza Depot", address: "945 Peter Robertson Boulevard, Brampton, ON L6R 0K1, Canada", lat: "43.7477189",lng:"-79.7456055" },
        { id: 177, title: "Geox (Yorkdale Mall)", address: "3401 Dufferin Street, North York, ON M6A 2T9, Canada", lat: "43.725454",lng:"-79.451664" },
        { id: 176, title: "Little Caesars", address: "3055 Argentia Road, Mississauga, ON L5N 8E1, Canada", lat:"43.595088",lng:"-79.78698" },
        { id: 175, title: "Jimmy's Coffee", address: "107 Portland Street, Toronto, ON M5V 3N8, Canada", lat: "43.645281",lng:"-79.400271" },
        { id: 122, title: "One Eleven Office", address: "111 Richmond Street West, Toronto, ON M5H 3K6, Canada", lat: "43.6502837",lng:"-79.3843006" },
    ];
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    $scope.hourlyData;
    var chart;
    $scope.searchrange = 1000;
    $scope.map = {
        center: {latitude: 43.650505, longitude: -79.383989 },
        zoom: 12,
        pan: true,
        options : {panControl:true, tilt:45}
    };
    $scope.options = {scrollwheel: false,pan: true};
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 43.650505,
            longitude: -79.383989
        },
        options: { title: "111 Richmond St. Toronto, Ontario",opacity:0.8 }
    };
    $scope.circles = [
        {
            id: 1,
            center: {
                latitude: 43.650505,
                longitude: -79.383989
            },
            radius: 1000,
            stroke: {
                color: '#6ebe44',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#6ebe44',
                opacity: 0.1
            },
            geodesic: true, // optional: defaults to false
            draggable: false, // optional: defaults to false
            clickable: false, // optional: defaults to true
            editable: false, // optional: defaults to false
            visible: true, // optional: defaults to true
            control: {}
        }
    ];





    $scope.currentLocation = LocationResults.getCurrentLocation();
    console.log("CurrentLocation:" + $scope.currentLocation);



    $scope.setSelectedLocation = function(location) {
        console.log("Setting selected location:" + location.title);
        document.getElementById("contentArea").style.visibility = "visible";
        LocationResults.setCurrentLocation(location);
        $scope.currentLocation = LocationResults.getCurrentLocation();
        console.log("New CurrentLocation:" + $scope.currentLocation);
        //this tells function getReport to function showLast7Days which gets getDayReport. getDayReport tells tweetReports based on location. magic happens in this function.
        $scope.getReport();
        $scope.getOnsiteDataPreGenReport();
        $scope.addLocationToMap();
    }



    $scope.getSelectedLocation = function() {
        console.log("Getting selected location...");
        $scope.currentLocation = LocationResults.getCurrentLocation();
    }

    if($scope.currentLocation!=null) {
        console.log("Showing selected location..." + $scope.currentLocation.lat) ;
        //$scope.addLocationToMap();
        $scope.marker.coords = {
            latitude: $scope.currentLocation.lat,
            longitude: $scope.currentLocation.lng
        };

        $scope.marker.options = {
            title: $scope.currentLocation.title
        };
        $scope.circles[0].radius = $scope.searchrange;
        $scope.map.pan = true;
        $scope.map.center = {
            latitude: $scope.currentLocation.lat,
            longitude: $scope.currentLocation.lng
        };
        $scope.circles[0].center = {
            latitude: $scope.currentLocation.lat,
            longitude: $scope.currentLocation.lng
        };
    }




    $scope.addLocationToMap = function() {
        console.log("Showing selected location...");
        $scope.marker.coords = {
            latitude: $scope.currentLocation.lat,
            longitude: $scope.currentLocation.lng
        };

        $scope.marker.options = {
            title: $scope.currentLocation.title
        };
        $scope.circles[0].radius = $scope.searchrange;
        $scope.map.pan = true;
        $scope.map.center = {
            latitude: $scope.currentLocation.lat,
            longitude: $scope.currentLocation.lng
        };
        $scope.circles[0].center = {
            latitude: $scope.currentLocation.lat,
            longitude: $scope.currentLocation.lng
        };
    }





  })









  .service('LocationResults', function () {
      var currentLocation;
      /////////////////////////////////////this pulls in tweets for each location
      var tweetReports;

      return{
      getCurrentLocation: function () {
         console.log("Service returning currentLocation" + currentLocation);
         return currentLocation;
      },
      setCurrentLocation: function (location) {
         console.log("Service setting currentLocation to " + location);
         currentLocation = location;
      },
      getTweetReports:function () {
         console.log("Service returning tweetReports" + tweetReports);
         return tweetReports;
      },
      setTweetReports: function (reports) {
         console.log("Service setting tweetReports to " + reports);
         tweetReports = reports;
      }
    }
  })









  //ISSUE
  //Request header field Authorization is not allowed by Access-Control-Allow-Headers
  .service('TweeterSearch', function ($resource) {
      return $resource('http://54.85.105.154\\:7777/tweeters?meters=:range&days=:days&top=:top&address=:searchString', {}, {
          query: {method: 'GET', isArray:true, },
      });
  })



  .controller('AccordionDemoCtrl', function ($scope) {
    $scope.oneAtATime = true;
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
      };
  })
