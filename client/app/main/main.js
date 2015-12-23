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
    .state('password', {
     url: '/password',
     templateUrl: 'app/main/password.html',
     controller: 'PasswordCtrl'
    })
    .state('callSupport', {
     url: '/callSupport',
     templateUrl: 'app/main/callSupport.html',
     controller: 'SupportCtrl'
    })
    .state('main2', {
      url: '/main2',
      templateUrl: 'app/main/main2.html',
      controller: 'MainCtrl',
      authenticate: 'true'
    })
  });
