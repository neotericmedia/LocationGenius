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









  //ISSUE
  //Request header field Authorization is not allowed by Access-Control-Allow-Headers
  .service('TweeterSearch', function ($resource) {
      return $resource('http://54.85.105.154:7777/tweeters?meters=:range&days=:days&top=:top&address=:searchString', {}, {
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
   //sample call
   //http://54.86.239.240:7777/twitterdayreports/180?days=7&top=








   .service('OnsitePregenReport', function ($resource) {
      return $resource('http://54.85.105.154:80/onsitereport/:buildingId?date=:dt', {}, {
      //return $resource('http://localhost\\:9100/onsitereport/:buildingId?date=:dt', {}, {
      //http://52.2.128.53:9100/onsitereport/180?date=2015-04-02
          query: {method: 'GET', isArray:false }
      });
   })











  //  .service('OnsiteReport', function ($resource) {
  //    return $resource('http://ironman.simplygood.com/report/run_report/', {}, {
  //        fetch: {
  //            method: 'POST',
  //            isArray:false ,
  //            url : 'http://ironman.simplygood.com/report/run_report/',
  //            headers : {'Content-Type': 'application/x-www-form-urlencoded','Content-Type': 'application/json;charset=UTF-8'}
  //        }
  //    });
  //  })
