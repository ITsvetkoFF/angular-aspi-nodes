'use strict';

angular.module('aspiApp')
  .controller('TabsCtrl', function ($scope, simulationDataService) {
    $scope.$watch(
      // TODO: IT SMELLLSS
      function() {
        return simulationDataService.stepNumber == 0;
      },
      function(newValue) {
        $scope.tab2disabled = newValue;
      }
    );
  });
