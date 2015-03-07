'use strict';

/**
 * @ngdoc function
 * @name aspiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the aspiApp
 */
angular.module('aspiApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
