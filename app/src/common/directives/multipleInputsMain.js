'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('multipleInputsMain', function($compile) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'src/common/directives/multipleInputsMain.tpl.html',

    link: function (scope, element, attrs) {
      scope.myform = {
        emails: {}
      };

      scope.addInput = function() {
        $(element).find('.multiple-inputs-container:last-of-type').append($compile('<multiple-inputs-sup multiple-inputs-form="myform.emails"></multiple-inputs-sup>')(scope));
      };

      scope.submitInputs = function(form) {
        console.log(form);
      };
    }
  };
});