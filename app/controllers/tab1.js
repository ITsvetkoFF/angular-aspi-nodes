'use strict';

angular.module('aspiApp')
  .controller('Tab1Ctrl', function ($scope, simulationDataService) {
    $scope.form = {};
    $scope.form.fieldWidth = '400';
    $scope.form.fieldHeight = '400';
    $scope.form.fieldMaxRange = '100';
    $scope.form.fieldMinRange = '50';
    $scope.form.nodeQuantity = '40';
    $scope.form.locationAccuracy = '10';
    $scope.form.nodeMaxSpeed = '5';
    $scope.form.displayConnections = true;
    $scope.form.displayRanges = true;
    $scope.form.planarization = 'no';

    //BINDING
    simulationDataService.form = $scope.form;
  });
