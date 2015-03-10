'use strict';

angular.module('aspiApp')
  .controller('TabsCtrl', function ($scope, simulationDataService) {
    $scope.tabdata = {};
    $scope.tabdata.itemsDisabledBeforeSimulation = "false";
    $scope.$watch(
      // This is the important part
      function() {
        return simulationDataService.stepNumber;
      },
      function(newValue) {
        if (newValue > 0) {
          $scope.tabdata.itemsDisabledBeforeSimulation = "false";
        }
      },
      true
    );
    $scope.redrawTab2 = function() {
      //TODO:it smells
      angular.element(document.getElementById('Tab2CtrlElement')).scope().redrawTable();
    }
  });
