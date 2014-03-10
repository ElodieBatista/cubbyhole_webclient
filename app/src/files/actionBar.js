'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display the action bar
 */
module.directive('actionBar', function() {
  return {
    restrict: 'E',
    templateUrl: '/src/files/actionBar.tpl.html'
  };
});