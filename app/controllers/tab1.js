'use strict';

angular.module('aspiApp')
  .controller('Tab1Ctrl', function ($scope, $rootScope) {
    $rootScope.form = {};
    $rootScope.form.fieldWidth = '600';
    $rootScope.form.fieldHeight = '600';
    $rootScope.form.fieldMaxRange = '100';
    $rootScope.form.fieldMinRange = '50';
    $rootScope.form.nodeQuantity = '40';
    $rootScope.form.locationAccuracy = '0';
  });
