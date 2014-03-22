'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('multipleInputsSup', function() {
  return {
    restrict: 'E',
    scope: {
      form: '=multipleInputsForm'
    },
    templateUrl: 'src/common/directives/multipleInputsSup.tpl.html',

    link: function (scope, element, attrs) {
      scope.index = Date.now();

      scope.deleteInput = function() {
        delete scope.form[scope.index];
        element.remove();
      };
    }
  };
});