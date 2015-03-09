'use strict';

angular
  .module('aspiApp', [
    'ngRoute'
  ])
  .run(function($rootScope) {
    $rootScope.datum = {};
    $rootScope.datum.pointData = [];

    $rootScope.helpers = {};
    $rootScope.helpers.euclidDistance = function(ax, ay, bx, by) {
      return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
    };

  });
