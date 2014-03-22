'use strict';

var module = angular.module('webApp');

module.directive('multipleInputsShareItemSup', function() {
  return {
    restrict: 'E',
    scope: {
      form: '=multipleInputsForm'
    },
    templateUrl: 'src/common/multipleInputsShareItem/multipleInputsShareItemSup.tpl.html',

    link: function (scope, element, attrs) {
      scope.index = Date.now();

      scope.form.member[scope.index] = {
        email: '',
        permissions: 0
      };

      scope.deleteInput = function() {
        delete scope.form.member[scope.index];
        element.remove();
      };
    }
  };
});