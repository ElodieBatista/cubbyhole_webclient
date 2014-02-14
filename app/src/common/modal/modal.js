'use strict';

var module = angular.module('webApp');

/**
 * Defines the way to display a spinner
 */
module.directive('modal', function() {
    return {
        restrict: 'E',
        scope: {
            modalOpts: "=modalOpts"
        },
        templateUrl: '/src/common/modal/modal.tpl.html'
    };
});