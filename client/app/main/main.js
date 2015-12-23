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
    .state('support', {
     url: '/support',
     templateUrl: 'app/main/support.html',
     controller: 'MainCtrl',
     authenticate: 'true'
    })
    .state('success', {
     url: '/success',
     templateUrl: 'app/main/success.html',
     controller: 'MainCtrl',
     authenticate: 'true'
    })
    .state('password', {
     url: '/password',
     templateUrl: 'app/main/password.html',
     controller: 'PasswordCtrl'
    })
    .state('success2', {
     url: '/success2',
     templateUrl: 'app/main/success2.html',
     controller: 'PasswordCtrl'
    })
    .state('main2', {
      url: '/main2',
      templateUrl: 'app/main/main2.html',
      controller: 'MainCtrl',
      authenticate: 'true'
    })
  });
