'use strict';

angular.module('aspiApp')
  .controller('SimulationCtrl', function ($scope, simulationDataService) {
    //---------------------HELPERS
    //----------------------------
    var euclidDistance = function(ax, ay, bx, by) {
      return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
    };
    var populateField = function (nQ, width, height, maxR, minR, speed) {
      return d3.range(nQ).map(function (element,index) {
        return {"x": Math.random() * width,
          "y": Math.random() * height,
          "r": Math.random() * (maxR - minR) + minR,
          "id": index,
          "speed": Math.random() * speed,
          "direction": Math.random() * 2 * Math.PI,
          "HopOneNeighbors": []};
      });
    };
    var createQuadtree = function () {
      var qData = simulationDataService.pointData;
      var qtr = d3.geom.quadtree()
        .extent([[-1, -1], [parseInt(simulationDataService.form.fieldWidth) + 1, parseInt(simulationDataService.form.fieldHeight) + 1]])
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
      (qData);

      // Share data (or rewrite)
      simulationDataService.quadTree = qtr;
    };
    var drawNodesFromQuadtree = function(svg) {
      var quadtree = simulationDataService.quadTree;

      svg.selectAll("*").remove();
      svg.selectAll(".node")
        .data(nodes(quadtree))
        .enter().append("rect")
        .attr("class", "node")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })
        .attr("width", function(d) { return d.width; })
        .attr("height", function(d) { return d.height; });

      var point = svg.selectAll(".point")
        .data(plain(quadtree))
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 4);

      function nodes(quadtree) {
        var nodes = [];
        quadtree.visit(function(node, x1, y1, x2, y2) {
          nodes.push({x: x1, y: y1, width: x2 - x1, height: y2 - y1});
        });
        return nodes;
      }

      function plain(quadtree) {
        var data = [];
        quadtree.visit(function(node, x1, y1, x2, y2) {
          var p = node.point;
          if (p) {
            data.push({x: node.x, y: node.y});
          }
        });
        return data;
      }
    };
    var defineOneHopNeighbors = function() {
      var points = simulationDataService.pointData;
      var len = points.length;
      for (var i=0;i<len-1;i++) {
        var node = points[i];
        var j;
        for (j=i+1;j<len;j++) {
          var candidate = points[j];

          var distToDraw = euclidDistance(node.x,node.y,candidate.x,candidate.y);
          if (Math.min(node.r,candidate.r)>distToDraw) {
            simulationDataService.pointData[i].HopOneNeighbors.push(candidate.id);
            simulationDataService.pointData[j].HopOneNeighbors.push(node.id);
          }

        }
      }
    };
    var drawNodes = function(svg) {
      var pointData = simulationDataService.pointData;
      svg.selectAll("*").remove();

      svg.selectAll(".point")
        .data(pointData)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", 2)
        .attr("id", function(d) { return "point"+d.id; });
      if (simulationDataService.form.displayRanges) {
        svg.selectAll(".point-radius")
          .data(pointData)
          .enter().append("circle")
          .attr("class", "point-radius")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", function(d) { return d.r; });
      }

      if (simulationDataService.form.displayConnections) {
        var linkGroup = svg.append('g').attr("id", "linkGroup");

        var neighborsArrayName = "HopOneNeighborsSubjective";

        //HANDLE PLANARIZATIONS (JUST CREATE NEW ARRAY WITH HOP1NEIGHBORS)
        if (simulationDataService.form.planarization == "rng") {
          var pointData = simulationDataService.pointData;
          pointData.forEach(function(element,index){
            var uX = element.subX;
            var uY = element.subY;
            var actualNeighbors = element.HopOneNeighborsSubjective;
            var N = actualNeighbors.length;
            if (N) {
              var HopOneSubjectiveNeighborsRNG = actualNeighbors;
              for(var v=0;v<N;v++) {
                var vX = actualNeighbors[v].x;
                var vY = actualNeighbors[v].y;
                for(var w=0;w<N;w++){
                  if (v != w) {
                    var wX = actualNeighbors[w].x;
                    var wY = actualNeighbors[w].y;
                    if (euclidDistance(uX, uY, vX, vY) > Math.max(euclidDistance(uX, uY, wX, wY), euclidDistance(vX, vY, wX, wY))) {
                      HopOneSubjectiveNeighborsRNG = HopOneSubjectiveNeighborsRNG.filter(function(item) {
                        return item.id !== actualNeighbors[v].id;
                      });
                    }
                  }
                }
              }
              pointData[index].HopOneNeighborsSubjectiveRNG = HopOneSubjectiveNeighborsRNG;
            } else {
              pointData[index].HopOneNeighborsSubjectiveRNG = [];
            }
          });
          neighborsArrayName += "RNG";
        }
        if (simulationDataService.form.planarization == "ggMy") {
          var pointData = simulationDataService.pointData;
          pointData.forEach(function(element,index){
            var uX = element.subX;
            var uY = element.subY;
            var actualNeighbors = element.HopOneNeighborsSubjective;
            var N = actualNeighbors.length;
            if (N) {
              var HopOneSubjectiveNeighborsGGMy = actualNeighbors;
              for(var v=0;v<N;v++) {
                var vX = actualNeighbors[v].x;
                var vY = actualNeighbors[v].y;
                var mX = (vX+uX)/2;
                var mY = (vY+uY)/2;
                for(var w=0;w<N;w++){
                  if (v != w) {
                    var wX = actualNeighbors[w].x;
                    var wY = actualNeighbors[w].y;
                    //check if w is v neighbor also.
                    var vNeighbors = pointData[actualNeighbors[v].id].HopOneNeighborsSubjective;
                    var idW = actualNeighbors[w].id;
                    var isNeighbor = false;
                    vNeighbors.forEach(function(el,ind) {
                      if (el.id == idW) isNeighbor = true;
                    });
                    if ((euclidDistance(mX, mY, wX, wY) < euclidDistance(uX, uY, mX, mY)) && isNeighbor ) {
                      HopOneSubjectiveNeighborsGGMy = HopOneSubjectiveNeighborsGGMy.filter(function(item) {
                        return item.id !== actualNeighbors[v].id;
                      });
                    }
                  }
                }
              }
              pointData[index].HopOneNeighborsSubjectiveGGMy = HopOneSubjectiveNeighborsGGMy;
            } else {
              pointData[index].HopOneNeighborsSubjectiveGGMy = [];
            }
          });
          neighborsArrayName += "GGMy";

        }
        if (simulationDataService.form.planarization == "gg") {
          var pointData = simulationDataService.pointData;
          pointData.forEach(function(element,index){
            var uX = element.subX;
            var uY = element.subY;
            var actualNeighbors = element.HopOneNeighborsSubjective;
            var N = actualNeighbors.length;
            if (N) {
              var HopOneSubjectiveNeighborsGG = actualNeighbors;
              //full copy of karp-kung algorithm but I am pushing nodes, not eliminating
              for(var v=0;v<N;v++) {
                var vX = actualNeighbors[v].x;
                var vY = actualNeighbors[v].y;
                var mX = (vX+uX)/2;
                var mY = (vY+uY)/2;
                for(var w=0;w<N;w++){
                  if (v != w) {
                    var wX = actualNeighbors[w].x;
                    var wY = actualNeighbors[w].y;
                    if (euclidDistance(mX, mY, wX, wY) < euclidDistance(uX, uY, mX, mY)) {
                      HopOneSubjectiveNeighborsGG = HopOneSubjectiveNeighborsGG.filter(function(item) {
                        return item.id !== actualNeighbors[v].id;
                      });
                    }
                  }
                }
              }
              pointData[index].HopOneNeighborsSubjectiveGG = HopOneSubjectiveNeighborsGG;
            } else {
              pointData[index].HopOneNeighborsSubjectiveGG = [];
            }
          });
          neighborsArrayName += "GG";

        }




        //TODO how to do this in D3 without nested foreach?
        var pointData = simulationDataService.pointData;
        pointData.forEach(function (element, index) {
          var datum = element[neighborsArrayName];
          if (datum && datum.length) {
            datum.forEach(function (e, i) {
              linkGroup
                .append("line")
                .attr("x1", element.subX)
                .attr("y1", element.subY)
                .attr("x2", e.x)
                .attr("y2", e.y)
                .attr("class", "link");
            })

          }
        });

      }


    };
    var generateSubjectiveData = function() {
      var pointData = simulationDataService.pointData;
      pointData.forEach(function(element,index){

        var mistake = Math.random()*parseInt(simulationDataService.form.locationAccuracy,10);
        var mistakeDirection = Math.random()*2*Math.PI;

        pointData[index].subX = element.x + mistake*Math.cos(mistakeDirection);
        pointData[index].subY = element.y + mistake*Math.sin(mistakeDirection);
      });
      // Share data (or rewrite)
      simulationDataService.pointData = pointData;
    };
    var getSubjectiveLocations = function() {
      var pointData = simulationDataService.pointData;
      pointData.forEach(function(element,index){
        var actualNeighbors = element.HopOneNeighbors;
        if (actualNeighbors.length) {
          var HopOneSubjectiveNeighbors = [];
          actualNeighbors.forEach(function(el){
            var neib = pointData[el];
            HopOneSubjectiveNeighbors.push({"x":neib.subX, "y":neib.subY, "id":el});
          });
          pointData[index].HopOneNeighborsSubjective = HopOneSubjectiveNeighbors;
        } else {
          pointData[index].HopOneNeighborsSubjective = [];
        }
      });
    };
    var changePointData = function() {
      var pointData = simulationDataService.pointData;
      pointData.forEach(function(element,index){
        var newX = element.x + element.speed*Math.cos(element.direction);
        if (newX>0 && newX<width) {
          element.x = newX;
        } else {
          element.direction = Math.PI - element.direction;
          element.x = element.x + element.speed*Math.cos(element.direction);
        }

        var newY = element.y - element.speed*Math.sin(element.direction);
        if (newY>0 && newY<height) {
          element.y = newY
        } else {
          element.direction = - element.direction;
          element.y = element.y - element.speed*Math.sin(element.direction);
        }
      });
      // Share data (or rewrite)
      simulationDataService.pointData = pointData;

    };
    var defineMainNodeGroup = function() {
      var defined = false;
      var MAIN_GROUP_CAPACITY = 0.6;
      var pointData = simulationDataService.pointData;
      var candidatesQuantity = pointData.length;
      var tryN = 0;
      var mainGroup;
      while (!defined) {
        tryN++;
        var tempMainGroup = [];
        var searchStack = [];
        var candidateIndex = Math.floor(Math.random() * candidatesQuantity);
        var candidate = pointData[candidateIndex];
        searchStack.push(candidate.id);
        while (searchStack.length > 0) {
          var candidateId = searchStack.pop();
          tempMainGroup.push(candidateId);
          var arr = pointData[candidateId].HopOneNeighbors;
          if (arr.length>0) {
            arr.forEach(function(element, index, array) {
              if (tempMainGroup.indexOf(element) == -1 && searchStack.indexOf(element) == -1) {
                searchStack.push(element);
              }
            });
          }
        };
        if (tempMainGroup.length>MAIN_GROUP_CAPACITY*nQ) {mainGroup = tempMainGroup; defined = true; break; }
        if (tryN == Math.ceil(nQ/5)) {mainGroup = false; break;}
      };
      return mainGroup;
    };
    var performGreedyRouting = function(sourceID, destinationID) {
      var isFound =false;
      var destinationX = $scope.datum.pointSubjectiveData[destinationID].x;
      var destinationY = $scope.datum.pointSubjectiveData[destinationID].y;
      var neighborsArray = $scope.datum.pointSubjectiveData[sourceID].HopOneNeighbors;
      var currentPoint = $scope.datum.pointSubjectiveData[sourceID];
      var thisPointId = sourceID; //ID of a point from which we're searching; It MAY change after the search;
      while (!isFound) {

        if (neighborsArray.length) {
          neighborsArray.forEach(function(element,index) {
            if (euclidDistance(currentPoint.x,currentPoint.y,destinationX,destinationY) > euclidDistance(element.x,element.y,destinationX,destinationY) ) {
              currentPoint = element;
            }
          });
        } else {
          return false;
        }
        if (currentPoint.id == destinationID) {return true;}
        if (currentPoint.id == thisPointId) {return false;}
        thisPointId = currentPoint.id;

        neighborsArray = $scope.datum.pointSubjectiveData[thisPointId].HopOneNeighbors;

      }
    };
    var testGPSR = function() {
      var mainGroup = defineMainNodeGroup();
      if (mainGroup) {
        var GPSRLosses = 0;
        for (var i = randomGPSRIterations; i > 0; i--) {
          var sourceId,
            destinationId;
          do {
            sourceId = Math.floor(Math.random() * nQ);
          } while (mainGroup.indexOf(sourceId) == -1);
          do {
            destinationId = Math.floor(Math.random() * nQ);
          } while (destinationId != sourceId && mainGroup.indexOf(destinationId) == -1);

          if (performGreedyRouting(sourceId, destinationId) == false) {
            GPSRLosses++;
          }
        }
        $scope.datum.GPSRLosses = d3.round(GPSRLosses / randomGPSRIterations * 100, 1) + "%";
      } else {
        $scope.datum.GPSRLosses = "Can't calculate - less than " + MAIN_GROUP_CAPACITY*100 + "% nodes are connected";
      }
    };

    $scope.populateSimulation = function() {
      var draw = (simulationDataService.pointData.length > 0)?(confirm("You will destroy all your Point Data!") == true):true;

      if (draw) {
        var width = parseInt(simulationDataService.form.fieldWidth,10),
          height = parseInt(simulationDataService.form.fieldHeight,10),
          maxR = parseInt(simulationDataService.form.fieldMaxRange,10),
          minR = parseInt(simulationDataService.form.fieldMinRange,10),
          speed = parseInt(simulationDataService.form.nodeMaxSpeed,10),
          nQ = parseInt(simulationDataService.form.nodeQuantity,10);

        simulationDataService.pointData = populateField(nQ, width, height, maxR, minR, speed);
        simulationDataService.stepNumber++;
        defineOneHopNeighbors();
        generateSubjectiveData();
        getSubjectiveLocations();

        angular.element(document.getElementById('Tab2CtrlElement')).scope().redrawTable();
        $scope.redrawSimulation();
      }
    };

    $scope.redrawSimulation = function() {
      if (simulationDataService.stepNumber>0) {

        var width = parseInt(simulationDataService.form.fieldWidth,10),
          height = parseInt(simulationDataService.form.fieldHeight,10),
          maxR = parseInt(simulationDataService.form.fieldMaxRange,10),
          minR = parseInt(simulationDataService.form.fieldMinRange,10),
          speed = parseInt(simulationDataService.form.nodeMaxSpeed,10),
          nQ = parseInt(simulationDataService.form.nodeQuantity,10);

        var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);
        drawNodes(svg);
        $scope.numberOfLinks = document.getElementById("mainSvg").getElementsByTagName("line").length;
        $scope.averegeDegreeOfLinks = $scope.numberOfLinks/nQ;
      }
    };



  });
