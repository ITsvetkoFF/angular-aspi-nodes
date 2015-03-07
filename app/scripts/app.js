'use strict';

/**
 * @ngdoc overview
 * @name aspiApp
 * @description
 * # aspiApp
 *
 * Main module of the application.
 */
angular
  .module('aspiApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
