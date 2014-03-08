'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('inputanim', function() {
  return {
    restrict: 'A',
    scope: {},

    link: function (scope, element, attrs) {
      element.on('focus', function() {
        $(this).parent().addClass('input-prepend-active');
      });

      element.on('blur', function() {
        $(this).parent().removeClass('input-prepend-active');
      });
    }
  };
});