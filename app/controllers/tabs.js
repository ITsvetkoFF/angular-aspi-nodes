'use strict';

angular.module('aspiApp')
  .controller('TabsCtrl', function ($scope) {
    $scope.items = [
      { title:"Dynamic Title 1", content:"Dynamic Item 0" },
      { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
    ];
    $scope.alertMe = function() {
      setTimeout(function() {
        alert("You've selected the alert tab!");
      });
    };
  });
