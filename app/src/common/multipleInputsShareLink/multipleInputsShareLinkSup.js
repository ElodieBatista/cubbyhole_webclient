'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('multipleInputsShareLinkSup', function() {
  return {
    restrict: 'E',
    scope: {
      form: '=multipleInputsForm'
    },
    templateUrl: 'src/common/multipleInputsShareLink/multipleInputsShareLinkSup.tpl.html',

    link: function (scope, element, attrs) {
      scope.index = Date.now();

      scope.form.member[scope.index] = {
        email: ''
      };

      scope.deleteInput = function() {
        delete scope.form.member[scope.index];
        element.remove();
      };
    }
  };
});