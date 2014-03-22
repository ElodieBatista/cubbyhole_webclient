'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('multipleInputsShareLink', function($compile) {
  return {
    restrict: 'E',
    scope: {
      form: '=multipleInputsForm'
    },
    templateUrl: 'src/common/multipleInputsShareLink/multipleInputsShareLink.tpl.html',

    link: function (scope, element, attrs) {
      scope.addInput = function() {
        $(element).find('.multiple-inputs-container:last-of-type').append($compile('<multiple-inputs-share-link-sup multiple-inputs-form="form"></multiple-inputs-share-link-sup>')(scope));
      };
    }
  };
});