'use strict';

angular.module('telusLg2App')



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






  .service('NetworkDataA', function ($resource) {
      return $resource('http://192.99.16.178:9105/api/v1/carrierreport/180/5?endDate=2014-08-19', {}, {
          query: {method: 'GET', isArray:true, },
      });
  })






  //ISSUE
  //Request header field Authorization is not allowed by Access-Control-Allow-Headers
  .service('TweeterSearch', function ($resource) {
      return $resource('http://54.85.105.154:7777/tweeters?meters=:range&days=:days&top=:top&address=:searchString', {}, {
      //return $resource('http://52.3.87.216:9100/twitter/tweeters?meters=:range&days=:days&top=:top&address=:searchString', {}, {
          query: {method: 'GET', isArray:true, },
      });
  })







  .service('TweeterResults', function () {
    var tweeters;
    return{
        getTweeters: function () {
            return tweeters;
        },
        setTweeters: function (results) {
            tweeters = results;
        }
    }
  })









   .service('TweetReports', function ($resource) {
      return $resource('http://54.86.239.240:7777/twitterdayreports/:locationId?days=:days&top=100', {}, {
          query: {method: 'GET', isArray:false},
      });
   })



   .service('OnsitePregenReport', function ($resource) {
      //return $resource('http://54.85.105.154:80/onsitereport/:buildingId?date=:dt', {}, {
    //api/onsite/180?date=2015-04-26
      console.log( "Getting /api/onsite/"  );
      return $resource('/api/onsite/:buildingId?date=:dt', {}, {
          query: {
             method: 'GET',
             isArray:false
          }
      });
   })


// talks to Backend carrier data API route
  .service('CarrierPregenReport', function ($resource) {
    //var params = {"locationId": $scope.currentLocation.buildingId, "days":numDays, "endDate":"2014-08-18"};
    return $resource('/api/carrier/:locationId/:days?endDate=:endDate', {}, {
      query: {method: 'GET', isArray:true},
    });
  })
