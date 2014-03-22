'use strict';

var module = angular.module('webApp');

/**
 *
 */
module.directive('multipleInputsShareItem', function($compile) {
  return {
    restrict: 'E',
    scope: {
      form: '=multipleInputsForm'
    },
    templateUrl: 'src/common/multipleInputsShareItem/multipleInputsShareItem.tpl.html',

    link: function (scope, element, attrs) {
      scope.addInput = function() {
        $(element).find('.multiple-inputs-container:last-of-type').append($compile('<multiple-inputs-share-item-sup multiple-inputs-form="form"></multiple-inputs-share-item-sup>')(scope));
      };
    }
  };
});