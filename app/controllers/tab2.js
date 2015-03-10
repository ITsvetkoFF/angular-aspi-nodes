'use strict';

angular.module('aspiApp')
  .controller('Tab2Ctrl', function ($scope, simulationDataService) {

    //---------------------HELPERS
    //----------------------------
    var tabulateData = function(data, columns) {
      var table = d3.select("#megaTable");
      table.selectAll("*").remove();
      var thead = table.append("thead"),
          tbody = table.append("tbody");
      // append the header row
      thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

      // create a row for each object in the data
      var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr")
        .on("mouseover", function(d) {
          d3.select("#mainSvg").select("#point"+ d.id)
            .attr("class","point selected")
        })
        .on("mouseout", function(d) {
          d3.select("#mainSvg").select("#point"+ d.id)
            .attr("class","point")
        });

      // create a cell in each row for each column
      var cells = rows.selectAll("td")
        .data(function(row) {
          return columns.map(function(column) {
            return {column: column, value: row[column]};
          });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
        .html(function(d) { var ret = d3.round(d.value,2); return isNaN(ret) ? d.value : ret;})


      return table;

    }

    $scope.redrawTable = function() {
      if (simulationDataService.pointData.length) {
        tabulateData(simulationDataService.pointData, ["x", "y", "subX", "subY", "r", "id", "speed", "HopOneNeighbors"]);
      }
    }
  });
