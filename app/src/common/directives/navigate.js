'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('navigate', function($location) {
  return {
    restrict: 'A',
    scope: {},

    link: function (scope, element, attrs) {
      element.on('click', function() {
        $location.$$search = {};

        if (attrs.navigate === 'external') {
          window.location = attrs.navigateParamVal;
        } else {
          $location.search(attrs.navigateParam, attrs.navigateParamVal).path(attrs.navigate);
          if (!scope.$$phase) { scope.$apply(); }
        }
      });
    }
  };
});