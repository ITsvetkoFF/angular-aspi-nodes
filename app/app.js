'use strict';

angular
  .module('aspiApp', [
  ])
  .run(function($rootScope) {
    $rootScope.helpers = {};
    function Point(x, y){
      this.x = x || 0;
      this.y = y || 0;
    };
    Point.prototype.x = null;
    Point.prototype.y = null;
    Point.prototype.add = function(v){
      return new Point(this.x + v.x, this.y + v.y);
    };
    Point.prototype.degreesTo = function(v){
      var dx = this.x - v.x;
      var dy = this.y - v.y;
      var angle = Math.atan2(dy, dx); // radians
      return angle * (180 / Math.PI); // degrees
    };
    Point.prototype.distanceTo = function(v){
      var x = this.x - v.x;
      var y = this.y - v.y;
      return Math.sqrt(x * x + y * y);
    };
    Point.prototype.equals = function(toCompare){
      return this.x == toCompare.x && this.y == toCompare.y;
    };
    Point.prototype.toString = function(){
      return "(x=" + this.x + ", y=" + this.y + ")";
    };

    Point.interpolate = function(pt1, pt2, f){
      return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
    };
    Point.polar = function(len, angle){
      return new Point(len * Math.cos(angle), len * Math.sin(angle));
    };
    Point.distance = function(pt1, pt2){
      var x = pt1.x - pt2.x;
      var y = pt1.y - pt2.y;
      return Math.sqrt(x * x + y * y);
    };
    $rootScope.helpers.Point = Point;
  });
