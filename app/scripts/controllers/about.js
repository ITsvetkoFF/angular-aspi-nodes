'use strict';

/**
 * @ngdoc function
 * @name aspiApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the aspiApp
 */
angular.module('aspiApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
