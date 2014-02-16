'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a spinner
 */
module.directive('modal', function($compile) {
    return {
        restrict: 'E',
        scope: {
            modalOpts: '=modalOpts'
        },
        templateUrl: '/src/common/modal/modal.tpl.html',

        link: function(scope, elem, attrs) {
            scope.$watch('modalOpts.template', function(newValue, oldValue) {
                if (newValue !== undefined && newValue !== null) {
                    var htmlStr = $compile(scope.modalOpts.template)(scope);
                    $('#modal-body-custom').append(htmlStr);
                }
            });
        }
    };
});