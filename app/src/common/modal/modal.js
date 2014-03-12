'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a spinner
 */
module.directive('modal', function($compile) {
  return {
    restrict: 'E',
    scope: {
      modalOpts: '=modalOpts',
      modalform: '=modalform'
    },
    templateUrl: '/src/common/modal/modal.tpl.html',

    link: function(scope, elem, attrs) {
      scope.$watch('modalOpts.template', function(newValue, oldValue) {
        if (newValue !== undefined && newValue !== null) {
          $(elem).find('#modal-body-custom').html($compile(scope.modalOpts.template)(scope));
        }
      });

      $(elem).on('shown.bs.modal', function (e) {
        $(this).find('input:not([type="file"]):first').focus();
      });

      $(elem).on('hide.bs.modal', function (e) {
        scope.modalform.name = '';
        $(this).find('.input-text-empty-onclose').val('');
      });
    }
  };
});