'use strict';

angular.module('telusLg2App')


  .service('LocationResults', function () {
    var currentLocation;
    var tweetReports;

    return {
      getCurrentLocation: function () {
        return currentLocation;
      },
      setCurrentLocation: function (location) {
        currentLocation = location;
      },
      getTweetReports: function () {
        return tweetReports;
      },
      setTweetReports: function (reports) {
        tweetReports = reports;
      }
    }
  })





  .service('TweeterSearch', function ($resource) {
    return $resource('/api/twitter/tweeters?meters=:range&days=:days&top=:top&address=:searchString', {}, {
      query: {method: 'GET', isArray: true},
    });
  })


  .service('TweeterResults', function () {
    var tweeters;
    return {
      getTweeters: function () {
        return tweeters;
      },
      setTweeters: function (results) {
        tweeters = results;
      }
    }
  })


  .service('TweetReports', function ($resource) {
    return $resource('/api/social/:locationId?days=:days&top=100', {}, {
      query: {method: 'GET', isArray: false},
    });
  })




  .service('OnsitePregenReport', function ($resource) {
    return $resource('/api/onsite/:buildingId?date=:dt', {}, {
      query: {
        method: 'GET',
        isArray: false
      }
    });
  })


  .service('CarrierPregenReport', function ($resource) {
    return $resource('/api/carrier/:locationId/:days?endDate=:endDate', {}, {
      query: {method: 'GET', isArray: false},
    });
  })
