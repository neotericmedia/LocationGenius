'use strict';

angular.module('telusLg2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: 'true'
     })
     .state('policy', {
      url: '/policy',
      templateUrl: 'app/main/policy.html',
      controller: 'MainCtrl',
      authenticate: 'true'
    })
     .state('main2', {
       url: '/main2',
       templateUrl: 'app/main/main2.html',
       controller: 'MainCtrl',
    })
    .state('main3', {
     url: '/main3',
     templateUrl: 'app/main/main3.html',
     controller: 'MainCtrl',
  });
  });
