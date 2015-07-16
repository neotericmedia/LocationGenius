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
     .state('main2', {
       url: '/main2',
       templateUrl: 'app/main/main2.html',
       controller: 'MainCtrl',
     });
  });
