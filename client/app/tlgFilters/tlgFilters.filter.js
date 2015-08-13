'use strict';

angular.module('telusLg2App')
  // .filter('capitalize', function () {
  //
  //  //   return function(input, $scope) {
  //  //    if (input!=null)
  //  //    input = input.toLowerCase();
  //  //    return input.substring(0,1).toUpperCase()+input.substring(1);
  //  //  }
  //
  // });



    .filter('capitalize', function() {
      return function(input, all) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
      }
    });
